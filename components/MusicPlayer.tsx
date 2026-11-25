"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2, FiVolumeX, FiRepeat, FiShuffle } from "react-icons/fi";
import { ARM, fmt, TRACKS, TrackList, Turntable } from "./music-parts";

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

function PlayerControls(props: {
  playing: boolean; shuffle: boolean; repeat: boolean;
  onToggleShuffle: () => void; onPrev: () => void; onTogglePlay: () => void;
  onNext: () => void; onToggleRepeat: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
      <button id="music-shuffle" style={iconBtnStyle(props.shuffle)} onClick={props.onToggleShuffle}><FiShuffle size={16} /></button>
      <button id="music-prev" style={ctrlBtnStyle} onClick={props.onPrev}><FiSkipBack size={18} /></button>
      <button id="music-play-pause" onClick={props.onTogglePlay} style={{
        background: "var(--orange)", border: "none", borderRadius: "50%",
        width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", cursor: "pointer", boxShadow: "0 4px 16px rgba(249,115,22,0.4)", flexShrink: 0,
      }}>
        {props.playing ? <FiPause size={22} /> : <FiPlay size={22} />}
      </button>
      <button id="music-next" style={ctrlBtnStyle} onClick={props.onNext}><FiSkipForward size={18} /></button>
      <button id="music-repeat" style={iconBtnStyle(props.repeat)} onClick={props.onToggleRepeat}><FiRepeat size={16} /></button>
    </div>
  );
}

function VolumeBar(props: {
  muted: boolean; volume: number;
  onToggleMute: () => void; onChangeVolume: (value: number) => void;
}) {
  const pct = (props.muted ? 0 : props.volume) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
      <button id="music-mute" style={iconBtnStyle()} onClick={props.onToggleMute}>
        {props.muted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
      </button>
      <input id="music-volume" type="range" min={0} max={1} step={0.01}
        value={props.muted ? 0 : props.volume}
        onChange={(e) => props.onChangeVolume(Number(e.target.value))}
        className="progress-bar"
        style={{ flex: 1, background: `linear-gradient(to right, var(--orange) ${pct}%, rgba(255,255,255,0.15) ${pct}%)` }}
      />
    </div>
  );
}

function PlayerHeader() {
  return (
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
  );
}

function ProgressRow(props: { progress: number; duration: number; onSeek: (t: number) => void }) {
  const pct = props.duration ? (props.progress / props.duration) * 100 : 0;
  return (
    <div style={{ marginBottom: "1rem" }}>
      <input id="music-progress" type="range" min={0} max={props.duration || 100} value={props.progress}
        onChange={(e) => props.onSeek(Number(e.target.value))}
        className="progress-bar"
        style={{ background: `linear-gradient(to right, var(--orange) ${pct}%, rgba(255,255,255,0.15) ${pct}%)` }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", marginTop: "0.3rem" }}>
        <span>{fmt(props.progress)}</span><span>{fmt(props.duration)}</span>
      </div>
    </div>
  );
}

function PlayerDeck(props: {
  track: (typeof TRACKS)[number]; playing: boolean; progress: number; duration: number;
  shuffle: boolean; repeat: boolean; muted: boolean; volume: number;
  onSeek: (t: number) => void; onToggleShuffle: () => void; onPrev: () => void;
  onTogglePlay: () => void; onNext: () => void; onToggleRepeat: () => void;
  onToggleMute: () => void; onChangeVolume: (v: number) => void;
}) {
  return (
    <div className="player-sticky" style={{
      background: "rgba(255,255,255,0.07)", backdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.12)", borderRadius: 24, padding: "2rem",
      position: "sticky", top: 88,
    }}>
      <Turntable playing={props.playing} />
      <style>{`
        @keyframes disc-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .disc-spin { animation: disc-rotate 6s linear infinite; }
        .arm-lifted { transform: rotate(${ARM.angleLifted}deg); transition: transform 0.7s cubic-bezier(0.4,0,0.2,1); }
        .arm-playing { transform: rotate(${ARM.anglePlaying}deg); transition: transform 0.7s cubic-bezier(0.4,0,0.2,1); }
      `}</style>
      <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
        <p style={{ color: "#fff", fontWeight: 700, fontSize: "1.05rem" }}>{props.track.title}</p>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", marginTop: "0.2rem" }}>{props.track.version} • POINT</p>
      </div>
      <ProgressRow progress={props.progress} duration={props.duration} onSeek={props.onSeek} />
      <PlayerControls playing={props.playing} shuffle={props.shuffle} repeat={props.repeat}
        onToggleShuffle={props.onToggleShuffle} onPrev={props.onPrev} onTogglePlay={props.onTogglePlay}
        onNext={props.onNext} onToggleRepeat={props.onToggleRepeat} />
      <VolumeBar muted={props.muted} volume={props.volume} onToggleMute={props.onToggleMute} onChangeVolume={props.onChangeVolume} />
    </div>
  );
}

function useAudioPlayer(audioRef: React.RefObject<HTMLAudioElement | null>) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const playingRef = useRef(playing);

  const togglePlay = () => {
    if (playing) audioRef.current?.pause();
    else audioRef.current?.play();
    setPlaying(!playing);
  };
  const next = useCallback(() => {
    setIdx(shuffle ? Math.floor(Math.random() * TRACKS.length) : (idx + 1) % TRACKS.length);
    setPlaying(true);
  }, [shuffle, idx]);
  const seek = (t: number) => {
    if (audioRef.current) audioRef.current.currentTime = t;
    setProgress(t);
  };
  const onTime = () => {
    const a = audioRef.current;
    if (a) { setProgress(a.currentTime); setDuration(a.duration || 0); }
  };

  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => {
    if (audioRef.current) { audioRef.current.volume = volume; audioRef.current.muted = muted; }
  }, [audioRef, volume, muted]);
  useEffect(() => {
    audioRef.current?.load();
    if (playingRef.current) audioRef.current?.play().catch(() => {});
  }, [audioRef, idx]);

  return {
    idx, playing, progress, duration, volume, muted, repeat, shuffle,
    togglePlay, next, seek, onTime,
    prev: () => { setIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length); setPlaying(true); },
    selectTrack: (i: number) => { setIdx(i); setPlaying(true); },
    toggleShuffle: () => setShuffle((s) => !s),
    toggleRepeat: () => setRepeat((r) => !r),
    toggleMute: () => setMuted((m) => !m),
    changeVolume: (v: number) => { setVolume(v); setMuted(false); },
    onEnded: () => (repeat ? audioRef.current?.play() : next()),
  };
}

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const player = useAudioPlayer(audioRef);
  const track = TRACKS[player.idx];

  return (
    <section id="musik" style={{
      padding: "5rem 0", position: "relative", overflow: "hidden",
      background: "linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 100%)",
    }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 400, height: 400, background: "rgba(249,115,22,0.08)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 320, height: 320, background: "rgba(99,102,241,0.08)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <PlayerHeader />
        <div className="grid-player">
          <div>
            <PlayerDeck track={track} playing={player.playing} progress={player.progress} duration={player.duration}
              shuffle={player.shuffle} repeat={player.repeat} muted={player.muted} volume={player.volume}
              onSeek={player.seek} onToggleShuffle={player.toggleShuffle} onPrev={player.prev}
              onTogglePlay={player.togglePlay} onNext={player.next} onToggleRepeat={player.toggleRepeat}
              onToggleMute={player.toggleMute} onChangeVolume={player.changeVolume} />
            <audio ref={audioRef} src={track.file} onTimeUpdate={player.onTime} onLoadedMetadata={player.onTime} onEnded={player.onEnded} />
          </div>
          <TrackList tracks={TRACKS} activeIdx={player.idx} playing={player.playing} onSelect={player.selectTrack} />
        </div>
      </div>
    </section>
  );
}
