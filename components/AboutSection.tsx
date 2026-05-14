"use client";

import { FiHeart, FiShield, FiGift } from "react-icons/fi";

const VALUES = [
  { icon: FiHeart, title: "Kekeluargaan", desc: "Kami saling mengenal, mendukung, dan menjaga satu sama lain layaknya keluarga besar yang hangat.", color: "#ef4444" },
  { icon: FiShield, title: "Keselamatan", desc: "Keselamatan anggota di jalan adalah prioritas utama. Kami saling mengingatkan dan berbagi info aman berkendara.", color: "#3b82f6" },
  { icon: FiGift, title: "Berbagi Rezeki", desc: "Saling berbagi informasi order, tips, dan peluang agar setiap anggota bisa meraih rezeki lebih baik bersama.", color: "var(--orange)" },
];

const STATS = [
  { num: "2019", label: "Tahun Berdiri" },
  { num: "500+", label: "Anggota Aktif" },
  { num: "6+", label: "Platform" },
  { num: "5+", label: "Tahun Bersama" },
];

export default function AboutSection() {
  return (
    <section id="tentang" className="section" style={{ background: "var(--bg)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="badge">Tentang Kami</span>
          <h2 className="section-title" style={{ textAlign: "center" }}>
            Siapa Itu <span style={{ color: "var(--orange)" }}>POINT</span>?
          </h2>
          <p className="section-sub" style={{ textAlign: "center", margin: "0 auto" }}>
            POINT berdiri sebagai wadah driver online di Karawang. Kami dari berbagai platform —
            Grab, Gojek, Lalamove, InDriver, Maxim — bersatu dalam{" "}
            <strong style={{ color: "var(--orange)" }}>solidaritas tanpa batas</strong>.
            Saling membantu, berbagi info, dan merayakan kebersamaan setiap tahun.
          </p>
        </div>

        {/* Stats — uses CSS grid-stats class (responsive via globals.css) */}
        <div className="grid-stats">
          {STATS.map((s) => (
            <div key={s.label} className="card" style={{ textAlign: "center", padding: "1.5rem 1rem" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--orange)", marginBottom: "0.25rem" }}>{s.num}</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Values — uses CSS grid-3 class */}
        <div className="grid-3">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="card" style={{ padding: "1.75rem" }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 14, background: v.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "1.1rem", boxShadow: `0 4px 12px ${v.color}40`
                }}>
                  <Icon size={22} color="#fff" />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem", color: "var(--text-primary)" }}>{v.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.86rem", lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
