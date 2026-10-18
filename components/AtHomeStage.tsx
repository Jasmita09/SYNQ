import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2, 
  Share2, 
  Check, 
  Heart, 
  Flame, 
  Zap, 
  Sparkles, 
  Radio, 
  Users, 
  Clock, 
  Award,
  Music,
  Camera,
  Layers
} from 'lucide-react';
import { CameraAngle, CheerReaction, WatchPartyMember, BrandName } from '../types';
import { audioSynth } from '../services/audioSynth';
import mainStageImg from '../src/assets/images/concert_stage_stream_1792160451262.jpg';
import biasCamImg from '../src/assets/images/bias_focus_cam_1792160467203.jpg';
import danceCamImg from '../src/assets/images/dance_cam_1792160466135.jpg';

interface AtHomeStageProps {
  sponsorActive: boolean;
  onTriggerBeatPulse: () => void;
  beatTick: number;
  brandName: BrandName;
}

const INITIAL_MEMBERS: WatchPartyMember[] = [
  { id: '1', name: 'You (Host)', status: 'Syncing · Combo x12', isHost: true, avatarColor: '#00f2fe', energy: 88 },
  { id: '2', name: 'Maya', status: 'Dancing · Bias Cam', isHost: false, avatarColor: '#ff007a', energy: 94 },
  { id: '3', name: 'Alex', status: 'Rhythm Tap · 98% Acc', isHost: false, avatarColor: '#a855f7', energy: 82 },
];

export const AtHomeStage: React.FC<AtHomeStageProps> = ({
  sponsorActive,
  onTriggerBeatPulse,
  beatTick,
  brandName,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [cameraAngle, setCameraAngle] = useState<CameraAngle>('main');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(134); // 02:14
  const totalDuration = 225; // 03:45
  const [copiedLink, setCopiedLink] = useState(false);

  // Cheer reactions floating
  const [reactions, setReactions] = useState<CheerReaction[]>([]);

  // Rhythm game state
  const [score, setScore] = useState(1450);
  const [combo, setCombo] = useState(12);
  const [energy, setEnergy] = useState(85);
  const [tapFeedback, setTapFeedback] = useState<string | null>(null);
  const [cuePrompt, setCuePrompt] = useState('CHORUS DROP IN 3... 2... 1... !');
  const [encoreUnlocked, setEncoreUnlocked] = useState(false);

  // Timer simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= totalDuration) return 0;
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Rhythm prompt cycle
  useEffect(() => {
    const prompts = [
      'CHORUS DROP IN 3... 2... 1... !',
      'HEAVY SUB-BASS KICK INCOMING',
      'SYNCHRONIZE LIGHTSTICK WITH MAYA',
      'DOUBLE TAP THE DROP BEAT',
      'ENCORE MILESTONE AT 100% ENERGY',
    ];
    const promptInterval = setInterval(() => {
      const next = prompts[Math.floor(Math.random() * prompts.length)];
      setCuePrompt(next);
    }, 4500);
    return () => clearInterval(promptInterval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyRoomLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText('https://tavy.live/room/#TAVY-STARLIGHT');
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddCheer = (type: 'heart' | 'stick' | 'spark' | 'confetti', label: string, color: string) => {
    const newCheer: CheerReaction = {
      id: Math.random().toString(),
      type,
      label,
      x: 20 + Math.random() * 60,
      y: 80,
      color,
    };
    setReactions(prev => [...prev.slice(-15), newCheer]);
    audioSynth.playTap();
    onTriggerBeatPulse();
    setEnergy(prev => Math.min(100, prev + 1));
  };

  const handleTapOnBeat = () => {
    audioSynth.playTap();
    audioSynth.triggerHaptic([40]);
    onTriggerBeatPulse();

    const feedbacks = ['PERFECT! +100', 'SUPER SYNC! +150', 'EXCELLENT! +120'];
    const fb = feedbacks[Math.floor(Math.random() * feedbacks.length)];
    setTapFeedback(fb);
    setTimeout(() => setTapFeedback(null), 700);

    setScore(prev => prev + 120);
    setCombo(prev => prev + 1);
    setEnergy(prev => {
      const next = Math.min(100, prev + 3);
      if (next >= 100 && !encoreUnlocked) {
        setEncoreUnlocked(true);
        audioSynth.playBeatDrop();
      }
      return next;
    });
  };

  // Camera images
  const getCameraSource = () => {
    switch (cameraAngle) {
      case 'bias':
        return biasCamImg;
      case 'dance':
        return danceCamImg;
      case 'main':
      default:
        return mainStageImg;
    }
  };

  // Dynamic ambient glow colors based on preset or beat
  const getGlowColor = () => {
    if (sponsorActive) return 'rgba(220, 0, 50, 0.4)';
    if (beatTick % 2 === 0) return 'rgba(0, 242, 254, 0.45)';
    return 'rgba(255, 0, 122, 0.45)';
  };

  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Encore Celebration Banner if 100% reached */}
      <AnimatePresence>
        {encoreUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-400/40 text-center flex items-center justify-between gap-4 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
          >
            <div className="flex items-center gap-3 text-left">
              <span className="p-2 rounded-xl bg-amber-400 text-black font-bold text-xs">
                ENCORE UNLOCKED
              </span>
              <p className="text-sm font-semibold text-white">
                Community Goal 100% Reached! Bonus Acoustic Track &quot;Neon Constellations&quot; Initiated.
              </p>
            </div>
            <button
              onClick={() => {
                setEncoreUnlocked(false);
                setEnergy(85);
              }}
              className="text-xs font-mono-tech px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer border-0"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`grid grid-cols-1 ${isFullscreen ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
        {/* Left Column: Panel A (Concert Stage) + Panel B (Camera Controls) */}
        <div className={isFullscreen ? 'lg:col-span-12' : 'lg:col-span-8'} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* PANEL A: THE CONCERT STAGE */}
          <div
            className="relative rounded-3xl overflow-hidden border border-white/15 bg-black transition-all duration-300"
            style={{
              boxShadow: `0 0 50px ${getGlowColor()}, inset 0 0 40px rgba(0,0,0,0.8)`,
            }}
          >
            {/* Top Stream Status Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-xs font-mono-tech">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-bold text-white tracking-wider">LIVE 4K STREAM</span>
                <span className="text-slate-400">· 60 FPS · 0 ms Jitter</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-cyan-300 border border-white/10">
                  Angle: {cameraAngle.toUpperCase()}
                </span>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white cursor-pointer border border-white/20"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Stage Mode'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Video Canvas Frame */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950 flex items-center justify-center">
              <img
                src={getCameraSource()}
                alt="NOVA Starlight Live Concert Stream"
                className="w-full h-full object-cover transition-all duration-700"
                style={{
                  transform: beatTick % 2 === 0 ? 'scale(1.015)' : 'scale(1.0)',
                }}
                referrerPolicy="no-referrer"
              />

              {/* Ambient Beat Flash Overlay */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-150"
                style={{
                  backgroundColor: sponsorActive ? 'rgba(220,0,50,0.1)' : 'rgba(0, 242, 254, 0.08)',
                  opacity: beatTick % 2 === 0 ? 0.8 : 0,
                }}
              />

              {/* Dynamic Floating Cheers */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <AnimatePresence>
                  {reactions.map(r => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 1, y: 0, x: `${r.x}%`, scale: 0.8 }}
                      animate={{ opacity: 0, y: -260, scale: 1.4 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2.2, ease: 'easeOut' }}
                      className="absolute bottom-10 font-bold text-lg drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]"
                      style={{ color: r.color }}
                    >
                      {r.label}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Tap Feedback Popups */}
              <AnimatePresence>
                {tapFeedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1.2, y: 0 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 0.4 }}
                    className="absolute z-30 font-heading font-black text-2xl md:text-3xl tracking-widest text-[#00f2fe] drop-shadow-[0_0_20px_#00f2fe]"
                  >
                    {tapFeedback}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Stream Player Controls & Track Metadata */}
            <div className="p-4 md:p-6 bg-gradient-to-t from-black via-black/90 to-black/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsPlaying(!isPlaying);
                      if (!isPlaying) audioSynth.playKick();
                    }}
                    className="p-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold transition-all shadow-[0_0_15px_rgba(0,242,254,0.4)] cursor-pointer border-0"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-white text-base md:text-lg tracking-wide">
                        NOVA
                      </span>
                      <span className="text-slate-400 text-sm">— &ldquo;Starlight Live&rdquo;</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-white/10 text-cyan-300">
                        128 BPM
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 font-mono-tech">
                      <span>Chorus Peak 1: 00:45</span>
                      <span>·</span>
                      <span>Chorus Peak 2: 01:30</span>
                      <span>·</span>
                      <span className="text-pink-400">Drop Peak: 02:30</span>
                    </p>
                  </div>
                </div>

                <div className="font-mono-tech text-sm text-right shrink-0">
                  <span className="text-cyan-400 font-bold">{formatTime(currentTime)}</span>
                  <span className="text-slate-500"> / {formatTime(totalDuration)}</span>
                </div>
              </div>

              {/* Progress timeline with chorus markers */}
              <div className="space-y-1">
                <div className="relative w-full h-2.5 bg-white/10 rounded-full overflow-hidden cursor-pointer">
                  {/* Elapsed fill */}
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full transition-all duration-300"
                    style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                  />

                  {/* Marker 1 (00:45 = 20%) */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-yellow-400/80 rounded"
                    style={{ left: '20%' }}
                    title="Chorus Peak 1 (00:45)"
                  />
                  {/* Marker 2 (01:30 = 40%) */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-yellow-400/80 rounded"
                    style={{ left: '40%' }}
                    title="Chorus Peak 2 (01:30)"
                  />
                  {/* Marker 3 (02:30 = 66.6%) */}
                  <div
                    className="absolute top-0 bottom-0 w-1.5 bg-pink-500 rounded shadow-[0_0_8px_#ff007a]"
                    style={{ left: '66.6%' }}
                    title="Drop Peak (02:30)"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono-tech text-slate-500 px-1">
                  <span>INTRO</span>
                  <span>CHORUS 1</span>
                  <span>CHORUS 2</span>
                  <span className="text-pink-400">DROP</span>
                  <span>OUTRO</span>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL B: CAMERA CONTROLS */}
          <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono-tech uppercase tracking-wider text-slate-300 font-bold">
                PANEL B: CAMERA PERSPECTIVES
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setCameraAngle('main')}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono-tech transition-all cursor-pointer border ${
                  cameraAngle === 'main'
                    ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_12px_rgba(0,242,254,0.4)]'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                [ Main Stage ]
              </button>
              <button
                onClick={() => setCameraAngle('bias')}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono-tech transition-all cursor-pointer border ${
                  cameraAngle === 'bias'
                    ? 'bg-pink-500 text-white border-pink-400 shadow-[0_0_12px_rgba(255,0,122,0.4)]'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                [ Bias Focus ]
              </button>
              <button
                onClick={() => setCameraAngle('dance')}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono-tech transition-all cursor-pointer border ${
                  cameraAngle === 'dance'
                    ? 'bg-purple-500 text-white border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                [ Dance Cam ]
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono-tech transition-all cursor-pointer border ${
                  isFullscreen
                    ? 'bg-white text-black border-white'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                [ Fullscreen Mode ]
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Panel C (Watch Party) + Panel D (Rhythm System) */}
        {!isFullscreen && (
          <div className="lg:col-span-4 space-y-6">
            {/* PANEL C: THE WATCH PARTY ROOM */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono-tech uppercase tracking-wider text-slate-300 font-bold">
                    PANEL C: WATCH PARTY
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono-tech text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Sync: 0 ms (Locked)</span>
                </div>
              </div>

              {/* Room Metadata */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-mono-tech text-slate-400">ROOM ID</p>
                  <p className="text-sm font-bold font-mono-tech text-amber-300">#TAVY-STARLIGHT</p>
                </div>
                <button
                  onClick={copyRoomLink}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono-tech text-white flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              {/* Connected Friends Roster */}
              <div className="space-y-2.5">
                <p className="text-xs font-mono-tech text-slate-400 uppercase">
                  Connected Watching ({INITIAL_MEMBERS.length})
                </p>
                {INITIAL_MEMBERS.map(m => (
                  <div
                    key={m.id}
                    className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-black"
                        style={{ backgroundColor: m.avatarColor }}
                      >
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{m.name}</p>
                        <p className="text-[11px] text-slate-400">{m.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-mono-tech text-cyan-400">{m.energy}% Energy</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cheer Action Bar */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-mono-tech text-slate-400 uppercase">Live Stage Cheers</p>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handleAddCheer('heart', '❤️', '#ff007a')}
                    className="py-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 flex flex-col items-center gap-1 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-current text-pink-400" />
                    <span className="text-[10px] font-mono-tech font-bold">Heart</span>
                  </button>

                  <button
                    onClick={() => handleAddCheer('stick', '⚡', '#00f2fe')}
                    className="py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex flex-col items-center gap-1 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-current text-cyan-400" />
                    <span className="text-[10px] font-mono-tech font-bold">Stick</span>
                  </button>

                  <button
                    onClick={() => handleAddCheer('spark', '✨', '#fbbf24')}
                    className="py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 flex flex-col items-center gap-1 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 fill-current text-amber-400" />
                    <span className="text-[10px] font-mono-tech font-bold">Spark</span>
                  </button>

                  <button
                    onClick={() => handleAddCheer('confetti', '🎉', '#a855f7')}
                    className="py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 flex flex-col items-center gap-1 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Flame className="w-4 h-4 fill-current text-purple-400" />
                    <span className="text-[10px] font-mono-tech font-bold">Confetti</span>
                  </button>
                </div>
              </div>
            </div>

            {/* PANEL D: INTERACTIVE RHYTHM SYSTEM */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-cyan-500/30 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono-tech uppercase tracking-wider text-white font-bold">
                    PANEL D: INTERACTIVE RHYTHM
                  </span>
                </div>
                <span className="text-[11px] font-mono-tech px-2.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                  TAVYPLAY
                </span>
              </div>

              {/* Cue Notification Banner */}
              <div className="p-3 rounded-2xl bg-cyan-950/50 border border-cyan-400/40 text-center">
                <p className="text-[11px] font-mono-tech text-cyan-300/80 uppercase">RHYTHM SEQUENCE CUE</p>
                <p className="text-sm font-bold font-mono-tech text-white mt-0.5 tracking-wide animate-pulse">
                  &ldquo;{cuePrompt}&rdquo;
                </p>
              </div>

              {/* Big High-Contrast Touch Target */}
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={handleTapOnBeat}
                className="w-full h-28 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 hover:brightness-110 active:brightness-95 text-black font-heading font-black text-xl md:text-2xl tracking-wider uppercase shadow-[0_0_30px_rgba(0,242,254,0.5)] transition-all flex flex-col items-center justify-center gap-1 cursor-pointer border-0"
              >
                <span>[ TAP ON BEAT ]</span>
                <span className="text-xs font-mono-tech font-bold tracking-normal text-slate-900">
                  Click / Space to Hit Sub-Bass
                </span>
              </motion.button>

              {/* Telemetry Displays */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <p className="text-[10px] font-mono-tech text-slate-400 uppercase">SCORE</p>
                  <p className="text-lg font-bold font-mono-tech text-white">{score.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <p className="text-[10px] font-mono-tech text-slate-400 uppercase">COMBO STREAK</p>
                  <p className="text-lg font-bold font-mono-tech text-cyan-400">x{combo}</p>
                </div>
              </div>

              {/* Community Energy Meter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-tech">
                  <span className="text-slate-300">Community Energy</span>
                  <span className="font-bold text-pink-400">{energy}% / 100%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${energy}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-400">
                  <span>Base Crowd Sync</span>
                  <span className="text-amber-300 font-bold">Encore Unlocks at 100%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
