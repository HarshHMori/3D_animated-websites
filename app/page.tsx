"use client";

import React, { useState } from "react";
import Image from "next/image";


import {
  Sparkles,
  ArrowUpRight,
  Maximize2,
  Sliders,
  Menu,
  X,
  Wand2,
  Layers,
  Zap,
  CheckCircle2,
  RefreshCw,
  Copy,
  Info,
  ChevronRight,
  Gauge,
  Cpu,
  ShieldCheck,
  Flame,
  Activity,
  Compass,
  Hexagon,
  Globe,
  Radio,
  Workflow,
  Orbit,
} from "lucide-react";

import EnvironmentControls from "@/components/EnvironmentControls";
import BikeSoundscape from "@/components/BikeSoundscape";
import FuturisticFooter from "@/components/FuturisticFooter";
import ScrollCanvasAnimation from "@/components/ScrollCanvasAnimation";
import ScrollMotion from "@/components/ScrollMotion";

export default function HeroSection() {
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);

  // Interactive superbike configurator state
  const [promptText, setPromptText] = useState(
    "Track-focused carbon superbike with active aero, titanium exhaust, and violet pit-lane lighting"
  );
  const [selectedModel, setSelectedModel] = useState("V4 Aero Configurator");
  const [selectedStyle, setSelectedStyle] = useState("Track Studio");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeImage, setActiveImage] = useState("/images/superbike-hero.jpg");
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      const samples = [
        "/images/superbike-hero.jpg",
        "/images/superbike-engine.jpg",
        "/images/superbike-headlight.jpg",
      ];
      const nextImg = samples[Math.floor(Math.random() * samples.length)];
      setActiveImage(nextImg);
    }, 1800);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <main id="top" className="relative w-full bg-black text-white selection:bg-purple-900 selection:text-white">
      <BikeSoundscape />
      <ScrollMotion />
      <ScrollCanvasAnimation>
        {/* TOP HEADER NAV BAR */}
        <header data-reveal="fade-down" className="w-full px-6 pt-6 md:px-12 md:pt-8 flex items-center justify-between pointer-events-auto z-30">
        {/* Left Floating Header Pill */}
        <div className="flex items-center gap-3 bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-lg hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 group cursor-pointer">
          {/* Brand Logo Icon */}
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-orange-500 to-purple-500 p-0.5 flex items-center justify-center group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-orange-400" />
            </div>
          </div>

          {/* Brand Name */}
          <span className="font-normal tracking-wide text-xs sm:text-sm text-gray-200 group-hover:text-white transition-colors">
            DREAMFRAME
          </span>

          <div className="w-[1px] h-3.5 bg-white/15 mx-0.5" />

          {/* Header Menu Icon */}
          <button
            onClick={() => setIsPromptOpen(!isPromptOpen)}
            aria-label="Toggle navigation menu"
            className="text-gray-400 hover:text-white p-0.5 transition-colors focus:outline-none"
          >
            {isPromptOpen ? (
              <X className="w-3.5 h-3.5 text-purple-300" />
            ) : (
              <Menu className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Top Right Quick Engine Badge */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-full px-3 py-1.5 text-xs text-gray-400 font-light">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px] text-gray-300">Engine v4.5 Active</span>
          </div>
        </div>
      </header>

      {/* MIDDLE SECTION - MINIMALIST DUAL COLUMN LAYOUT */}
      <section data-scroll-scene className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-16 flex-1 flex flex-col justify-center pointer-events-auto">

        {/* Cinematic Atmospheric Dark Gradient Shadow Behind Left Text */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full max-w-[50vw] h-[120%] bg-gradient-to-r from-black/95 via-black/70 to-transparent pointer-events-none z-0 blur-3xl opacity-85" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">

          {/* LEFT COLUMN: BADGE + HEADLINE */}
          <div data-reveal="slide-left" className="md:col-span-7 flex flex-col items-start space-y-5">

            {/* Minimal Availability-Style Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-purple-300 text-[11px] font-normal tracking-wider uppercase transition-all">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>NEURAL SUPERBIKE LAB</span>
            </div>

            {/* Main Headline - White to Subtle Lavender Gradient & Soft Glow */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium md:font-semibold tracking-tight leading-[1.12] max-w-2xl bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent drop-shadow-[0_4px_25px_rgba(216,180,254,0.3)]">
              Engineer the Next-Gen Superbike
            </h1>

            {/* Micro Feature Tags */}
            <div data-stagger="zoom" data-stagger-step="70" className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/10 text-gray-400 font-mono font-light">
                210 HP V4
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/10 text-gray-400 font-mono font-light">
                Active Aero
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/10 text-gray-400 font-mono font-light">
                Race Telemetry
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: DESCRIPTION + CTA BUTTON */}
          <div data-reveal="slide-right" className="md:col-span-5 flex flex-col items-start md:items-end text-left md:text-right space-y-6 md:ml-auto">

            {/* Supporting Description - Clean Minimal Font */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-md font-light text-left md:text-right drop-shadow-sm">
              Explore a cinematic superbike platform with exploded engineering,
              interactive telemetry, race-focused components, and a full 360° build studio.
            </p>

            {/* CTA BUTTON & ACTION CONTROLS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">

              {/* ORANGE / PURPLE CTA BUTTON */}
              <button
                onClick={() => setIsPromptOpen(true)}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 via-orange-600 to-purple-600 hover:from-orange-400 hover:to-purple-500 text-white font-medium text-sm pl-2 pr-6 py-2 rounded-full shadow-[0_4px_20px_rgba(249,115,22,0.25)] hover:shadow-[0_6px_25px_rgba(249,115,22,0.4)] transition-all duration-300 cursor-pointer"
              >
                {/* Left White Circle Badge */}
                <div className="w-8 h-8 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <ArrowUpRight className="w-4 h-4 text-orange-600 stroke-[2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                {/* Right Button Text */}
                <span className="tracking-wide">Build Your Bike</span>
              </button>

              {/* Secondary Gallery Button */}
              <button
                onClick={() => setIsShowcaseOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.04] border border-white/10 text-xs sm:text-sm font-normal text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Bike Garage</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* OVERSIZED BRAND TEXT & FLOATING ACTION CONTROLS */}
      <div className="relative z-10 w-full mt-auto pointer-events-auto">

        {/* Floating Controls Row */}
        <div data-stagger="zoom" data-stagger-step="90" className="w-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between translate-y-4 md:translate-y-6 relative z-20">

          {/* Bottom Left Pill Button */}
          <button
            onClick={() => setIsShowcaseOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs sm:text-sm font-light text-gray-300 hover:bg-white/10 hover:text-white transition-all group cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            <span>Explore Bike Builds</span>
          </button>

          {/* Bottom Right Floating Action Icons */}
          <div className="flex items-center gap-2">
            {/* Lightbox / View Button */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              title="Full Screen Preview"
              className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all group cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-purple-300 group-hover:scale-110 transition-transform" />
            </button>

            {/* Inspector Button */}
            <button
              onClick={() => setIsInspectorOpen(true)}
              title="Superbike Engineering Parameters"
              className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all group cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-orange-400 group-hover:rotate-45 transition-transform" />
            </button>
          </div>
        </div>

        {/* OVERSIZED BRAND TEXT "DREAMFRAME" - 90vw Wide with White/Lavender Gradient & Pink Glow */}
        <div data-reveal="reveal" className="w-full max-w-[90vw] mx-auto overflow-hidden select-none pointer-events-none text-center">
          <h2 className="text-[12.5vw] font-bold tracking-tight bg-gradient-to-b from-white via-purple-100 to-purple-200/80 bg-clip-text text-transparent uppercase leading-none font-display transform translate-y-[8%] drop-shadow-[0_15px_35px_rgba(244,114,182,0.2)] [filter:drop-shadow(0_20px_50px_rgba(168,85,247,0.3))]">
            DREAMFRAME
          </h2>
        </div>
      </div>
      </ScrollCanvasAnimation>

      {/* ================= SECTION 1: INFINITE LOGO CAROUSEL ================= */}
      <section id="engineering-partners" data-scroll-scene className="relative z-20 w-full py-16 overflow-hidden bg-black/90 backdrop-blur-xl border-y border-white/5">
        {/* Soft cosmic glow backdrop */}
        <div data-parallax="0.08" data-scroll-fade className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.12),transparent_70%)]" />

        {/* Section Header Badge */}
        <div data-reveal="blur" className="max-w-7xl mx-auto px-6 mb-10 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-purple-300 text-[11px] font-mono tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span>POWERING NEXT-GEN HYPERBIKE ENGINEERING & DESIGN</span>
          </div>
        </div>

        {/* Edge Fade Masks for Seamless Loop */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          {/* ROW 1: Right -> Left Continuous Marquee */}
          <div data-reveal="slide-left" className="flex mb-6 overflow-hidden select-none">
            <div className="animate-marquee-left flex items-center gap-6 sm:gap-10">
              {[
                { name: "DUCATI CORSE", icon: Flame, spec: "V4 R HYPERDRIVE" },
                { name: "KAWASAKI NINJA", icon: Gauge, spec: "H2R SUPERCHARGED" },
                { name: "BIMOTA TESI", icon: Hexagon, spec: "HUB STEER 3D" },
                { name: "BMW M1000RR", icon: Orbit, spec: "CARBON WINGLET" },
                { name: "APRILIA RSV4", icon: Zap, spec: "AERO ENGINE" },
                { name: "MV AGUSTA", icon: Activity, spec: "F4 CLAUDIO" },
                { name: "YAMAHA YZF", icon: Radio, spec: "R1M TELEMETRY" },
                { name: "HONDA CBR", icon: Compass, spec: "1000RR-R FIREBLADE" },
              ].concat([
                { name: "DUCATI CORSE", icon: Flame, spec: "V4 R HYPERDRIVE" },
                { name: "KAWASAKI NINJA", icon: Gauge, spec: "H2R SUPERCHARGED" },
                { name: "BIMOTA TESI", icon: Hexagon, spec: "HUB STEER 3D" },
                { name: "BMW M1000RR", icon: Orbit, spec: "CARBON WINGLET" },
                { name: "APRILIA RSV4", icon: Zap, spec: "AERO ENGINE" },
                { name: "MV AGUSTA", icon: Activity, spec: "F4 CLAUDIO" },
                { name: "YAMAHA YZF", icon: Radio, spec: "R1M TELEMETRY" },
                { name: "HONDA CBR", icon: Compass, spec: "1000RR-R FIREBLADE" },
              ]).map((brand, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.06] transition-all duration-300 group shrink-0"
                >
                  <brand.icon className="w-4 h-4 text-purple-400 group-hover:text-orange-400 transition-colors" />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold tracking-wider text-gray-200 group-hover:text-white font-mono">
                      {brand.name}
                    </span>
                    <span className="text-[9px] text-gray-500 font-mono">
                      {brand.spec}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ROW 2: Left -> Right Continuous Marquee */}
          <div data-reveal="slide-right" className="flex overflow-hidden select-none">
            <div className="animate-marquee-right flex items-center gap-6 sm:gap-10">
              {[
                { name: "BREMBO RACING", icon: ShieldCheck, spec: "MONOBLOC HYPER-B" },
                { name: "ÖHLINS RACING", icon: Workflow, spec: "SMART EC 2.0" },
                { name: "AKRAPOVIČ", icon: Flame, spec: "TITANIUM FULL SYSTEM" },
                { name: "PIRELLI DIABLO", icon: Globe, spec: "SUPERCORSA V4" },
                { name: "OZ RACING", icon: Orbit, spec: "FORGED MAGNESIUM" },
                { name: "MOTUL 300V", icon: Activity, spec: "ESTERE CORE TECH" },
                { name: "DYMAG WHEELS", icon: Hexagon, spec: "ULTRA CARBON RIMS" },
                { name: "AIM SPORTS", icon: Cpu, spec: "SOLO 2 DL TELEMETRY" },
              ].concat([
                { name: "BREMBO RACING", icon: ShieldCheck, spec: "MONOBLOC HYPER-B" },
                { name: "ÖHLINS RACING", icon: Workflow, spec: "SMART EC 2.0" },
                { name: "AKRAPOVIČ", icon: Flame, spec: "TITANIUM FULL SYSTEM" },
                { name: "PIRELLI DIABLO", icon: Globe, spec: "SUPERCORSA V4" },
                { name: "OZ RACING", icon: Orbit, spec: "FORGED MAGNESIUM" },
                { name: "MOTUL 300V", icon: Activity, spec: "ESTERE CORE TECH" },
                { name: "DYMAG WHEELS", icon: Hexagon, spec: "ULTRA CARBON RIMS" },
                { name: "AIM SPORTS", icon: Cpu, spec: "SOLO 2 DL TELEMETRY" },
              ]).map((tech, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-pink-500/40 hover:bg-white/[0.06] transition-all duration-300 group shrink-0"
                >
                  <tech.icon className="w-4 h-4 text-pink-400 group-hover:text-orange-400 transition-colors" />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold tracking-wider text-gray-200 group-hover:text-white font-mono">
                      {tech.name}
                    </span>
                    <span className="text-[9px] text-gray-500 font-mono">
                      {tech.spec}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: BENTO GRID (BIKES & NEURAL HYPERBIKE CONCEPTS) ================= */}
      <section id="bike-matrix" data-scroll-scene className="relative z-20 w-full py-24 px-6 md:px-12 bg-black text-white overflow-hidden">
        {/* Ambient Dark Cosmic Glowing Orbs */}
        <div data-parallax="-0.09" data-scroll-fade className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-950/30 rounded-full blur-[140px] pointer-events-none" />
        <div data-parallax="0.12" data-scroll-fade className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-pink-950/20 rounded-full blur-[130px] pointer-events-none" />
        <div data-parallax="0.06" className="absolute top-1/2 right-10 w-[350px] h-[350px] bg-orange-950/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-12">

          {/* Bento Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div data-reveal="slide-left" className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-pink-300 text-xs font-mono uppercase tracking-widest">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>SUPERBIKE MATRIX & TELEMETRY</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
                Engineered for Peak <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">Aerodynamic Mastery</span>
              </h2>
            </div>
            <p data-reveal="slide-right" className="text-gray-400 text-sm max-w-md font-light leading-relaxed">
              Explore hyperbike architecture synthesized with neural precision, carbon aero winglets, and high-frequency telemetry monitoring.
            </p>
          </div>

          {/* Asymmetric Bento Grid Layout */}
          <div data-stagger="depth" data-stagger-step="95" className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* CARD 1: Main Feature Superbike (Hero Card - Col 8) */}
            <div className="md:col-span-8 group relative rounded-3xl bg-white/[0.03] border border-white/10 hover:border-purple-500/50 transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[420px] shadow-2xl">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/superbike-hero.jpg"
                  alt="Futuristic Superbike Hyper-Engineered"
                  fill
                  className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>

              {/* Card Top Pill Badge */}
              <div className="relative z-10 p-6 flex justify-between items-start">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono text-purple-300 tracking-wider uppercase">
                  Flagship Hyperbike
                </span>
                <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-black transition-all">
                  <ArrowUpRight className="w-4 h-4 text-white group-hover:text-black" />
                </div>
              </div>

              {/* Card Bottom Details */}
              <div className="relative z-10 p-6 sm:p-8 space-y-3 mt-auto">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    326 HP
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    215 MPH TOP SPEED
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold text-white group-hover:text-purple-200 transition-colors">
                  DreamFrame Stealth Apex V4-R
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-xl font-light leading-relaxed">
                  Monocoque carbon fiber chassis paired with intelligent active winglets that adjust downforce dynamically based on real-time lean angles.
                </p>
              </div>
            </div>

            {/* CARD 2: Engine Detail & Specs (Col 4) */}
            <div className="md:col-span-4 group relative rounded-3xl bg-white/[0.03] border border-white/10 hover:border-pink-500/50 transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[420px] p-6 sm:p-8 shadow-2xl">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/superbike-engine.jpg"
                  alt="Superbike Engine Detail"
                  fill
                  className="object-cover opacity-45 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              </div>

              <div className="relative z-10 flex justify-between items-center">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono text-pink-300 tracking-wider uppercase flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-pink-400" />
                  Powertrain
                </span>
                <span className="text-xs font-mono text-gray-400">998cc V4</span>
              </div>

              <div className="relative z-10 space-y-4 mt-auto">
                <h3 className="text-xl font-semibold text-white">
                  Neural Fluid Dynamics
                </h3>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
                    <span className="text-[10px] text-gray-400 block">TORQUE</span>
                    <span className="text-purple-300 text-sm font-semibold">142 Nm</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
                    <span className="text-[10px] text-gray-400 block">WEIGHT</span>
                    <span className="text-orange-300 text-sm font-semibold">168 KG</span>
                  </div>
                </div>
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  Titanium intake valves with neon LED cooling conduits designed for heat dissipation under extreme track endurance.
                </p>
              </div>
            </div>

            {/* CARD 3: Laser Headlight Optics (Col 4) */}
            <div className="md:col-span-4 group relative rounded-3xl bg-white/[0.03] border border-white/10 hover:border-purple-500/50 transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[360px] p-6 shadow-2xl">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/superbike-headlight.jpg"
                  alt="Superbike Laser Headlight"
                  fill
                  className="object-cover opacity-50 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>

              <div className="relative z-10 flex justify-between items-center">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono text-purple-300 uppercase">
                  Adaptive Optics
                </span>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              </div>

              <div className="relative z-10 space-y-2 mt-auto">
                <h3 className="text-lg font-semibold text-white">
                  Photon Matrix Illumination
                </h3>
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  Dual ultraviolet projection lamps with night-vision lidar mesh for high-speed dark cornering.
                </p>
              </div>
            </div>

            {/* CARD 4: Telemetry & Live Stats (Col 4) */}
            <div className="md:col-span-4 rounded-3xl bg-gradient-to-b from-white/[0.05] to-purple-950/20 border border-white/10 hover:border-purple-400/40 transition-all duration-500 p-6 flex flex-col justify-between min-h-[360px] shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-600/20 transition-all" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-400 animate-pulse" />
                  <span className="text-xs font-mono uppercase text-gray-300">Live Telemetry</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ONLINE
                </span>
              </div>

              <div className="space-y-4 my-auto">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-gray-300">
                    <span>Lean Angle Max</span>
                    <span className="text-purple-300">58.4°</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-gradient-to-r from-orange-500 to-purple-500" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-gray-300">
                    <span>Braking Force</span>
                    <span className="text-pink-300">1.65 G</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[72%] h-full bg-gradient-to-r from-pink-500 to-purple-500" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-gray-300">
                    <span>Aero Drag Coeff</span>
                    <span className="text-orange-300 font-bold">0.27 Cd</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[92%] h-full bg-gradient-to-r from-purple-500 to-orange-400" />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-400">
                <span>IMU 6-AXIS TELEMETRY</span>
                <span className="text-purple-300">1000 Hz</span>
              </div>
            </div>

            {/* CARD 5: Track Mode & Aerodynamics (Col 4) */}
            <div className="md:col-span-4 rounded-3xl bg-gradient-to-b from-white/[0.04] to-pink-950/20 border border-white/10 hover:border-pink-400/40 transition-all duration-500 p-6 flex flex-col justify-between min-h-[360px] shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-pink-400" />
                  <span className="text-xs font-mono uppercase text-gray-300">Active Ergonomics</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">RACE SPEC</span>
              </div>

              <div className="space-y-3 my-auto">
                <h3 className="text-xl font-semibold text-white">
                  Dynamic Carbon Winglets
                </h3>
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  Generates up to 30 kg of downforce at 170 mph to eliminate front-wheel wheelies without triggering electronic traction control intrusion.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[10px] font-mono px-2 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300">
                    Active Flaps
                  </span>
                  <span className="text-[10px] font-mono px-2 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300">
                    Cornering ABS Evo
                  </span>
                  <span className="text-[10px] font-mono px-2 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300">
                    Launch Control
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsPromptOpen(true)}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/50 text-xs font-mono text-purple-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5 text-orange-400" />
                <span>Configure Custom Superbike</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      <EnvironmentControls />
      <FuturisticFooter />

      {/* ================= MODAL OVERLAYS ================= */}

      {/* 1. INTERACTIVE SUPERBIKE DESIGN DRAWER */}
      {isPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setIsPromptOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-purple-600 flex items-center justify-center">
                <Wand2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-normal text-white">
                  DREAMFRAME Superbike Studio
                </h3>
                <p className="text-xs text-gray-400 font-light">
                  Configure a race-bred machine from aero to engine mapping
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Build Brief</span>
                  <button
                    type="button"
                    onClick={copyPrompt}
                    className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedPrompt ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedPrompt ? "Copied" : "Copy"}</span>
                  </button>
                </label>
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  rows={3}
                  className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder-gray-600 resize-none font-light"
                  placeholder="Describe the superbike specification, track setup, and finish..."
                />
              </div>

              {/* Selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5">
                    Bike Platform
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-purple-500 font-light"
                  >
                    <option value="V4 Aero Configurator">
                      V4 Aero Configurator
                    </option>
                    <option value="Inline-4 Track Engine">
                      Inline-4 Track Engine
                    </option>
                    <option value="Electric Hyperbike Lab">Electric Hyperbike Lab</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5">
                    Garage Environment
                  </label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-purple-500 font-light"
                  >
                    <option value="Track Studio">Track Studio</option>
                    <option value="Neon Night Ride">Neon Night Ride</option>
                    <option value="Pit Lane Technical">
                      Pit Lane Technical
                    </option>
                    <option value="Dark Cinematic">Dark Cinematic</option>
                  </select>
                </div>
              </div>

              {/* Quick Sample Prompts */}
              <div className="space-y-2">
                <span className="text-[11px] text-gray-400 font-mono font-light">
                  Quick Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Carbon V4 superbike with active winglets",
                    "Night-race bike with titanium exhaust glow",
                    "Exploded superbike chassis engineering view",
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPromptText(preset)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-light transition-all"
                    >
                      {preset.slice(0, 32)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-purple-600 hover:from-orange-400 hover:to-purple-500 text-white font-medium py-3 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-orange-200" />
                    <span>Engineering Bike Concept...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-orange-200" />
                    <span>Generate Superbike Build</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. FULL SCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-200">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src={activeImage}
                alt="Superbike build preview"
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-4 flex items-center justify-between w-full text-xs text-gray-400 font-mono font-light">
              <span>Power Target: 210 HP</span>
              <span className="text-purple-300">Platform: {selectedModel}</span>
              <span>Setup: {selectedStyle}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. PARAMETERS INSPECTOR MODAL */}
      {isInspectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#09090b] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setIsInspectorOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 text-purple-300">
              <Info className="w-4 h-4" />
              <h3 className="font-normal text-white text-sm">Superbike Build Parameters</h3>
            </div>

            <div className="space-y-3 text-xs font-mono font-light">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-gray-400 block mb-1">Active Build Brief:</span>
                <p className="text-gray-200 font-sans text-xs">{promptText}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-gray-400 block text-[10px]">ENGINE MAP</span>
                  <span className="text-purple-300 font-normal">RACE 2</span>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-gray-400 block text-[10px]">SUSPENSION</span>
                  <span className="text-purple-300 font-normal">TRACK</span>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-gray-400 block text-[10px]">TYRE SET</span>
                  <span className="text-purple-300 font-normal">SC V4</span>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-gray-400 block text-[10px]">AERO TRIM</span>
                  <span className="text-purple-300 font-normal">+28 KG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SHOWCASE GALLERY MODAL */}
      {isShowcaseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#09090b] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsShowcaseOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-normal text-white mb-1">
              DREAMFRAME Superbike Garage
            </h3>
            <p className="text-xs text-gray-400 mb-6 font-light">
              Select a superbike system to inspect in full detail
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: "Apex V4 Night Runner",
                  path: "/images/superbike-hero.jpg",
                  tag: "Complete Superbike",
                },
                {
                  title: "V4 Carbon Powertrain",
                  path: "/images/superbike-engine.jpg",
                  tag: "Engine Architecture",
                },
                {
                  title: "Aether X-1 Aero Front",
                  path: "/images/superbike-headlight.jpg",
                  tag: "Aerodynamic Package",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setActiveImage(item.path);
                    setIsShowcaseOpen(false);
                    setIsLightboxOpen(true);
                  }}
                  className="group relative h-48 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 cursor-pointer transition-all shadow-md"
                >
                  <Image
                    src={item.path}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 flex flex-col justify-end">
                    <span className="text-[10px] font-mono text-purple-300 uppercase font-light">
                      {item.tag}
                    </span>
                    <span className="text-xs font-normal text-white flex items-center justify-between">
                      {item.title}
                      <ChevronRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
