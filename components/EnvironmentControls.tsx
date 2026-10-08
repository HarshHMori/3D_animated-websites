"use client";

import Image from "next/image";
import {
  Box,
  Flame,
  Gauge,
  Layers,
  Pause,
  Play,
  RefreshCcw,
  RefreshCw,
  Search,
  SkipBack,
  SkipForward,
  Zap,
} from "lucide-react";
import {
  KeyboardEvent,
  PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import styles from "./EnvironmentControls.module.css";

const AMBIENCE_PRESETS = [
  { value: 30, color: "#f64f9a", name: "Pit lane" },
  { value: 65, color: "#ff752c", name: "Track" },
  { value: 100, color: "#a875ff", name: "Night" },
] as const;

const TEMPERATURE_MODES = [
  { id: "warmup", label: "WARMUP", value: 58, Icon: Flame },
  { id: "track", label: "TRACK", value: 82, Icon: Gauge },
  { id: "qualify", label: "QUALIFY", value: 98, Icon: Zap },
] as const;

const MODEL_LIBRARY = [
  { id: 0, name: "Apex V4 Superbike", detail: "142k Poly  •  PBR", label: "V4", tone: "orange" },
  { id: 1, name: "Neon Streetfighter", detail: "120k Poly  •  Rigged", label: "NS", tone: "silver" },
  { id: 2, name: "Aether Track R", detail: "86k Poly  •  SubD", label: "AR", tone: "blue" },
  { id: 3, name: "Carbon Visor X-1", detail: "64k Poly  •  Glass", label: "X1", tone: "violet" },
] as const;

const TEXTURE_LIBRARY = [
  { id: 4, name: "Rosso Carbon", detail: "4K  •  Clearcoat", label: "RC", tone: "orange" },
  { id: 5, name: "Forged Graphite", detail: "4K  •  Roughness", label: "FG", tone: "silver" },
  { id: 6, name: "Titanium Heat", detail: "2K  •  Metallic", label: "TH", tone: "blue" },
  { id: 7, name: "Violet Chrome", detail: "4K  •  Reflective", label: "VC", tone: "violet" },
] as const;

const WAVEFORM = [8, 13, 19, 25, 15, 23, 31, 17, 11, 27, 20, 29, 13, 24, 9, 18, 28, 21, 14, 8];

type TemperatureMode = (typeof TEMPERATURE_MODES)[number]["id"];
type DialKind = "progress" | "temperature";
type LibraryTab = "models" | "textures";

interface CircularDialProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  unit: string;
  kind: DialKind;
}

function getPointerAngle(
  event: PointerEvent<HTMLButtonElement>,
  element: HTMLElement,
) {
  const rect = element.getBoundingClientRect();
  return (
    Math.atan2(
      event.clientY - (rect.top + rect.height / 2),
      event.clientX - (rect.left + rect.width / 2),
    ) *
    (180 / Math.PI)
  );
}

function CircularDial({
  value,
  min,
  max,
  onChange,
  label,
  unit,
  kind,
}: CircularDialProps) {
  const lastAngleRef = useRef(0);
  const preciseValueRef = useRef(value);
  const draggingRef = useRef(false);
  const range = max - min;
  const percentage = (value - min) / range;
  const knobAngle = percentage * 360;
  const radius = kind === "progress" ? 58 : 54;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (!draggingRef.current) preciseValueRef.current = value;
  }, [value]);

  const setClampedValue = useCallback(
    (nextValue: number) => {
      const clamped = Math.min(max, Math.max(min, nextValue));
      preciseValueRef.current = clamped;
      onChange(Math.round(clamped));
    },
    [max, min, onChange],
  );

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    draggingRef.current = true;
    preciseValueRef.current = value;
    lastAngleRef.current = getPointerAngle(event, event.currentTarget.parentElement!);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current) return;

    const dial = event.currentTarget.parentElement;
    if (!dial) return;

    const nextAngle = getPointerAngle(event, dial);
    let delta = nextAngle - lastAngleRef.current;

    // Keep the movement continuous while the handle crosses the -180/180 seam.
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    lastAngleRef.current = nextAngle;
    setClampedValue(preciseValueRef.current + (delta / 360) * range);
  };

  const stopDragging = (event: PointerEvent<HTMLButtonElement>) => {
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const direction =
      event.key === "ArrowRight" || event.key === "ArrowUp"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? -1
          : 0;

    if (!direction) return;
    event.preventDefault();
    setClampedValue(value + direction);
  };

  return (
    <div className={`${styles.dial} ${styles[kind]}`}>
      <svg aria-hidden="true" viewBox="0 0 140 140" className={styles.dialSvg}>
        {kind === "progress" ? (
          <>
            <circle
              className={styles.progressTrack}
              cx="70"
              cy="70"
              r={radius}
            />
            <circle
              className={styles.progressValue}
              cx="70"
              cy="70"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - percentage)}
            />
          </>
        ) : (
          <>
            <circle className={styles.temperatureSurface} cx="70" cy="70" r="67" />
            <circle className={styles.temperatureTrack} cx="70" cy="70" r={radius} />
            <circle
              className={styles.temperatureValue}
              cx="70"
              cy="70"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - percentage)}
            />
          </>
        )}
      </svg>

      <div className={styles.dialReading} aria-hidden="true">
        <span>
          {value}
          {unit}
        </span>
        <small>{label}</small>
      </div>

      <div
        className={`${styles.knobPosition} ${
          kind === "temperature" ? styles.hotKnob : ""
        }`}
        style={{ transform: `rotate(${knobAngle}deg)` }}
      >
        <button
          type="button"
          className={styles.knob}
          role="slider"
          aria-label={kind === "progress" ? "Ambience level" : "Temperature"}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value}${unit}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onKeyDown={handleKeyDown}
        >
          <span className={styles.srOnly}>Drag around the circle to adjust</span>
        </button>
      </div>
    </div>
  );
}

export default function EnvironmentControls() {
  const [ambience, setAmbience] = useState(15);
  const [temperature, setTemperature] = useState(82);
  const [temperatureMode, setTemperatureMode] =
    useState<TemperatureMode>("track");
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const [renderMode, setRenderMode] = useState<"wireframe" | "pbr">("pbr");
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [modelRevision, setModelRevision] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [libraryTab, setLibraryTab] = useState<LibraryTab>("models");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const libraryItems =
    libraryTab === "models" ? MODEL_LIBRARY : TEXTURE_LIBRARY;
  const filteredItems = libraryItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const allAssets = [...MODEL_LIBRARY, ...TEXTURE_LIBRARY];
  const activeAsset =
    allAssets.find((item) => item.id === selectedAsset) ?? MODEL_LIBRARY[0];
  const ambienceTone =
    ambience < 20
      ? "neutral"
      : ambience < 45
        ? "rose"
        : ambience < 80
          ? "ember"
          : "violet";
  const heatTone =
    temperature < 70 ? "cool" : temperature < 92 ? "track" : "hot";

  const updateTemperature = (nextTemperature: number) => {
    setTemperature(nextTemperature);
    setTemperatureMode(
      nextTemperature < 70
        ? "warmup"
        : nextTemperature < 92
          ? "track"
          : "qualify",
    );
  };

  const selectAdjacentAsset = (direction: -1 | 1) => {
    const currentIndex = allAssets.findIndex((item) => item.id === selectedAsset);
    const nextIndex =
      (currentIndex + direction + allAssets.length) % allAssets.length;
    const nextAsset = allAssets[nextIndex];
    setSelectedAsset(nextAsset.id);
    setLibraryTab(nextAsset.id < TEXTURE_LIBRARY[0].id ? "models" : "textures");
  };

  return (
    <section
      id="environment-controls"
      className={styles.section}
      aria-label="Environment controls"
      data-theme={ambienceTone === "neutral" ? "day" : "night"}
      data-tone={ambienceTone}
      data-heat={heatTone}
      data-scroll-scene
    >
      <div className={styles.panel}>
        <div
          className={styles.controlsColumn}
          data-stagger="slide-left"
          data-stagger-step="105"
        >
          <article className={`${styles.card} ${styles.ambienceCard}`}>
            <header className={styles.cardHeader}>
              <h2>Garage Lighting</h2>
              <span>PIT LIGHT</span>
            </header>

            <CircularDial
              value={ambience}
              min={0}
              max={100}
              onChange={setAmbience}
              label="LUMEN"
              unit="%"
              kind="progress"
            />

            <div className={styles.presetRow} aria-label="Ambience presets">
              {AMBIENCE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  aria-label={`Set ${preset.name} ambience to ${preset.value}%`}
                  aria-pressed={ambience === preset.value}
                  title={`${preset.name}: ${preset.value}%`}
                  className={styles.preset}
                  style={{ backgroundColor: preset.color }}
                  onClick={() => setAmbience(preset.value)}
                />
              ))}
            </div>

            <div className={styles.presetLabels} aria-hidden="true">
              {AMBIENCE_PRESETS.map((preset) => (
                <span key={preset.name}>{preset.name}</span>
              ))}
            </div>
          </article>

          <article className={`${styles.card} ${styles.temperatureCard}`}>
            <header className={styles.cardHeader}>
              <h2>Tyre Temperature</h2>
              <span>PIRELLI SC V4</span>
            </header>

            <CircularDial
              value={temperature}
              min={45}
              max={110}
              onChange={updateTemperature}
              label="TREAD TEMP"
              unit="°C"
              kind="temperature"
            />

            <div className={styles.modeGrid} aria-label="Temperature modes">
              {TEMPERATURE_MODES.map(({ id, label, value, Icon }) => {
                const active = temperatureMode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={active}
                    className={active ? styles.activeMode : ""}
                    onClick={() => {
                      setTemperatureMode(id);
                      setTemperature(value);
                    }}
                  >
                    <Icon aria-hidden="true" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </article>
        </div>

        <div className={styles.modelColumn}>
          <div className={styles.runtimeBar} data-reveal="fade-down">
            <span className={styles.runtimeStatus}>
              <i /> GLB 3D RUNTIME
            </span>
            <strong>DREAMFRAME</strong>
            <button
              type="button"
              aria-pressed={isAutoRotating}
              onClick={() => setIsAutoRotating((current) => !current)}
            >
              <RefreshCw aria-hidden="true" />
              360° ORBIT
            </button>
          </div>

          <div className={styles.modelStage} data-reveal="zoom">
            <div className={styles.modelGlow} aria-hidden="true" />
            <div
              className={`${styles.modelPoster} ${
                modelLoaded ? styles.hiddenPoster : ""
              }`}
              aria-hidden="true"
            >
              <Image
                src="/images/superbike-hero.jpg"
                alt=""
                fill
                sizes="(max-width: 780px) 100vw, 48vw"
              />
            </div>
            {mounted && (
              <model-viewer
                key={modelRevision}
                src="/3D-model/sports_bike.glb"
                alt="Interactive red superbike 3D model"
                loading="lazy"
                auto-rotate={isAutoRotating ? true : undefined}
                camera-controls
                rotation-per-second="24deg"
                shadow-intensity="1.1"
                camera-orbit="45deg 76deg auto"
                field-of-view="28deg"
                touch-action="pan-y"
                exposure={renderMode === "pbr" ? "1.05" : "0.82"}
                className={renderMode === "wireframe" ? styles.wireframeModel : ""}
                onLoad={() => setModelLoaded(true)}
              />
            )}
          </div>

          <div
            className={styles.renderControls}
            aria-label="Bike render controls"
            data-reveal="fade"
          >
            <button
              type="button"
              className={renderMode === "wireframe" ? styles.activeRender : ""}
              onClick={() => setRenderMode("wireframe")}
            >
              <Box aria-hidden="true" />
              Wireframe
            </button>
            <span />
            <button
              type="button"
              className={renderMode === "pbr" ? styles.activeRender : ""}
              onClick={() => setRenderMode("pbr")}
            >
              <Layers aria-hidden="true" />
              PBR
            </button>
            <span />
            <button
              type="button"
              aria-label="Reset bike view"
              onClick={() => {
                setRenderMode("pbr");
                setIsAutoRotating(true);
                setModelLoaded(false);
                setModelRevision((revision) => revision + 1);
              }}
            >
              <RefreshCcw aria-hidden="true" />
            </button>
          </div>

          <div className={styles.modelCopy} data-reveal="fade-up">
            <h2>
              <span>360</span> BIKE
            </h2>
            <p>
              High-speed aerodynamic superbike asset generated with neural
              diffusion. Featuring full 4K PBR textures, optimized geometry,
              and responsive 360° orbit controls.
            </p>
          </div>
        </div>

        <aside
          className={styles.libraryColumn}
          aria-label="3D asset library"
          data-reveal="slide-right"
        >
          <div className={styles.searchTools}>
            <label className={styles.searchField}>
              <span className={styles.srOnly}>Search 3D assets</span>
              <input
                type="search"
                value={searchQuery}
                placeholder="Search 3D models..."
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <Search aria-hidden="true" />
            </label>
            <button type="button" aria-label="Open 3D workspace">
              <Box aria-hidden="true" />
            </button>
            <div className={styles.avatar} aria-label="Dreamframe account">
              DF
              <i />
            </div>
          </div>

          <div className={styles.libraryCard}>
            <div className={styles.libraryTabs} role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={libraryTab === "models"}
                onClick={() => setLibraryTab("models")}
              >
                <Box aria-hidden="true" /> 3D Models
              </button>
              <span />
              <button
                type="button"
                role="tab"
                aria-selected={libraryTab === "textures"}
                onClick={() => setLibraryTab("textures")}
              >
                <Layers aria-hidden="true" /> Textures
              </button>
            </div>

            <div className={styles.assetList} role="tabpanel">
              {filteredItems.length ? (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={selectedAsset === item.id ? styles.activeAsset : ""}
                    onClick={() => setSelectedAsset(item.id)}
                  >
                    <span className={`${styles.assetThumb} ${styles[item.tone]}`}>
                      {item.label}
                    </span>
                    <span className={styles.assetDetails}>
                      <strong>{item.name}</strong>
                      <small>{item.detail}</small>
                    </span>
                    {selectedAsset === item.id && <i aria-hidden="true" />}
                  </button>
                ))
              ) : (
                <p className={styles.emptyState}>No matching assets</p>
              )}
            </div>

            <div className={styles.pagination} aria-hidden="true">
              <b /> <i /> <i /> <i />
            </div>
          </div>

          <div className={styles.playerCard}>
            <strong>{activeAsset.name}</strong>
            <div className={styles.waveform} aria-hidden="true">
              {WAVEFORM.map((height, index) => (
                <i key={`${height}-${index}`} style={{ height }} />
              ))}
            </div>
            <div className={styles.playerControls}>
              <button
                type="button"
                aria-label="Previous asset"
                onClick={() => selectAdjacentAsset(-1)}
              >
                <SkipBack aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Replay preview"
                onClick={() => setIsPlaying(true)}
              >
                <RefreshCcw aria-hidden="true" />
              </button>
              <button
                type="button"
                className={styles.playButton}
                aria-label={isPlaying ? "Pause preview" : "Play preview"}
                onClick={() => setIsPlaying((playing) => !playing)}
              >
                {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
              </button>
              <button
                type="button"
                aria-label="Refresh preview"
                onClick={() => setIsPlaying(true)}
              >
                <RefreshCw aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next asset"
                onClick={() => selectAdjacentAsset(1)}
              >
                <SkipForward aria-hidden="true" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
