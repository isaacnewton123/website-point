"use client";

import Image from "next/image";
import { FiArrowRight, FiMessageCircle } from "react-icons/fi";

export default function HeroSection() {
  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="beranda" className="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      {/* Subtle dot grid */}
      <div className="hero-dot-grid" />

      {/* Soft vignette only — no orange glows */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.25) 100%)",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", paddingTop: "6rem", paddingBottom: "5rem",
        }}>
          {/* Top label */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.45rem",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 9999, padding: "0.35rem 1rem", marginBottom: "2rem",
            color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", fontWeight: 500,
            letterSpacing: "0.04em",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.5)", display: "inline-block" }} />
            Komunitas Driver Online Karawang
          </div>

          {/* Logo */}
          <div className="animate-float" style={{ marginBottom: "1.75rem" }}>
            <Image src="/logo-dark.png" alt="POINT Logo" width={90} height={90}
              style={{ objectFit: "contain" }} priority />
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 800, color: "#fff",
            lineHeight: 1.1, margin: "0 0 0.5rem",
            fontSize: "clamp(2.2rem, 7vw, 3.8rem)", letterSpacing: "-0.02em",
          }}>
            POINT
          </h1>
          <p style={{
            fontFamily: "var(--font-display)", fontWeight: 700, margin: "0 0 1.25rem",
            fontSize: "clamp(1rem, 3.5vw, 1.65rem)", color: "rgba(255,255,255,0.85)",
          }}>
            Solidaritas Tanpa Batas
          </p>

          {/* Sub */}
          <p style={{
            color: "rgba(255,255,255,0.45)", fontSize: "clamp(0.82rem, 2vw, 0.92rem)",
            maxWidth: "26rem", lineHeight: 1.65, marginBottom: "2.5rem",
          }}>
            Paguyuban Online Lintas Timur &mdash; Karawang, Jawa Barat
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button id="hero-tentang-btn" onClick={() => scrollTo("#tentang")}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "var(--orange)", color: "#fff",
                border: "none", borderRadius: 10, cursor: "pointer",
                padding: "0.75rem 1.6rem", fontSize: "0.88rem", fontWeight: 700,
                fontFamily: "var(--font-sans)", transition: "all 0.2s ease",
              }}>
              Tentang Kami <FiArrowRight size={15} />
            </button>

            <a id="hero-gabung-btn"
              href="https://wa.me/6281234567890?text=Saya%20ingin%20bergabung%20POINT"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "transparent", color: "rgba(255,255,255,0.85)",
                border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 10,
                padding: "0.75rem 1.6rem", fontSize: "0.88rem", fontWeight: 600,
                fontFamily: "var(--font-sans)", textDecoration: "none",
                transition: "all 0.2s ease",
              }}>
              <FiMessageCircle size={15} /> Gabung Sekarang
            </a>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }}>
          <path d="M0 30 C480 60 960 0 1440 30 L1440 60 L0 60 Z" fill="var(--bg)" />
        </svg>
      </div>
    </section>
  );
}
