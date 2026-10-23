import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import type { LightstickMode } from "../../live/liveBridge";
import type { LightTone, LiveFlash } from "../../live/useLiveSession";

interface LiveLightstickViewProps {
  mode: LightstickMode;
  tone: LightTone;
  flash: LiveFlash | null;
  reducedMotion: boolean;
  /** Small status line shown at the top (watch / backend). */
  status: ReactNode;
  /** Optional music cue shown in the centre. */
  cue?: ReactNode;
  /** Leave the full-screen lightstick; the session keeps running. */
  onExit: () => void;
  /** End the session: stops haptics and the lightstick immediately. */
  onStop: () => void;
}

const COLORS: Record<LightTone, { base: string; glow: string }> = {
  aura: { base: "251,191,36", glow: "#fbbf24" },
  amber: { base: "196,181,253", glow: "#c4b5fd" },
  gold: { base: "255,214,140", glow: "#ffd68c" },
};

/**
 * The phone as a lightstick: the whole screen is the light. Calm breathes softly, pulse hits on cues,
 * celebrate glows gold. Flashes are rate-limited upstream (≤3/s) and never full-white; under Reduce
 * Motion there are no flashes at all, only steady colour.
 */
export default function LiveLightstickView({ mode, tone, flash, reducedMotion, status, cue, onExit, onStop }: LiveLightstickViewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { base, glow } = COLORS[tone];
  const level = mode === "calm" ? 0.32 : mode === "pulse" ? 0.5 : 0.7;
  const exitRef = useRef<HTMLButtonElement>(null);
  const onExitRef = useRef(onExit);
  onExitRef.current = onExit;

  // Keyboard: focus starts on Exit (once, on open), and Escape leaves the lightstick (the session keeps running).
  useEffect(() => {
    exitRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExitRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Keep the screen awake and, where the browser allows, go truly full screen.
  useEffect(() => {
    const root = rootRef.current;
    let lock: { release: () => Promise<void> } | null = null;
    const wakeLock = (navigator as Navigator & { wakeLock?: { request: (type: "screen") => Promise<{ release: () => Promise<void> }> } }).wakeLock;
    wakeLock
      ?.request("screen")
      .then((l) => (lock = l))
      .catch(() => {});
    if (root && document.fullscreenEnabled && !document.fullscreenElement) {
      void root.requestFullscreen().catch(() => {});
    }
    // The browser uses the first Escape to leave full screen and never passes it on, so leaving
    // full screen is treated as leaving the lightstick.
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) onExitRef.current();
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      void lock?.release().catch(() => {});
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    };
  }, []);

  return (
    <div ref={rootRef} role="dialog" aria-modal="true" aria-label="Lightstick" className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#05070a]">
      {/* The light itself */}
      <div aria-hidden="true" className="absolute inset-0">
        <div
          className={`absolute inset-0 transition-[background-color,opacity] duration-700 ${mode === "calm" && !reducedMotion ? "animate-live-breathe" : ""}`}
          style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(${base},${level}), rgba(${base},${level * 0.35}) 60%, rgba(5,7,10,1) 100%)` }}
        />
        {mode === "celebrate" && (
          <div className="absolute -inset-1/2 opacity-60">
            <div
              className={`absolute inset-0 ${reducedMotion ? "" : "animate-live-spin"}`}
              style={{ background: "conic-gradient(from 0deg, rgba(255,214,140,0.5), rgba(251,191,36,0.35), rgba(255,122,133,0.3), rgba(255,214,140,0.5))" }}
            />
          </div>
        )}
        {flash && !reducedMotion && mode !== "calm" && (
          <div
            key={flash.id}
            className="absolute inset-0 animate-live-flash"
            style={{ background: `radial-gradient(circle at 50% 45%, ${glow}, rgba(${base},0.4) 55%, transparent 85%)`, "--peak": 0.25 + 0.4 * flash.strength } as CSSProperties}
          />
        )}
      </div>

      <div className="relative flex items-center justify-between gap-3 p-4 text-xs font-semibold text-ink/80">
        <span className="font-display tracking-[0.3em]">TΛVY · SIMULATED</span>
        <span className="truncate">{status}</span>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-6">{cue}</div>

      <div className="relative grid grid-cols-2 gap-3 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          ref={exitRef}
          type="button"
          onClick={onExit}
          className="min-h-14 rounded-2xl border border-white/25 bg-black/40 text-base font-semibold text-ink backdrop-blur-sm"
        >
          Exit lightstick
        </button>
        <button type="button" onClick={onStop} className="min-h-14 rounded-2xl bg-alert text-base font-bold text-stage">
          Stop
        </button>
      </div>
    </div>
  );
}
