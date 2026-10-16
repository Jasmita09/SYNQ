import React from 'react';
import { motion } from 'framer-motion';
import { 
  Tv, 
  Radio, 
  Volume2, 
  ShieldAlert, 
  MessageSquare, 
  Sparkles, 
  Zap, 
  Eye, 
  Layers, 
  WifiOff, 
  Activity, 
  ArrowRight,
  Disc3,
  Cpu
} from 'lucide-react';
import { AppMode, BrandName } from '../types';

interface HomePortalProps {
  onSelectMode: (mode: AppMode) => void;
  brandName: BrandName;
  sponsorActive: boolean;
}

export const HomePortal: React.FC<HomePortalProps> = ({ onSelectMode, brandName, sponsorActive }) => {
  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 space-y-16">
      {/* Hero Brand Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono-tech text-cyan-400"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>DEEP-TECH CONCERT &amp; ACCESSIBILITY INFRASTRUCTURE</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white drop-shadow-[0_0_35px_rgba(0,242,254,0.3)]"
        >
          {brandName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl sm:text-2xl font-light text-cyan-200/90 italic"
        >
          &ldquo;Feel the concert. Together.&rdquo;
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
        >
          The next-generation concert &amp; accessibility protocol bridging virtual fans and arenas through sub-bass haptic synchronization, extreme-SPL communication, and decentralized offline mesh safety.
        </motion.p>
      </div>

      {/* Two Primary Mode Gateways */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gateway 1: At-Home Virtual Stage */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className={`relative rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0b1324] to-[#080d19] ${
            sponsorActive
              ? 'border-[#003882]/80 shadow-[0_0_40px_rgba(0,56,130,0.25)]'
              : 'border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_30px_rgba(0,242,254,0.12)]'
          }`}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Tv className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono-tech px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                HER SCREEN
              </span>
            </div>

            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-wide">
                AT-HOME VIRTUAL STAGE
              </h2>
              <p className="text-cyan-300/80 text-sm mt-1">For fans attending from home.</p>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed">
              Step inside the virtual arena with ultra-low latency spatial sound, reactive ambient glow that replicates the stadium atmosphere, and private synced rooms with friends worldwide.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { text: 'Synchronized 2.5D concert stream', icon: Disc3 },
                { text: 'Multi-angle camera switching (Main, Bias, Dance)', icon: Eye },
                { text: 'Private watch-party rooms with 0 ms sync offset', icon: Sparkles },
                { text: 'Fanchant rhythm interaction & streak scoring', icon: Zap },
                { text: 'Community encore unlock milestone progress', icon: Activity },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 relative z-10">
            <button
              onClick={() => onSelectMode('at-home')}
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-3 transition-all duration-300 bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,242,254,0.4)] cursor-pointer border-0"
            >
              <span>Launch Virtual Concert</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Gateway 2: Live In-Venue Tools */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className={`relative rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#190a18] to-[#0c050d] ${
            sponsorActive
              ? 'border-[#dc0032]/80 shadow-[0_0_40px_rgba(220,0,50,0.25)]'
              : 'border-pink-500/30 hover:border-pink-400/60 shadow-[0_0_30px_rgba(255,0,122,0.12)]'
          }`}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                <Radio className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono-tech px-3 py-1 rounded-full bg-pink-950/60 border border-pink-500/30 text-pink-300">
                YOUR SCREEN
              </span>
            </div>

            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-wide">
                LIVE IN-VENUE TOOLS
              </h2>
              <p className="text-pink-300/80 text-sm mt-1">For fans physically inside the venue.</p>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed">
              Tactile and visual safety companion engineered for 110 dB stadium noise floors. Overcomes wireless blackout through ad-hoc BLE mesh and monitors hearing hazard exposure.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { text: 'Interactive Digital Lightstick with acoustic kick sync', icon: Sparkles },
                { text: 'In-Venue "Big Text" chat readable 5+ ft over 110 dB', icon: MessageSquare },
                { text: 'Real-time decibel hearing health monitor & alerts', icon: Volume2 },
                { text: 'Offline 10m Emergency Red Halo (AuraMesh)', icon: ShieldAlert },
                { text: 'Wearable Watch Companion Link with LRA haptics', icon: Cpu },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 relative z-10">
            <button
              onClick={() => onSelectMode('in-venue')}
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-3 transition-all duration-300 bg-pink-500 text-white hover:bg-pink-400 shadow-[0_0_20px_rgba(255,0,122,0.4)] cursor-pointer border-0"
            >
              <span>Launch Live Arena</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Core System Pillars */}
      <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-8">
        <div className="text-xs font-mono-tech tracking-wider text-slate-400 uppercase mb-6 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>CORE SYSTEM PILLARS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
              <Zap className="w-4 h-4" />
              <span>Multi-Sensory Music</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Visual &amp; tactile beat sync translates raw sonic energy into synchronized lightstick strobes, ambient room lighting, and tactile haptic motor pulses.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-pink-400 font-bold text-base">
              <MessageSquare className="w-4 h-4" />
              <span>Zero-Noise Inclusion</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Text communication at 110 dB ensures deaf, hard-of-hearing, and speech-strained fans can instantly coordinate water, restrooms, or exits through high-contrast typography.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold text-base">
              <WifiOff className="w-4 h-4" />
              <span>Offline Mesh Safety</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              10m Red Halo without Wi-Fi broadcasts emergency distress across a 100-node localized {brandName}Mesh protocol to illuminate a physical perimeter around vulnerable concert-goers.
            </p>
          </div>
        </div>
      </div>

      {/* Hardware Teaser Card: Physical Wearable */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-950 to-slate-900/90 border border-white/15 overflow-hidden p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono-tech">
              <Cpu className="w-3.5 h-3.5" />
              <span>COMPANION HARDWARE TWIN</span>
            </div>

            <h3 className="font-heading text-2xl md:text-3xl font-bold text-white">
              The {brandName} Halo Wearable
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed">
              An aerospace-grade silicone wristband engineered for stadium acoustics and zero-latency haptic telepresence. Paired seamlessly with both At-Home and In-Venue concert experiences.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs font-bold text-cyan-300 font-mono-tech">Edge-Lit Fin</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Crystalline acrylic light blade synchronizes with crowd choreography
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs font-bold text-pink-300 font-mono-tech">Tactile LRA Motor</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Linear Resonant Actuator renders sub-bass kick waveforms down to 35 Hz
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs font-bold text-red-300 font-mono-tech">Physical SOS Switch</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Tactile slider switch for 3-second blind triggering in dense crowds
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono-tech text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                BLE 5.3 Mesh Ready
              </span>
              <span>•</span>
              <span>18-Hour Battery</span>
              <span>•</span>
              <span>IP68 Waterproof</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/50 shadow-2xl group">
              <img
                src="/src/assets/images/auraband_hardware_1792160449440.jpg"
                alt="SYNQ Halo Concert Wearable Hardware"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono-tech text-cyan-300">
                <span>MODEL: SYNQ-HALO-2026</span>
                <span>RGB BLADE + DUAL LRA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
