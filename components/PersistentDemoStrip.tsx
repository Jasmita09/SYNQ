import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SlidersHorizontal, 
  Zap, 
  ShieldAlert, 
  Volume2, 
  Sparkles, 
  Users, 
  RotateCcw,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { audioSynth } from '../services/audioSynth';

interface PersistentDemoStripProps {
  onBeatDrop: () => void;
  onTriggerSOS: () => void;
  onToggleDecibelAlert: () => void;
  decibelAlertActive: boolean;
  onToggleSponsor: () => void;
  sponsorActive: boolean;
  onBumpConnect: () => void;
  onResetAll: () => void;
  contactNotification: string | null;
}

export const PersistentDemoStrip: React.FC<PersistentDemoStripProps> = ({
  onBeatDrop,
  onTriggerSOS,
  onToggleDecibelAlert,
  decibelAlertActive,
  onToggleSponsor,
  sponsorActive,
  onBumpConnect,
  onResetAll,
  contactNotification,
}) => {
  return (
    <>
      {/* Bump Contact Toast */}
      <AnimatePresence>
        {contactNotification && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-mono-tech text-xs md:text-sm font-bold shadow-[0_0_30px_rgba(0,242,254,0.5)] flex items-center gap-3 border border-white/20"
          >
            <div className="p-1 rounded-full bg-white/20">
              <Heart className="w-4 h-4 fill-current text-white animate-bounce" />
            </div>
            <span>{contactNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pinned Bottom Control Strip */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#07090e]/95 backdrop-blur-md border-t border-white/10 px-4 md:px-8 py-2.5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-400 font-bold shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span className="uppercase tracking-wider text-slate-300">[ DEMO CONTROLS ]:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Beat Drop */}
            <button
              onClick={() => {
                onBeatDrop();
                audioSynth.playBeatDrop();
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono-tech bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Forces immediate bass onset, strobe pulse, and rhythm prompt"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>[ Beat Drop ]</span>
            </button>

            {/* 2. Trigger SOS */}
            <button
              onClick={() => {
                onTriggerSOS();
                audioSynth.playSOS();
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono-tech bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Forces 3s countdown, shifts nearby nodes into 10-meter red halo, outputs telemetry"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>[ Trigger SOS ]</span>
            </button>

            {/* 3. 106dB Alert */}
            <button
              onClick={onToggleDecibelAlert}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono-tech flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border ${
                decibelAlertActive
                  ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
              title="Simulates excessive sound pressure (106 dB) and triggers exposure countdown"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>[ 106dB Alert ]</span>
            </button>

            {/* 4. Sponsor Takeover */}
            <button
              onClick={onToggleSponsor}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono-tech flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border ${
                sponsorActive
                  ? 'bg-gradient-to-r from-[#003882] to-[#dc0032] text-white border-red-400 shadow-[0_0_12px_rgba(220,0,50,0.5)]'
                  : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30'
              }`}
              title="Forces all active light surfaces into branded sponsor colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>[ Sponsor Takeover ]</span>
            </button>

            {/* 5. Bump to Connect */}
            <button
              onClick={() => {
                onBumpConnect();
                audioSynth.playBump();
                audioSynth.triggerHaptic([80, 50, 80]);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono-tech bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Simulates two wristbands tapping together, triggering haptic heartbeat and contact exchange"
            >
              <Users className="w-3.5 h-3.5 text-pink-400" />
              <span>[ Bump to Connect ]</span>
            </button>

            {/* 6. Reset All */}
            <button
              onClick={() => {
                onResetAll();
                audioSynth.playTap();
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono-tech bg-white/5 hover:bg-white/10 text-slate-300 border border-white/15 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Clears all active alerts, restores default node positions, resets baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>[ Reset All ]</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
