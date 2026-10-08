"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Activity,
  ChevronRight,
  Cpu,
  Crosshair,
  Gauge,
  Layers,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import styles from "./ScrollCanvasAnimation.module.css";

const TOTAL_FRAMES = 151;

const getFramePath = (index: number) => {
  const frameNum = String(index + 1).padStart(3, "0");
  return `/frames/ezgif-frame-${frameNum}.png`;
};

interface BikePartInfo {
  id: string;
  name: string;
  category: string;
  details: string;
  specs: string;
  // Hotspot position on the exploded bike part (percentages)
  hotspot: { x: number; y: number };
  // Label badge position on screen (percentages)
  labelPos: { top: string; left: string };
  // Card popover alignment relative to label
  cardAlign?: "left" | "right" | "top" | "bottom";
  icon: React.ElementType;
}

const BIKE_PARTS: BikePartInfo[] = [
  {
    id: "fairing",
    name: "FRONT FAIRING",
    category: "AERODYNAMICS",
    details:
      "Aerodynamic front nose cone with integrated dual LED headlights, carbon winglets, and RAM-air intake channels.",
    specs: "Material: Pre-preg Carbon | Downforce: +28 kg @ 160 mph",
    hotspot: { x: 22, y: 34 },
    labelPos: { top: "36%", left: "4%" },
    cardAlign: "right",
    icon: ShieldCheck,
  },
  {
    id: "frame",
    name: "MAIN FRAME",
    category: "CHASSIS & RIGIDITY",
    details:
      "High-modulus T1000 carbon fiber trellis chassis engineered for optimal torsional stiffness and race stability.",
    specs: "Weight: 8.2 kg | Rigidity: +35% Torsional Resistance",
    hotspot: { x: 42, y: 44 },
    labelPos: { top: "22%", left: "28%" },
    cardAlign: "bottom",
    icon: Layers,
  },
  {
    id: "fuel_tank",
    name: "FUEL TANK",
    category: "ERGONOMICS",
    details:
      "Sculpted lightweight fuel cell with ergonomic knee recesses and internal anti-slosh baffle system.",
    specs: "Capacity: 17.5 Liters | Weight: 2.1 kg",
    hotspot: { x: 54, y: 26 },
    labelPos: { top: "15%", left: "54%" },
    cardAlign: "bottom",
    icon: Zap,
  },
  {
    id: "seat_tank",
    name: "SEAT TANK",
    category: "TAIL ASSEMBLY",
    details:
      "Self-supporting carbon fiber rear tail unit featuring an ergonomic Alcantara anti-slip racing saddle.",
    specs: "Subframe: Monocoque Carbon | Saddle: Alcantara",
    hotspot: { x: 70, y: 24 },
    labelPos: { top: "14%", left: "76%" },
    cardAlign: "left",
    icon: Cpu,
  },
  {
    id: "engine",
    name: "DETAILED ENGINE BLOCK",
    category: "POWERTRAIN",
    details:
      "Liquid-cooled V-Twin DOHC engine block with titanium intake valves, dual injectors, and magnesium covers.",
    specs: "Power: 210 HP @ 14,500 RPM | Torque: 124 Nm",
    hotspot: { x: 52, y: 58 },
    labelPos: { top: "72%", left: "34%" },
    cardAlign: "top",
    icon: Activity,
  },
  {
    id: "swingarm",
    name: "SWINGARM",
    category: "REAR DRIVETRAIN",
    details:
      "Single-sided CNC billet aluminum swingarm with lightweight titanium sprocket and 520 racing drive chain.",
    specs: "Material: CNC Billet Aluminum | Chain: 520 DID Racing",
    hotspot: { x: 76, y: 58 },
    labelPos: { top: "42%", left: "80%" },
    cardAlign: "left",
    icon: Gauge,
  },
  {
    id: "suspension",
    name: "FRONT SUSPENSION",
    category: "HANDLING & BRAKES",
    details:
      "Electronically controlled Öhlins inverted front forks paired with Brembo 4-piston radial monobloc brake calipers.",
    specs: "Forks: Öhlins FGR 48mm | Calipers: Brembo Stylema Radial",
    hotspot: { x: 34, y: 65 },
    labelPos: { top: "75%", left: "8%" },
    cardAlign: "right",
    icon: ShieldCheck,
  },
];

interface ScrollCanvasAnimationProps {
  children?: React.ReactNode;
}

export default function ScrollCanvasAnimation({
  children,
}: ScrollCanvasAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const loadedImagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activePartId, setActivePartId] = useState("engine");

  // Preload all 151 frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      images.push(img);
    }
    loadedImagesRef.current = images;
  }, []);

  // Update target frame index and scroll progress on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableHeight = rect.height - window.innerHeight;

      if (scrollableHeight <= 0) return;

      const scrollTop = Math.max(0, -rect.top);
      const progress = Math.min(1, Math.max(0, scrollTop / scrollableHeight));

      setScrollProgress(progress);
      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Animation loop with smooth lerp & DPR support
  useEffect(() => {
    const drawFrame = (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = loadedImagesRef.current[index];
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (width === 0 || height === 0) return;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Clean background fill matching frame image tone
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      if (img && img.complete && img.naturalWidth > 0) {
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        const imgRatio = imgWidth / imgHeight;
        const canvasRatio = width / height;

        let drawW: number, drawH: number;

        if (canvasRatio > imgRatio) {
          drawW = width;
          drawH = width / imgRatio;
        } else {
          drawH = height;
          drawW = height * imgRatio;
        }

        const drawX = (width - drawW) / 2;
        const drawY = (height - drawH) / 2;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      }

      ctx.restore();
    };

    const renderLoop = () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        currentFrameRef.current = targetFrameRef.current;
      } else {
        const diff = targetFrameRef.current - currentFrameRef.current;
        currentFrameRef.current += diff * 0.14;
      }

      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentFrameRef.current))
      );

      drawFrame(frameIndex);
      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // Opacities & Transforms driven by scroll progress
  const heroUiOpacity = Math.max(0, 1 - scrollProgress * 3.8);
  const heroUiTranslateY = -scrollProgress * 350;

  // Exploded callouts fade in near final frames (> 60% scroll)
  const partsOverlayOpacity = Math.min(
    1,
    Math.max(0, (scrollProgress - 0.6) * 3.5)
  );
  const activePart =
    BIKE_PARTS.find((part) => part.id === activePartId) ?? BIKE_PARTS[0];
  const ActivePartIcon = activePart.icon;

  return (
    <div ref={containerRef} className="relative w-full h-[550vh]">
      <span
        id="exploded-view"
        className="absolute top-[470vh] left-0 h-px w-px pointer-events-none"
        aria-hidden="true"
      />
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black z-0">
        
        {/* Canvas Element rendering 151 frames */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none transition-[filter,transform] duration-700 ease-out"
          style={{
            filter: `brightness(${1 - partsOverlayOpacity * 0.2}) contrast(${1 + partsOverlayOpacity * 0.16}) saturate(${1 + partsOverlayOpacity * 0.14})`,
            transform: `scale(${1 + partsOverlayOpacity * 0.018})`,
          }}
        />

        {/* HERO UI OVERLAY (Scrolls away upwards as user scrolls down) */}
        <div
          className="relative z-10 w-full h-full flex flex-col justify-between transition-opacity duration-300 pointer-events-auto"
          style={{
            opacity: heroUiOpacity,
            transform: `translateY(${heroUiTranslateY}px)`,
            pointerEvents: heroUiOpacity > 0.1 ? "auto" : "none",
          }}
        >
          {children}
        </div>

        {/* EXPLODED BIKE PARTS CALLOUT OVERLAY */}
        <div
          className={`absolute inset-0 z-20 pointer-events-auto transition-opacity duration-500 ${styles.partsOverlay}`}
          style={{
            opacity: partsOverlayOpacity,
            pointerEvents: partsOverlayOpacity > 0.1 ? "auto" : "none",
          }}
        >
          <div className={styles.cinematicWash} aria-hidden="true" />
          <div className={styles.scanline} aria-hidden="true" />
          <div className={styles.letterboxTop} aria-hidden="true" />
          <div className={styles.letterboxBottom} aria-hidden="true" />

          <div className={styles.sequenceReadout}>
            <span>DF / ENGINEERING SCAN</span>
            <strong>FRAME {Math.round(scrollProgress * (TOTAL_FRAMES - 1)) + 1}</strong>
            <i style={{ width: `${scrollProgress * 100}%` }} />
          </div>

          <div className={styles.overlayTitle}>
            <span className={styles.titleIcon}>
              <Sparkles aria-hidden="true" />
            </span>
            <span>
              <small>V4 // COMPONENT ANALYSIS</small>
              <strong>EXPLODED ENGINEERING ARCHITECTURE</strong>
            </span>
            <b>LIVE</b>
          </div>

          <div className={styles.telemetryRail} aria-hidden="true">
            <span><b>210</b> HP</span>
            <span><b>14.5K</b> RPM</span>
            <span><b>168</b> KG</span>
          </div>

          <svg className={styles.connectorLayer} aria-hidden="true">
            <defs>
              <filter id="part-line-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {BIKE_PARTS.map((part) => {
              const isActive = activePartId === part.id;
              const labelX = parseFloat(part.labelPos.left);
              const labelY = parseFloat(part.labelPos.top);

              return (
                <g key={`line-${part.id}`}>
                  <line
                    x1={`${part.hotspot.x}%`}
                    y1={`${part.hotspot.y}%`}
                    x2={`${labelX}%`}
                    y2={`${labelY}%`}
                    stroke={isActive ? "#c56bff" : "rgba(205, 220, 241, 0.48)"}
                    strokeWidth={isActive ? "1.8" : "0.9"}
                    strokeDasharray={isActive ? "2 3" : "2 5"}
                    filter={isActive ? "url(#part-line-glow)" : undefined}
                    className={styles.connectorLine}
                  />
                  {isActive && (
                    <circle
                      cx={`${part.hotspot.x}%`}
                      cy={`${part.hotspot.y}%`}
                      r="10"
                      fill="none"
                      stroke="#c56bff"
                      strokeWidth="1"
                      className={styles.targetPulse}
                    />
                  )}
                  <circle
                    cx={`${part.hotspot.x}%`}
                    cy={`${part.hotspot.y}%`}
                    r={isActive ? "5" : "3.5"}
                    fill={isActive ? "#d592ff" : "#f8fafc"}
                    stroke="#05070d"
                    strokeWidth="2.5"
                    className={styles.targetPoint}
                  />
                </g>
              );
            })}
          </svg>

          {BIKE_PARTS.map((part, index) => {
            const isActive = activePartId === part.id;
            return (
              <button
                key={part.id}
                type="button"
                style={part.labelPos}
                className={`${styles.partLabel} ${isActive ? styles.activeLabel : ""}`}
                onMouseEnter={() => setActivePartId(part.id)}
                onFocus={() => setActivePartId(part.id)}
                onClick={() => setActivePartId(part.id)}
                aria-pressed={isActive}
              >
                <span className={styles.partIndex}>{String(index + 1).padStart(2, "0")}</span>
                <i />
                <span>{part.name}</span>
                <ChevronRight aria-hidden="true" />
              </button>
            );
          })}

          <div className={styles.partDetail} key={activePart.id}>
            <div className={styles.detailTopline}>
              <span>
                <ActivePartIcon aria-hidden="true" />
                {activePart.category}
              </span>
              <b>COMPONENT LOCKED</b>
            </div>
            <div className={styles.detailHeading}>
              <span><Crosshair aria-hidden="true" /></span>
              <div>
                <small>SELECTED SYSTEM</small>
                <h3>{activePart.name}</h3>
              </div>
            </div>
            <p>{activePart.details}</p>
            <div className={styles.specGrid}>
              {activePart.specs.split("|").map((specification) => {
                const [label, ...valueParts] = specification.trim().split(":");
                return (
                  <span key={specification}>
                    <small>{label}</small>
                    <strong>{valueParts.join(":").trim()}</strong>
                  </span>
                );
              })}
            </div>
          </div>

          <div className={styles.scrollCue}>
            <span />
            SCROLL TO SCRUB ASSEMBLY
          </div>
        </div>

      </div>
    </div>
  );
}
