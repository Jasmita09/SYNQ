import React, { useState } from 'react';
import { AppMode, BrandName } from '../types';
import { Radio, Volume2, VolumeX, Sparkles, ChevronDown, Check } from 'lucide-react';
import { audioSynth } from '../services/audioSynth';

interface GlobalNavbarProps {
  mode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  brandName: BrandName;
  onSelectBrandName: (brand: BrandName) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  sponsorActive: boolean;
}

const BRAND_OPTIONS: { name: BrandName; vibe: string }[] = [
  { name: 'SYNQ', vibe: 'Active Brand · SYNQ Halo Wearable & Mesh Protocol' },
  { name: 'SONEX', vibe: 'Deep-Tech · Like SpaceX, Sonos & Vertex' },
  { name: 'RESONA', vibe: 'Acoustic Resonance · Like NVIDIA & Solana' },
  { name: 'PULSEX', vibe: 'Haptic Audio · Like SpaceX & Neuralink' },
];

export const GlobalNavbar: React.FC<GlobalNavbarProps> = ({
  mode,
  onSelectMode,
  brandName,
  onSelectBrandName,
  isMuted,
  onToggleMute,
  sponsorActive,
}) => {
  const [showBrandMenu, setShowBrandMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#07090e]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 flex items-center justify-between gap-4 transition-colors duration-500">
      {/* Left: Brand Home with Startup Switcher */}
      <div className="relative flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => {
            onSelectMode('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex items-center gap-2.5 bg-transparent border-0 cursor-pointer p-0 text-left"
          title={`${brandName} Home Portal`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#00f2fe] group-hover:scale-125 transition-transform duration-300 shadow-[0_0_10px_#00f2fe]" />
          <span className="font-heading text-lg md:text-xl font-bold tracking-widest text-white group-hover:text-[#00f2fe] transition-colors whitespace-nowrap">
            {brandName}
          </span>
        </button>

        {/* Brand Dropdown Trigger to test other startup names */}
        <div className="relative">
          <button
            onClick={() => setShowBrandMenu(!showBrandMenu)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border-0 bg-transparent flex items-center"
            title="Switch Startup Name Contender"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showBrandMenu && (
            <div className="absolute left-0 mt-3 w-64 rounded-2xl bg-[#0e121d] border border-white/15 p-2 shadow-2xl z-50 space-y-1 backdrop-blur-xl">
              <div className="px-3 py-1.5 text-[10px] font-mono-tech text-slate-400 border-b border-white/10 uppercase">
                Startup Name Contenders
              </div>
              {BRAND_OPTIONS.map(opt => (
                <button
                  key={opt.name}
                  onClick={() => {
                    onSelectBrandName(opt.name);
                    setShowBrandMenu(false);
                    audioSynth.playTap();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer border-0 transition-colors ${
                    brandName === opt.name
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                      : 'bg-transparent text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div>
                    <p className="font-heading tracking-wider">{opt.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono-tech">{opt.vibe}</p>
                  </div>
                  {brandName === opt.name && <Check className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Segmented Mode Switcher */}
      <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-xl max-w-md">
        <button
          onClick={() => onSelectMode('at-home')}
          className={`px-3 md:px-5 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer border-0 ${
            mode === 'at-home'
              ? sponsorActive
                ? 'bg-gradient-to-r from-[#003882] to-[#dc0032] text-white shadow-lg'
                : 'bg-[#00f2fe] text-black shadow-[0_0_15px_rgba(0,242,254,0.3)]'
              : 'text-slate-400 hover:text-white bg-transparent'
          }`}
        >
          At-Home Concert
        </button>
        <div className="w-[1px] h-4 bg-white/10 mx-1" />
        <button
          onClick={() => onSelectMode('in-venue')}
          className={`px-3 md:px-5 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer border-0 ${
            mode === 'in-venue'
              ? sponsorActive
                ? 'bg-gradient-to-r from-[#dc0032] to-[#003882] text-white shadow-lg'
                : 'bg-[#ff007a] text-white shadow-[0_0_15px_rgba(255,0,122,0.3)]'
              : 'text-slate-400 hover:text-white bg-transparent'
          }`}
        >
          Live In-Venue
        </button>
      </div>

      {/* Right: System Telemetry & Audio Control */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMute}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title={isMuted ? 'Unmute Audio Synth' : 'Mute Audio Synth'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#00f2fe]" />}
        </button>

        {sponsorActive && (
          <span className="hidden lg:flex items-center gap-1 text-[11px] font-mono-tech px-2 py-1 rounded bg-[#dc0032]/20 border border-[#dc0032]/40 text-[#ff4b6e]">
            <Sparkles className="w-3 h-3" />
            SPONSOR TAKEOVER
          </span>
        )}

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-mono-tech text-xs whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span>Status: Online</span>
        </div>
      </div>
    </header>
  );
};
