import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ShieldAlert, 
  Volume2, 
  Radio, 
  Activity, 
  Zap, 
  ChevronRight, 
  X, 
  Cpu, 
  CheckCircle2,
  Compass
} from 'lucide-react';
import { audioSynth } from '../services/audioSynth';
import tavyHaloImg from '../src/assets/images/tavy_halo_anatomy_1792274106161.jpg';

interface Hotspot {
  id: string;
  title: string;
  subtitle: string;
  x: number; // percentage from left
  y: number; // percentage from top
  metric: string;
  description: string;
  spec: string;
  actionLabel: string;
  onAction: () => void;
}

interface TavyHaloShowcaseProps {
  onTriggerSOS: () => void;
  onBeatPulse: () => void;
  beatTick: number;
}

export const TavyHaloShowcase: React.FC<TavyHaloShowcaseProps> = ({
  onTriggerSOS,
  onBeatPulse,
  beatTick,
}) => {
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>('fin');
  const [isAeroActive, setIsAeroActive] = useState(false);
  const [selectedView, setSelectedView] = useState<'all' | 'fin' | 'switch' | 'lra' | 'mesh'>('all');

  const hotspots: Hotspot[] = [
    {
      id: 'fin',
      title: 'Crystalline Waveguide Fin',
      subtitle: '16.8M RGB Arena Choreography',
      x: 56,
      y: 35,
      metric: '128 BPM Pulse Lock · 0 ms Jitter',
      spec: 'Optical grade PMMA light fin with internal total-internal-reflection prisming',
      description: 'Channels internal micro-LED pulses upward into a high-visibility beam designed to cut through festival haze and pyrotechnic smoke, harmonizing thousands of crowd bands into unified arena light waves.',
      actionLabel: 'Test Optical Strobe',
      onAction: () => {
        onBeatPulse();
        audioSynth.playKick(0.7);
      },
    },
    {
      id: 'switch',
      title: 'Tactile Emergency Slider',
      subtitle: 'Accident-Proof Blind SOS',
      x: 64,
      y: 59,
      metric: '3s Blind Hold · 5s Abort Window',
      spec: 'Positive-detent mechanical slider with textured rubber grip',
      description: 'Engineered to be located instantly by fingertip inside a pitch-black, 110 dB crowd without looking down at a screen. Requires a continuous 3-second hold to illuminate the 10-meter offline safety halo.',
      actionLabel: 'Arm SOS Halo',
      onAction: () => {
        onTriggerSOS();
        audioSynth.playSOS();
      },
    },
    {
      id: 'lra',
      title: '35Hz Dual LRA Engine',
      subtitle: 'Sub-Bass Bone Conduction',
      x: 42,
      y: 65,
      metric: '35 Hz - 120 Hz Sub-Bass Resonance',
      spec: 'Dual high-force Linear Resonant Actuators tuned to 45Hz fundamental kick',
      description: 'Translates acoustic bass drops and kick drums into visceral physical sensations directly through the wrist bones, empowering deaf and hard-of-hearing music fans to feel every musical beat.',
      actionLabel: 'Test 35Hz Kick Waveform',
      onAction: () => {
        audioSynth.playBeatDrop();
        audioSynth.triggerHaptic([120, 60, 240]);
      },
    },
    {
      id: 'mesh',
      title: 'AuraMesh BLE 5.3 Array',
      subtitle: '100% Offline Festival Mesh',
      x: 27,
      y: 48,
      metric: '10m Radius · 250 Active Nodes',
      spec: 'Encrypted peer-to-peer advertising protocol running at 2.4 GHz',
      description: 'Operates completely independently of congested cellular towers or venue Wi-Fi. Automatically forms an ad-hoc local mesh with nearby Tavy devices to maintain safety perimeters and friend location beacons.',
      actionLabel: 'Ping 10m Mesh',
      onAction: () => {
        audioSynth.playBump();
      },
    },
  ];

  const activeHotspot = hotspots.find(h => h.id === activeHotspotId) || hotspots[0];

  const handleToggleAeroInAction = () => {
    setIsAeroActive(!isAeroActive);
    audioSynth.playBeatDrop();
    onBeatPulse();
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 md:px-8 py-20 space-y-10 border-t border-white/[0.08]">
      {/* Editorial Header in Ford GT / Ideal House Style */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <p className="text-xs font-mono-tech tracking-widest uppercase text-amber-400/90 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>HARDWARE ARCHITECTURE</span>
        </p>

        <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
          The Tavy Halo Wearable
        </h2>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
          This is what true acoustic innovation looks like. From its 35Hz sub-bass Linear Resonant Actuator to its crowd-synchronized optical fin, the Tavy Halo is the culmination of festival acoustics and sensory inclusion. And it&apos;s the same passion for live presence that connects virtual fans and live arenas.
        </p>

        {/* Ford GT Style Interactive Callout Link */}
        <div className="pt-2">
          <button
            onClick={handleToggleAeroInAction}
            className="inline-flex items-center gap-2 text-sm font-mono-tech font-bold text-amber-300 hover:text-amber-200 transition-colors bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-5 py-2.5 rounded-full cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            <span>Hardware in Action</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-Feature View Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono-tech">
        {[
          { id: 'all', label: '01. Complete Assembly' },
          { id: 'fin', label: '02. Waveguide Fin' },
          { id: 'switch', label: '03. Tactile Slider' },
          { id: 'lra', label: '04. Sub-Bass Actuator' },
          { id: 'mesh', label: '05. Offline Mesh' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => {
              setSelectedView(item.id as unknown as 'all');
              if (item.id !== 'all') {
                setActiveHotspotId(item.id);
              }
              audioSynth.playTap();
            }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer border ${
              (selectedView === item.id) || (selectedView === 'all' && item.id === 'all')
                ? 'bg-white text-black font-bold border-white shadow-md'
                : 'bg-white/[0.03] text-slate-400 hover:text-white border-white/10 hover:bg-white/5'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Interactive Stage with Clickable (+) Hotspots */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0c0d16] shadow-2xl">
        {/* Soft festival atmospheric background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 rounded-full blur-[140px] pointer-events-none" />

        {/* 16:9 Cinematic Photo Stage */}
        <div className="relative aspect-video w-full overflow-hidden flex items-center justify-center">
          <img
            src={tavyHaloImg}
            alt="Tavy Halo Concert Wearable Anatomy"
            className="w-full h-full object-cover select-none"
            style={{
              filter: isAeroActive ? 'contrast(1.08) brightness(1.05)' : 'none',
              transform: beatTick % 2 === 0 ? 'scale(1.008)' : 'scale(1.0)',
              transition: 'transform 0.4s ease-out, filter 0.4s ease-out',
            }}
          />

          {/* Dynamic Lightwave Strobe Overlay on the Fin */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-150"
            style={{
              background: 'radial-gradient(circle at 56% 36%, rgba(245, 158, 11, 0.35) 0%, rgba(192, 132, 252, 0.2) 25%, transparent 60%)',
              opacity: (beatTick % 2 === 0 || isAeroActive) ? 0.9 : 0.2,
            }}
          />

          {/* Interactive (+) Hotspot Buttons (Ford GT Style) */}
          {hotspots.map(spot => {
            const isSelected = activeHotspotId === spot.id;
            return (
              <div
                key={spot.id}
                className="absolute z-20"
                style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
              >
                <button
                  onClick={() => {
                    setActiveHotspotId(spot.id);
                    audioSynth.playTap();
                  }}
                  className="relative group p-0 bg-transparent border-0 cursor-pointer -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                  title={spot.title}
                >
                  {/* Outer pulsating ring */}
                  <span className="absolute inset-0 w-8 h-8 rounded-full bg-white/40 animate-ping pointer-events-none" />

                  {/* Circle Button with (+) */}
                  <div
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 shadow-xl border ${
                      isSelected
                        ? 'bg-amber-400 text-black border-white scale-125 shadow-[0_0_20px_#f59e0b]'
                        : 'bg-white/80 hover:bg-white text-black border-white/60 hover:scale-110'
                    }`}
                  >
                    +
                  </div>

                  {/* Hover preview tooltip */}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono-tech whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {spot.title}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Feature Detail Drawer (Ford GT Exploded Feature Card) */}
        <div className="p-6 md:p-8 bg-gradient-to-t from-black via-black/90 to-black/60 border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono-tech font-bold uppercase">
                  {activeHotspot.subtitle}
                </span>
                <span className="text-xs font-mono-tech text-slate-400">
                  {activeHotspot.metric}
                </span>
              </div>

              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                {activeHotspot.title}
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                {activeHotspot.description}
              </p>

              <p className="text-[11px] font-mono-tech text-slate-400">
                <span className="text-slate-500">ENGINEERING SPEC: </span>
                {activeHotspot.spec}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                onClick={activeHotspot.onAction}
                className="w-full py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-heading font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer border-0 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{activeHotspot.actionLabel}</span>
              </button>

              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono-tech text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Live Sensor Sync
                </span>
                <span className="text-amber-400 font-bold">100% OPERATIONAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
