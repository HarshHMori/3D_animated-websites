"use client";

import { Music2, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./BikeSoundscape.module.css";

interface AudioGraph {
  context: AudioContext;
  masterGain: GainNode;
  noiseBuffer: AudioBuffer;
}

function createNoiseBuffer(context: AudioContext) {
  const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
  const channel = buffer.getChannelData(0);

  for (let index = 0; index < channel.length; index += 1) {
    channel[index] = Math.random() * 2 - 1;
  }

  return buffer;
}

function triggerSoftKick(graph: AudioGraph, startTime: number) {
  const oscillator = graph.context.createOscillator();
  const gain = graph.context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(92, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(38, startTime + 0.16);
  gain.gain.setValueAtTime(0.3, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);
  oscillator.connect(gain).connect(graph.masterGain);
  oscillator.start(startTime);
  oscillator.stop(startTime + 0.3);
}

function triggerSnare(graph: AudioGraph, startTime: number) {
  const source = graph.context.createBufferSource();
  const filter = graph.context.createBiquadFilter();
  const gain = graph.context.createGain();
  source.buffer = graph.noiseBuffer;
  filter.type = "highpass";
  filter.frequency.value = 1500;
  gain.gain.setValueAtTime(0.11, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.16);
  source.connect(filter).connect(gain).connect(graph.masterGain);
  source.start(startTime);
  source.stop(startTime + 0.18);
}

function triggerHiHat(graph: AudioGraph, startTime: number) {
  const source = graph.context.createBufferSource();
  const filter = graph.context.createBiquadFilter();
  const gain = graph.context.createGain();
  source.buffer = graph.noiseBuffer;
  filter.type = "highpass";
  filter.frequency.value = 6200;
  gain.gain.setValueAtTime(0.027, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.045);
  source.connect(filter).connect(gain).connect(graph.masterGain);
  source.start(startTime);
  source.stop(startTime + 0.05);
}

function noteFrequency(midiNote: number) {
  return 440 * 2 ** ((midiNote - 69) / 12);
}

function triggerSynthNote(
  graph: AudioGraph,
  startTime: number,
  midiNote: number,
  duration: number,
  level: number,
  type: OscillatorType,
  cutoff: number,
) {
  const oscillator = graph.context.createOscillator();
  const filter = graph.context.createBiquadFilter();
  const gain = graph.context.createGain();
  oscillator.type = type;
  oscillator.frequency.value = noteFrequency(midiNote);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(cutoff * 0.55, startTime);
  filter.frequency.exponentialRampToValueAtTime(cutoff, startTime + 0.08);
  filter.Q.value = 2.1;
  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.exponentialRampToValueAtTime(level, startTime + 0.025);
  gain.gain.setValueAtTime(level * 0.72, startTime + duration * 0.62);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  oscillator.connect(filter).connect(gain).connect(graph.masterGain);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.03);
}

const CHORDS = [
  [57, 60, 64],
  [53, 57, 60],
  [60, 64, 67],
  [55, 59, 62],
] as const;
const BASS_NOTES = [45, 41, 48, 43] as const;
const LEAD_PATTERN = [
  69, null, 72, null, 76, 72, null, 69,
  65, null, 69, null, 72, 69, 67, null,
  67, null, 72, 76, null, 79, 76, 72,
  67, 71, null, 74, 71, 67, 64, null,
] as const;

function scheduleSongStep(graph: AudioGraph, step: number, startTime: number) {
  const songStep = step % 64;
  const bar = Math.floor(songStep / 16);
  const beatStep = songStep % 16;

  if ([0, 6, 8, 11].includes(beatStep)) triggerSoftKick(graph, startTime);
  if ([4, 12].includes(beatStep)) triggerSnare(graph, startTime);
  if (beatStep % 2 === 1) triggerHiHat(graph, startTime);

  if (beatStep % 4 === 0) {
    triggerSynthNote(graph, startTime, BASS_NOTES[bar], 0.44, 0.085, "sawtooth", 260);
  }

  if (beatStep === 0 || beatStep === 8) {
    CHORDS[bar].forEach((note) => {
      triggerSynthNote(graph, startTime, note, 1.18, 0.027, "triangle", 1150);
    });
  }

  const melodyNote = LEAD_PATTERN[(songStep + 8) % LEAD_PATTERN.length];
  if (melodyNote !== null && beatStep % 2 === 0) {
    triggerSynthNote(graph, startTime, melodyNote, 0.29, 0.052, "square", 2100);
  }
}

export default function BikeSoundscape() {
  const graphRef = useRef<AudioGraph | null>(null);
  const nextStepTimeRef = useRef(0);
  const stepRef = useRef(0);
  const [enabled, setEnabled] = useState(false);

  const createAudioGraph = () => {
    const context = new AudioContext();
    const masterGain = context.createGain();
    const compressor = context.createDynamicsCompressor();
    masterGain.gain.value = 0.21;
    compressor.threshold.value = -20;
    compressor.knee.value = 18;
    compressor.ratio.value = 4;
    masterGain.connect(compressor).connect(context.destination);

    const noiseBuffer = createNoiseBuffer(context);
    const ambienceSource = context.createBufferSource();
    const ambienceFilter = context.createBiquadFilter();
    const ambienceGain = context.createGain();
    ambienceSource.buffer = noiseBuffer;
    ambienceSource.loop = true;
    ambienceFilter.type = "lowpass";
    ambienceFilter.frequency.value = 340;
    ambienceGain.gain.value = 0.008;
    ambienceSource.connect(ambienceFilter).connect(ambienceGain).connect(masterGain);

    const padGain = context.createGain();
    const padFilter = context.createBiquadFilter();
    padGain.gain.value = 0.012;
    padFilter.type = "lowpass";
    padFilter.frequency.value = 520;
    padFilter.Q.value = 1.6;
    padFilter.connect(padGain).connect(masterGain);

    [55, 82.41].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      oscillator.detune.value = index === 0 ? -7 : 6;
      oscillator.connect(padFilter);
      oscillator.start();
    });

    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    lfo.frequency.value = 0.075;
    lfoGain.gain.value = 110;
    lfo.connect(lfoGain).connect(padFilter.frequency);

    ambienceSource.start();
    lfo.start();

    const graph = { context, masterGain, noiseBuffer };
    graphRef.current = graph;
    return graph;
  };

  const toggleSound = async () => {
    const graph = graphRef.current ?? createAudioGraph();

    if (enabled) {
      await graph.context.suspend();
      setEnabled(false);
      return;
    }

    await graph.context.resume();
    nextStepTimeRef.current = graph.context.currentTime + 0.06;
    setEnabled(true);
  };

  useEffect(() => {
    if (!enabled) return;

    let animationFrame = 0;
    const schedule = () => {
      const graph = graphRef.current;
      if (graph && graph.context.state === "running") {
        const stepDuration = 60 / 108 / 4;
        while (nextStepTimeRef.current < graph.context.currentTime + 0.12) {
          scheduleSongStep(graph, stepRef.current, nextStepTimeRef.current);
          stepRef.current += 1;
          nextStepTimeRef.current += stepDuration;
        }
      }
      animationFrame = requestAnimationFrame(schedule);
    };

    animationFrame = requestAnimationFrame(schedule);
    return () => cancelAnimationFrame(animationFrame);
  }, [enabled]);

  useEffect(
    () => () => {
      const context = graphRef.current?.context;
      if (context && context.state !== "closed") void context.close();
    },
    [],
  );

  return (
    <button
      type="button"
      className={`${styles.soundControl} ${enabled ? styles.enabled : ""}`}
      onClick={toggleSound}
      aria-pressed={enabled}
      aria-label={enabled ? "Mute background sound" : "Enable background sound"}
    >
      <span className={styles.icon}>
        {enabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
      </span>
      <span className={styles.copy}>
        <small>ORIGINAL SYNTHWAVE TRACK</small>
        <strong>{enabled ? "NEON APEX • PLAYING" : "PLAY MUSIC"}</strong>
      </span>
      <span className={styles.meter} aria-hidden="true">
        <i />
      </span>
      <Music2 className={styles.gauge} aria-hidden="true" />
    </button>
  );
}
