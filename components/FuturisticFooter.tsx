import {
  ArrowUpRight,
  ChevronUp,
  Cpu,
  Gauge,
  Radio,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import styles from "./FuturisticFooter.module.css";

const FOOTER_STATS = [
  { value: "210 HP", label: "V4 OUTPUT", Icon: Gauge },
  { value: "14.5K", label: "REDLINE RPM", Icon: Cpu },
  { value: "1000 HZ", label: "TELEMETRY", Icon: Radio },
  { value: "SC V4", label: "TRACK SPEC", Icon: ShieldCheck },
] as const;

export default function FuturisticFooter() {
  return (
    <footer
      id="footer"
      className={styles.footer}
      data-scroll-scene
      aria-label="Dreamframe footer"
    >
      <div
        className={styles.auroraOne}
        data-parallax="-0.07"
        data-scroll-fade
        aria-hidden="true"
      />
      <div
        className={styles.auroraTwo}
        data-parallax="0.1"
        data-scroll-fade
        aria-hidden="true"
      />
      <div className={styles.scan} aria-hidden="true" />

      <div className={styles.shell}>
        <div className={styles.statusBar} data-reveal="fade-down">
          <a className={styles.brand} href="#top" aria-label="Dreamframe home">
            <span><Sparkles aria-hidden="true" /></span>
            <strong>DREAMFRAME</strong>
          </a>
          <div className={styles.status}>
            <i />
            ALL BIKE SYSTEMS NOMINAL
          </div>
          <span className={styles.build}>DF-V4 / BUILD 26.09</span>
        </div>

        <div className={styles.hero}>
          <div className={styles.heroCopy} data-reveal="slide-left">
            <span className={styles.eyebrow}>THE NEXT APEX IS YOURS</span>
            <h2>
              ENGINEER BEYOND
              <span> THE REDLINE.</span>
            </h2>
            <p>
              Shape a race-bred superbike through neural design, real-time
              telemetry, and cinematic 3D engineering.
            </p>
          </div>

          <div className={styles.ctaWrap} data-reveal="zoom">
            <div className={styles.orbit} aria-hidden="true"><i /></div>
            <a href="#environment-controls" className={styles.cta}>
              <span>
                ENTER
                <strong>THE GARAGE</strong>
              </span>
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>

        <div
          className={styles.stats}
          data-stagger="depth"
          data-stagger-step="75"
        >
          {FOOTER_STATS.map(({ value, label, Icon }, index) => (
            <div className={styles.stat} key={label}>
              <span className={styles.statIndex}>0{index + 1}</span>
              <Icon aria-hidden="true" />
              <strong>{value}</strong>
              <small>{label}</small>
            </div>
          ))}
        </div>

        <div className={styles.navigation} data-reveal="reveal">
          <div>
            <small>EXPLORE</small>
            <a href="#top">Origin</a>
            <a href="#bike-matrix">Bike Matrix</a>
            <a href="#exploded-view">Exploded View</a>
          </div>
          <div>
            <small>STUDIO</small>
            <a href="#environment-controls">360° Garage</a>
            <a href="#environment-controls">Lighting Lab</a>
            <a href="#environment-controls">Asset Library</a>
          </div>
          <div className={styles.manifesto}>
            <small>DESIGN PROTOCOL</small>
            <p>Speed is temporary. Engineering becomes legacy.</p>
          </div>
        </div>

        <div className={styles.bottomBar} data-reveal="fade">
          <span>© 2026 DREAMFRAME CONCEPT LAB</span>
          <span>BUILT FOR THE FUTURE OF TWO WHEELS</span>
          <a href="#top">
            BACK TO TOP <ChevronUp aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
