import type { LiveConnection } from "../../live/liveBridge";
import type { WatchStatus } from "../../lib/watchBridge";

interface LiveStatusPanelProps {
  connection: LiveConnection;
  watch: WatchStatus;
}

type Level = "ok" | "wait" | "off";

const DOT: Record<Level, string> = {
  ok: "bg-aura shadow-[0_0_10px_2px] shadow-aura/60",
  wait: "bg-anticipate",
  off: "bg-white/25",
};

function Row({ label, level, value }: { label: string; level: Level; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-sm text-ink-muted">{label}</span>
      <span className="flex items-center gap-2 text-right text-sm font-semibold text-ink">
        <span aria-hidden="true" className={`size-2.5 rounded-full ${DOT[level]}`} />
        {value}
      </span>
    </div>
  );
}

/** Honest connection states: music feed and Halo — never claims a link it doesn't have. */
export default function LiveStatusPanel({ connection, watch }: LiveStatusPanelProps) {
  const simulated = connection.source === "mock";

  const music: [Level, string] =
    connection.backend !== "connected"
      ? ["off", "Not started"]
      : simulated
        ? ["ok", "Simulated show (120 BPM)"]
        : connection.audio === "listening"
          ? ["ok", "Listening"]
          : ["wait", "Waiting for audio"];

  const halo: [Level, string] = watch === "connected" ? ["ok", "Connected"] : ["off", "Not connected (demo)"];

  return (
    <section aria-label="Connection status" className="divide-y divide-white/10 rounded-3xl border border-white/10 bg-surface px-5 py-1">
      <Row label="Music cues" level={music[0]} value={music[1]} />
      <Row label="TΛVY Halo" level={halo[0]} value={halo[1]} />
      <p className="py-2.5 text-xs text-ink-muted">
        Demo only: cues come from a scripted show, not live venue audio. No Halo device is required.
      </p>
    </section>
  );
}
