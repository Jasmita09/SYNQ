import { emitLiveEvent, setMockBackend } from "./liveBridge";

/**
 * Stand-in for AuraBeat's venue audio backend, which TΛVY doesn't have. It plays a scripted 120 BPM
 * show through the same liveBridge events the backend would send, so the lightstick, cue words and
 * haptics run the real code path. The connection is marked "mock" so the UI labels it simulated.
 *
 * One loop is 16 bars: verse (bars 0–3), BUILD (4–7), CHORUS (8–11), DROP (12–15).
 */
const BPM = 120;
const BARS_PER_LOOP = 16;
const SECTION_CUES: Record<number, "build" | "chorus" | "drop"> = { 4: "build", 8: "chorus", 12: "drop" };

export function startSimulatedVenue(): () => void {
  setMockBackend(true);
  let beat = 0;

  const tick = () => {
    const bar = Math.floor(beat / 4) % BARS_PER_LOOP;
    const downbeat = beat % 4 === 0;
    const section = downbeat ? SECTION_CUES[bar] : undefined;
    // Verse stays calm (lighting-only beats); from the build on, beats are felt as well as seen.
    emitLiveEvent({
      type: "cue",
      cue: downbeat ? "bass" : "beat",
      strength: downbeat ? 1 : 0.6,
      haptic: bar >= 4,
    });
    // Section cues go after the beat, so the word on screen is BUILD / CHORUS / DROP rather than BASS.
    if (section) emitLiveEvent({ type: "cue", cue: section });
    else if (downbeat && bar === 0) emitLiveEvent({ type: "lightstick", mode: "calm" }); // loop back to the verse
    beat++;
  };

  tick();
  const id = window.setInterval(tick, 60000 / BPM);
  return () => {
    window.clearInterval(id);
    setMockBackend(false);
  };
}
