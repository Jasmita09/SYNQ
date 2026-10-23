import type { Track } from "../types/performance";
import { gratefulTrack } from "./grateful/track";

/**
 * The At-home Concert performance: NEFFEX – "Grateful" (CC BY 3.0), served from public/media.
 * BASE_URL keeps the path correct under the GitHub Pages /Tavy/ base. The video's currentTime
 * drives every cue, lyric and beat; without it the timeline falls back to a mock clock.
 */
export const activePerformance: Track = {
  ...gratefulTrack,
  media: { src: `${import.meta.env.BASE_URL}media/grateful.webm`, type: "video/webm" },
};

export const PERFORMANCE_CREDIT = "“Grateful” by NEFFEX, licensed under CC BY 3.0";
