"use client";

import Image from "next/image";

export const TRACKS = [
  { id: 1, title: "Bendera POINT", version: "Versi 1", file: "/music/01 - Bendera POINT.mp3" },
  { id: 2, title: "Bendera POINT", version: "Versi 2", file: "/music/02 - Bendera POINT.mp3" },
  { id: 3, title: "Tanpa Batas Bersama", version: "Versi 1", file: "/music/03 - Tanpa Batas Bersama.mp3" },
  { id: 4, title: "Tanpa Batas Bersama", version: "Versi 2", file: "/music/04 - Tanpa Batas Bersama.mp3" },
  { id: 5, title: "POINT Bersatu", version: "Versi 1", file: "/music/05 - POINT Bersatu.mp3" },
  { id: 6, title: "POINT Bersatu", version: "Versi 2", file: "/music/06 - POINT Bersatu.mp3" },
  { id: 7, title: "Satu Keluarga POINT", version: "Versi 1", file: "/music/07 - Satu Keluarga POINT.mp3" },
  { id: 8, title: "Satu Keluarga POINT", version: "Versi 2", file: "/music/08 - Satu Keluarga POINT.mp3" },
  { id: 9, title: "Satu Jalan POINT", version: "Versi 1", file: "/music/09 - Satu Jalan POINT.mp3" },
  { id: 10, title: "Satu Jalan POINT", version: "Versi 2", file: "/music/10 - Satu Jalan POINT.mp3" },
  { id: 11, title: "Solidaritas Tanpa Batas", version: "Versi 1", file: "/music/11 - Solidaritas Tanpa Batas.mp3" },
  { id: 12, title: "Solidaritas Tanpa Batas", version: "Versi 2", file: "/music/12 - Solidaritas Tanpa Batas.mp3" },
  { id: 13, title: "Solidaritas Tanpa Batas", version: "Versi 3", file: "/music/13 - Solidaritas Tanpa Batas.mp3" },
  { id: 14, title: "Solidaritas Tanpa Batas", version: "Versi 4", file: "/music/14 - Solidaritas Tanpa Batas.mp3" },
  { id: 15, title: "Point Solid", version: "Versi 1", file: "/music/15 - Point Solid.mp3" },
  { id: 16, title: "Point Solid", version: "Versi 2", file: "/music/16 - Point Solid.mp3" },
];

export const DISC = { containerSize: 190, size: 148 };

export const ARM = {
  pivotTop: 8,
  pivotRight: 6,
  pivotSize: 14,
  top: 15,
  right: 13,
  height: 90,
  bodyHeight: 80,
  anglePlaying: 28,
  angleLifted: -28,
};

export function fmt(s: number) {
  if (!isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}

function Tonearm({ playing }: { playing: boolean }) {
  return (
    <>
      <div style={{
        position: "absolute", top: ARM.pivotTop, right: ARM.pivotRight,
        width: ARM.pivotSize, height: ARM.pivotSize, borderRadius: "50%",
        background: "rgba(255,255,255,0.3)",
        border: "2px solid rgba(255,255,255,0.5)", zIndex: 10,
      }} />
      <div className={playing ? "arm-playing" : "arm-lifted"} style={{
        position: "absolute", top: ARM.top, right: ARM.right,
        width: 4, height: ARM.height, transformOrigin: "top center", zIndex: 9,
      }}>
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 2.5, height: ARM.bodyHeight,
          background: "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.25))",
          borderRadius: 2,
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: "50%", width: 5, height: 5, borderRadius: "50%",
          background: "var(--orange)", transform: "translateX(-50%)",
          boxShadow: "0 0 6px rgba(249,115,22,0.9)",
        }} />
      </div>
    </>
  );
}

export function Turntable({ playing }: { playing: boolean }) {
  return (
    <div style={{ position: "relative", width: DISC.containerSize, height: DISC.containerSize, margin: "0 auto 1.75rem" }}>
      <div className={playing ? "disc-spin" : ""} style={{
        position: "absolute",
        top: `calc(50% - ${DISC.size / 2}px)`,
        left: `calc(50% - ${DISC.size / 2}px)`,
        width: DISC.size, height: DISC.size, borderRadius: "50%",
      }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "conic-gradient(rgba(249,115,22,0.9) 0deg, rgba(255,255,255,0.08) 60deg, rgba(249,115,22,0.5) 120deg, rgba(255,255,255,0.05) 180deg, rgba(249,115,22,0.9) 240deg, rgba(255,255,255,0.08) 300deg, rgba(249,115,22,0.9) 360deg)",
        }} />
        <div style={{
          position: "absolute", inset: 10, borderRadius: "50%",
          background: "radial-gradient(circle, #1e2040 0%, #141828 60%, #0f1220 100%)",
          boxShadow: "inset 0 0 0 8px rgba(255,255,255,0.03), inset 0 0 0 18px rgba(255,255,255,0.02)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Image src="/logo-dark.png" alt="POINT" width={56} height={56} style={{ objectFit: "contain" }} />
        </div>
      </div>
      <Tonearm playing={playing} />
    </div>
  );
}

export function TrackList(props: {
  tracks: typeof TRACKS;
  activeIdx: number;
  playing: boolean;
  onSelect: (index: number) => void;
}) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden" }}>
      <div style={{ padding: "1.1rem 1.4rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <p style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>Daftar Lagu ({props.tracks.length} lagu)</p>
      </div>
      <div style={{ maxHeight: 500, overflowY: "auto" }}>
        {props.tracks.map((t, i) => (
          <button key={t.id} id={`track-${t.id}`}
            onClick={() => props.onSelect(i)}
            className={`track-row${props.activeIdx === i ? " active" : ""}`}
            style={{ width: "100%", border: "none", background: "none", cursor: "pointer", textAlign: "left" }}>
            <div style={{ width: 28, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {props.activeIdx === i && props.playing ? (
                <span style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 18 }}>
                  {[0, 1, 2, 3, 4].map((b) => (
                    <span key={b} className="wave-bar" style={{ animationDelay: `${b * 0.06}s` }} />
                  ))}
                </span>
              ) : (
                <span style={{ fontSize: "0.78rem", color: props.activeIdx === i ? "var(--orange)" : "var(--text-muted)" }}>{i + 1}</span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: "0.88rem", color: props.activeIdx === i ? "var(--orange)" : "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</p>
              <p style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.4)", marginTop: "0.1rem" }}>{t.version}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
