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
  ChevronDown,
  ChevronUp,
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bump Contact Toast */}
      <AnimatePresence>
        {contactNotification && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-stone-900/95 backdrop-blur-md text-amber-200 font-mono-tech text-xs md:text-sm font-bold shadow-2xl flex items-center gap-3 border border-amber-400/30"
          >
            <div className="p-1 rounded-full bg-amber-400/20 text-amber-400">
              <Heart className="w-4 h-4 fill-current animate-bounce" />
            </div>
            <span>{contactNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsible Floating Bottom Strip (Uncrowded, Serene, Soft Festival Tones) */}
      <div className="fixed bottom-3 right-4 z-40 flex flex-col items-end">
        {/* Toggle Pill */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 rounded-full bg-stone-900/90 hover:bg-stone-800 backdrop-blur-md border border-white/10 text-xs font-mono-tech text-slate-300 hover:text-white flex items-center gap-2 shadow-xl transition-all cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            {isOpen ? 'Close Demo Deck' : 'Demo Deck'}
          </span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {/* Expanded Controls Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="mt-2 p-3 sm:p-4 rounded-2xl bg-stone-950/95 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-wrap items-center gap-2 max-w-xl"
            >
              <span className="text-[10px] font-mono-tech text-slate-400 font-bold uppercase tracking-wider px-2">
                Simulate:
              </span>

              {/* 1. Beat Drop */}
              <button
                onClick={() => {
                  onBeatDrop();
                  audioSynth.playBeatDrop();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-mono-tech font-bold bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                title="Forces 35Hz sub-bass onset, optical pulse, and rhythm prompt"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Beat Drop</span>
              </button>

              {/* 2. Trigger SOS */}
              <button
                onClick={() => {
                  onTriggerSOS();
                  audioSynth.playSOS();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-mono-tech font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                title="Triggers 10-meter red safety halo"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Trigger SOS</span>
              </button>

              {/* 3. 106dB Alert */}
              <button
                onClick={onToggleDecibelAlert}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono-tech font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border ${
                  decibelAlertActive
                    ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
                title="Toggles excessive sound pressure alert"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>106dB Alert</span>
              </button>

              {/* 4. Sponsor Takeover */}
              <button
                onClick={onToggleSponsor}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono-tech font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border ${
                  sponsorActive
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
                title="Forces all light surfaces into branded sponsor colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sponsor Takeover</span>
              </button>

              {/* 5. Bump to Connect */}
              <button
                onClick={() => {
                  onBumpConnect();
                  audioSynth.playBump();
                  audioSynth.triggerHaptic([80, 50, 80]);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-mono-tech font-bold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                title="Simulates BLE contact exchange"
              >
                <Users className="w-3.5 h-3.5 text-pink-400" />
                <span>Bump Pair</span>
              </button>

              {/* 6. Reset All */}
              <button
                onClick={() => {
                  onResetAll();
                  audioSynth.playTap();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-mono-tech text-slate-400 hover:text-white bg-transparent hover:bg-white/5 border border-transparent hover:border-white/10 flex items-center gap-1 transition-all cursor-pointer"
                title="Clears all active alerts"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
