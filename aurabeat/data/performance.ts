import type { Track } from "../types/performance";
import { gratefulTrack } from "./grateful/track";

const mediaUrl = (file: string) => `${import.meta.env.BASE_URL}media/${file}`;

/**
 * The At-home Concert performance: NEFFEX – "Grateful" (CC BY 3.0), served from public/media.
 * BASE_URL keeps the paths correct under the GitHub Pages /Tavy/ base. MP4 (H.264/AAC) comes first
 * because every Safari/iOS version plays it; the original VP9/Opus WebM is the fallback for browsers
 * without H.264. Both share the same timeline (within ~7 ms), and the video's currentTime drives
 * every cue, lyric and beat; if neither plays, the timeline falls back to a mock clock.
 */
export const activePerformance: Track = {
  ...gratefulTrack,
  media: {
    src: mediaUrl("grateful.mp4"),
    type: "video/mp4",
    alternatives: [{ src: mediaUrl("grateful.webm"), type: "video/webm" }],
  },
};

export const PERFORMANCE_CREDIT = "“Grateful” by NEFFEX, licensed under CC BY 3.0";
