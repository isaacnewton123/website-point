"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";

const NAV_LINKS = [
  { label: "Beranda", href: "#beranda" },
  { label: "Tentang", href: "#tentang" },
  { label: "Galeri", href: "#galeri" },
  { label: "Musik", href: "#musik" },
  { label: "Anniversary", href: "#anniversary" },
  { label: "Kontak", href: "#kontak" },
];

function MobileMenu(props: {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
}) {
  return (
    <>
      <div className={`mobile-overlay${props.isOpen ? " open" : ""}`} onClick={props.onClose} />
      <div className={`mobile-menu${props.isOpen ? " open" : ""}`}>
        <button onClick={props.onClose}
          style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>
          <FiX size={22} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
          <Image src="/logo-dark.png" alt="POINT" width={32} height={32} style={{ objectFit: "contain" }} />
          <span style={{ fontWeight: 800, color: "#fff", letterSpacing: "0.08em" }}>POINT</span>
        </div>
        {NAV_LINKS.map((l) => (
          <button key={l.href} onClick={() => props.onNavigate(l.href)} className="mobile-link">{l.label}</button>
        ))}
        <button onClick={() => props.onNavigate("#kontak")} className="btn btn-primary"
          style={{ marginTop: "1rem", width: "100%", justifyContent: "center" }}>
          Gabung Sekarang
        </button>
      </div>
    </>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setIsOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="container" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => scrollTo("#beranda")} id="nav-logo"
            style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "none", border: "none", cursor: "pointer" }}>
            <Image src="/logo-dark.png" alt="POINT" width={38} height={38} style={{ objectFit: "contain" }} />
            <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#fff", letterSpacing: "0.08em" }}>POINT</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }} className="desktop-nav">
            {NAV_LINKS.map((l) => (
              <button key={l.href} id={`nav-${l.label.toLowerCase()}`}
                onClick={() => scrollTo(l.href)} className="nav-link">{l.label}</button>
            ))}
            <button id="nav-gabung" onClick={() => scrollTo("#kontak")} className="btn btn-primary"
              style={{ padding: "0.5rem 1.25rem", fontSize: "0.88rem" }}>
              Gabung Sekarang
            </button>
          </div>

          <button id="nav-mobile-toggle" onClick={() => setIsOpen(!isOpen)}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#fff", padding: "0.25rem" }}
            className="mobile-toggle" aria-label="Toggle menu">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} onNavigate={scrollTo} />

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
}
