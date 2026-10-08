const fs = require('node:fs');
const path = require('node:path');

// Run a dedicated headless Chrome with WebGL and --remote-debugging-port=9223.
async function main() {
  const port = process.argv[2] || '9223';
  const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then(r => r.json());
  const target = targets.find(t => t.type === 'page');
  if (!target) throw new Error('No Chrome page found.');
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let id = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (pending.has(message.id)) {
      const { resolve, reject, timeout } = pending.get(message.id);
      clearTimeout(timeout);
      pending.delete(message.id);
      message.error ? reject(new Error(message.error.message)) : resolve(message.result);
    }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    const timeout = setTimeout(() => {
      pending.delete(requestId);
      reject(new Error(`Timed out: ${method}`));
    }, 90000);
    pending.set(requestId, { resolve, reject, timeout });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const waitFor = async (expression, label, timeout = 180000) => {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (await evaluate(expression)) return;
      await delay(500);
    }
    throw new Error(`Timed out waiting for ${label}; capture stopped.`);
  };
  const output = path.join(__dirname, 'screenshots');
  fs.mkdirSync(output, { recursive: true });
  const viewport = (width, height, mobile = false) => send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: 1, mobile,
  });
  const load = async () => {
    await send('Page.navigate', { url: 'http://127.0.0.1:3000' });
    await waitFor('document.querySelector("#environment-controls") !== null', 'page hydration');
    await evaluate('document.fonts.ready.then(() => true)');
    // Wait for the actual canvas frame rather than only its surrounding UI.
    await evaluate(`new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => image.decode().then(() => resolve(true), reject);
      image.onerror = () => reject(new Error('Hero frame failed to load'));
      image.src = '/frames/ezgif-frame-001.png';
    })`);
    await evaluate(`document.head.insertAdjacentHTML('beforeend', '<style>nextjs-portal{display:none!important}</style>')`);
    await delay(2500);
  };
  const settleImages = async selector => {
    await waitFor(`Array.from(document.querySelector(${JSON.stringify(selector)}).querySelectorAll('img')).every(img => img.complete && img.naturalWidth > 0)`, `${selector} images`);
    await evaluate(`Promise.all(Array.from(document.querySelector(${JSON.stringify(selector)}).querySelectorAll('img')).map(img => img.decode())).then(() => true)`);
    await delay(1800);
  };
  const capture = async (name, selector) => {
    const clip = selector ? await evaluate(`(() => {
      const rect = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();
      return {x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: rect.height, scale: 1};
    })()`) : undefined;
    const { data } = await send('Page.captureScreenshot', {
      format: 'jpeg', quality: 95, captureBeyondViewport: !!clip, ...(clip ? { clip } : {}),
    });
    fs.writeFileSync(path.join(output, `${name}.jpg`), Buffer.from(data, 'base64'));
    console.log(`Captured ${name}${clip ? ` (${Math.round(clip.width)} x ${Math.round(clip.height)})` : ''}`);
  };
  try {
    await send('Page.enable');
    await viewport(1440, 1000);
    await load();
    await capture('desktop-hero');
    await evaluate('window.scrollTo({top: innerHeight * 4.45, behavior: "instant"})');
    await evaluate(`new Promise((resolve, reject) => {
      const image = new Image(); image.onload = () => image.decode().then(() => resolve(true), reject);
      image.onerror = reject; image.src = '/frames/ezgif-frame-149.png';
    })`);
    await delay(4000);
    await capture('exploded-view');
    for (const [selector, name] of [['#bike-matrix', 'bike-matrix'], ['#environment-controls', 'garage-studio']]) {
      // Fit the entire section so lazy images and reveal observers see all cards.
      const height = await evaluate(`Math.ceil(document.querySelector('${selector}').getBoundingClientRect().height)`);
      await viewport(1440, height);
      await evaluate(`document.querySelector('${selector}').scrollIntoView({block:'start',behavior:'instant'})`);
      await settleImages(selector);
      if (name === 'garage-studio') {
        await waitFor(`!!customElements.get('model-viewer') && document.querySelector('model-viewer')?.loaded === true`, 'rendered 3D bike', 300000);
        await evaluate(`(() => {
          const viewer = document.querySelector('model-viewer');
          viewer.removeAttribute('auto-rotate');
          viewer.interactionPrompt = 'none';
          viewer.dispatchEvent(new Event('load', {bubbles: true}));
          viewer.cameraOrbit = '45deg 76deg auto';
          viewer.jumpCameraToGoal();
        })()`);
        await delay(2500);
      }
      await evaluate(`document.querySelector('[aria-label="Enable background sound"]').style.visibility = 'hidden'`);
      await capture(name, selector);
    }
    // Reload so the canvas initializes at the mobile dimensions.
    await viewport(390, 844, true);
    await load();
    await capture('mobile-hero');
  } finally {
    socket.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
