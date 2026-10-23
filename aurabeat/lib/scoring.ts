import type { Track } from "../types/performance";
import { beatLength, beatPosition } from "./beat";

export type WaveGrade = "Perfect" | "Great" | "Good";

export interface WaveScore {
  grade: WaveGrade;
  points: number;
  /** Distance from the nearest beat in ms: negative = early, positive = late. */
  offsetMs: number;
}

/**
 * Scores an accepted wave (or tap) by how close it lands to a beat of the track's beat grid, read
 * from the same media clock as everything else. 1.0 accuracy is exactly on a beat, 0 is halfway
 * between beats. At Grateful's 75 BPM, Perfect is within ±100 ms and Great within ±240 ms.
 */
export function scoreWave(track: Track, time: number): WaveScore {
  const { phase } = beatPosition(track, time);
  const late = phase < 0.5;
  const fromBeat = late ? phase : 1 - phase; // fraction of a beat away from the nearest beat
  const accuracy = 1 - 2 * fromBeat;
  const offsetMs = Math.round(fromBeat * beatLength(track) * 1000) * (late ? 1 : -1);
  const grade: WaveGrade = accuracy >= 0.75 ? "Perfect" : accuracy >= 0.4 ? "Great" : "Good";
  return { grade, points: 100 + Math.round(accuracy * 200), offsetMs };
}
