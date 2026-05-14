"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2, FiVolumeX, FiRepeat, FiShuffle } from "react-icons/fi";

const TRACKS = [
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

function fmt(s: number) {
  if (!isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}

// ─── Turntable config — ubah nilai di sini untuk mengatur manual ──────────────
const DISC = {
  containerSize: 190,   // ukuran kotak turntable (px)
  size: 148,            // diameter piringan (px)
};
const ARM = {
  pivotTop: 8,       // posisi titik pivot dari atas (px)
  pivotRight: 6,       // posisi titik pivot dari kanan (px)
  pivotSize: 14,      // ukuran titik pivot (px)
  top: 15,      // posisi lengan dari atas (px)  ← sama dengan pivotTop+pivotSize/2
  right: 13,      // posisi lengan dari kanan (px) ← sama dengan pivotRight+pivotSize/2
  height: 90,      // PANJANG lengan (px) ← ubah ini untuk atur panjang
  bodyHeight: 80,      // panjang batang lengan (px) ← biasanya height-10
  anglePlaying: 28,    // sudut ketika memutar (negatif = kiri)
  angleLifted: -28,    // sudut ketika berhenti (lebih negatif = lebih terangkat)
};
// ─────────────────────────────────────────────────────────────────────────────


export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  const track = TRACKS[idx];
  const pct = duration ? (progress / duration) * 100 : 0;

  const play = useCallback(() => { audioRef.current?.play(); setPlaying(true); }, []);
  const pause = useCallback(() => { audioRef.current?.pause(); setPlaying(false); }, []);
  const togglePlay = () => (playing ? pause() : play());

  const next = useCallback(() => {
    const ni = shuffle ? Math.floor(Math.random() * TRACKS.length) : (idx + 1) % TRACKS.length;
    setIdx(ni); setPlaying(true);
  }, [shuffle, idx]);

  const prev = () => { setIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length); setPlaying(true); };

  useEffect(() => {
    if (audioRef.current) { audioRef.current.volume = volume; audioRef.current.muted = muted; }
  }, [volume, muted]);

  useEffect(() => {
    audioRef.current?.load();
    if (playing) audioRef.current?.play().catch(() => { });
  }, [idx]); // eslint-disable-line

  const onTime = () => {
    const a = audioRef.current;
    if (a) { setProgress(a.currentTime); setDuration(a.duration || 0); }
  };

  const iconBtnStyle = (active?: boolean): React.CSSProperties => ({
    background: "none", border: "none", cursor: "pointer", padding: "0.35rem",
    color: active ? "var(--orange)" : "rgba(255,255,255,0.45)",
    display: "flex", alignItems: "center", transition: "color 0.2s",
  });

  const ctrlBtnStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10,
    padding: "0.6rem", color: "#fff", cursor: "pointer",
    display: "flex", alignItems: "center", transition: "background 0.2s",
  };

  return (
    <section id="musik" style={{
      padding: "5rem 0",
      background: "linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 100%)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 400, height: 400, background: "rgba(249,115,22,0.08)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 320, height: 320, background: "rgba(99,102,241,0.08)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="badge" style={{ background: "rgba(249,115,22,0.15)", color: "var(--orange)", border: "1px solid rgba(249,115,22,0.3)" }}>
            Musik Komunitas
          </span>
          <h2 className="section-title" style={{ color: "#fff", textAlign: "center" }}>
            Lagu Anthem <span style={{ color: "var(--orange)" }}>POINT</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", textAlign: "center", maxWidth: "36rem", margin: "0 auto" }}>
            Koleksi lagu kebanggaan komunitas POINT Karawang.
          </p>
        </div>

        {/* grid-player: 2fr 3fr on desktop → 1col on mobile */}
        <div className="grid-player">
          {/* Player card */}
          <div className="player-sticky" style={{
            background: "rgba(255,255,255,0.07)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.12)", borderRadius: 24, padding: "2rem",
            position: "sticky", top: 88,
          }}>
            {/* Turntable: disc + tonearm */}
            <div style={{ position: "relative", width: DISC.containerSize, height: DISC.containerSize, margin: "0 auto 1.75rem" }}>

              {/* Vinyl disc — spins when playing */}
              <div className={playing ? "disc-spin" : ""}
                style={{
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

              {/* Pivot dot */}
              <div style={{
                position: "absolute", top: ARM.pivotTop, right: ARM.pivotRight,
                width: ARM.pivotSize, height: ARM.pivotSize, borderRadius: "50%",
                background: "rgba(255,255,255,0.3)",
                border: "2px solid rgba(255,255,255,0.5)",
                zIndex: 10,
              }} />

              {/* Tonearm lengan — atur nilai ARM di atas untuk tuning manual */}
              <div
                className={playing ? "arm-playing" : "arm-lifted"}
                style={{
                  position: "absolute", top: ARM.top, right: ARM.right,
                  width: 4, height: ARM.height,
                  transformOrigin: "top center",
                  zIndex: 9,
                }}>
                {/* Batang lengan */}
                <div style={{
                  position: "absolute", top: 0, left: "50%",
                  transform: "translateX(-50%)",
                  width: 2.5, height: ARM.bodyHeight,
                  background: "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.25))",
                  borderRadius: 2,
                }} />
                {/* Jarum / needle tip */}
                <div style={{
                  position: "absolute", bottom: 0, left: "50%",
                  width: 5, height: 5, borderRadius: "50%",
                  background: "var(--orange)",
                  transform: "translateX(-50%)",
                  boxShadow: "0 0 6px rgba(249,115,22,0.9)",
                }} />
              </div>
            </div>

            <style>{`
              @keyframes disc-rotate {
                from { transform: rotate(0deg); }
                to   { transform: rotate(360deg); }
              }
              .disc-spin { animation: disc-rotate 6s linear infinite; }
              .arm-lifted  { transform: rotate(${ARM.angleLifted}deg);  transition: transform 0.7s cubic-bezier(0.4,0,0.2,1); }
              .arm-playing { transform: rotate(${ARM.anglePlaying}deg); transition: transform 0.7s cubic-bezier(0.4,0,0.2,1); }
            `}</style>

            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: "1.05rem" }}>{track.title}</p>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", marginTop: "0.2rem" }}>{track.version} • POINT</p>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: "1rem" }}>
              <input id="music-progress" type="range" min={0} max={duration || 100} value={progress}
                onChange={(e) => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value); setProgress(Number(e.target.value)); }}
                className="progress-bar"
                style={{ background: `linear-gradient(to right, var(--orange) ${pct}%, rgba(255,255,255,0.15) ${pct}%)` }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", marginTop: "0.3rem" }}>
                <span>{fmt(progress)}</span><span>{fmt(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <button id="music-shuffle" style={iconBtnStyle(shuffle)} onClick={() => setShuffle(!shuffle)}><FiShuffle size={16} /></button>
              <button id="music-prev" style={ctrlBtnStyle} onClick={prev}><FiSkipBack size={18} /></button>
              <button id="music-play-pause" onClick={togglePlay} style={{
                background: "var(--orange)", border: "none", borderRadius: "50%",
                width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", cursor: "pointer", boxShadow: "0 4px 16px rgba(249,115,22,0.4)", flexShrink: 0,
              }}>
                {playing ? <FiPause size={22} /> : <FiPlay size={22} />}
              </button>
              <button id="music-next" style={ctrlBtnStyle} onClick={next}><FiSkipForward size={18} /></button>
              <button id="music-repeat" style={iconBtnStyle(repeat)} onClick={() => setRepeat(!repeat)}><FiRepeat size={16} /></button>
            </div>

            {/* Volume */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <button id="music-mute" style={iconBtnStyle()} onClick={() => setMuted(!muted)}>
                {muted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
              </button>
              <input id="music-volume" type="range" min={0} max={1} step={0.01}
                value={muted ? 0 : volume}
                onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }}
                className="progress-bar"
                style={{ flex: 1, background: `linear-gradient(to right, var(--orange) ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.15) ${(muted ? 0 : volume) * 100}%)` }}
              />
            </div>

            <audio ref={audioRef} src={track.file} onTimeUpdate={onTime} onLoadedMetadata={onTime}
              onEnded={() => repeat ? audioRef.current?.play() : next()} />
          </div>

          {/* Track list */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ padding: "1.1rem 1.4rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <p style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>Daftar Lagu ({TRACKS.length} lagu)</p>
            </div>
            <div style={{ maxHeight: 500, overflowY: "auto" }}>
              {TRACKS.map((t, i) => (
                <button key={t.id} id={`track-${t.id}`}
                  onClick={() => { setIdx(i); setPlaying(true); }}
                  className={`track-row${idx === i ? " active" : ""}`}
                  style={{ width: "100%", border: "none", background: "none", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: 28, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {idx === i && playing ? (
                      <span style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 18 }}>
                        {[0, 1, 2, 3, 4].map((b) => (
                          <span key={b} className="wave-bar" style={{ animationDelay: `${b * 0.06}s` }} />
                        ))}
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.78rem", color: idx === i ? "var(--orange)" : "var(--text-muted)" }}>{i + 1}</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: "0.88rem", color: idx === i ? "var(--orange)" : "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</p>
                    <p style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.4)", marginTop: "0.1rem" }}>{t.version}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
