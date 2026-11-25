import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

function FormulirTopBar() {
  return (
    <nav className="navbar scrolled">
      <div className="container" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
          <Image src="/logo-dark.png" alt="POINT" width={36} height={36} style={{ objectFit: "contain" }} />
          <span style={{ fontWeight: 800, fontSize: "1.08rem", color: "#fff", letterSpacing: "0.08em" }}>POINT</span>
        </Link>
        <Link href="/" className="btn btn-outline" style={{ padding: "0.45rem 1rem", fontSize: "0.84rem" }}>
          <FiArrowLeft size={15} /> Beranda
        </Link>
      </div>
    </nav>
  );
}

export default function FormulirHeader() {
  return (
    <>
      <FormulirTopBar />
      <section className="hero" style={{ minHeight: "auto", paddingTop: "6.5rem", paddingBottom: "5.25rem" }}>
        <div className="hero-dot-grid" />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 45%, rgba(0,0,0,0.22) 100%)",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <span className="badge" style={{ background: "rgba(249,115,22,0.16)", border: "1px solid rgba(249,115,22,0.32)" }}>
            Pendataan Anggota
          </span>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 800, color: "#fff",
            fontSize: "clamp(1.75rem, 5vw, 2.65rem)", lineHeight: 1.15, marginBottom: "0.75rem",
          }}>
            Formulir Data <span style={{ color: "var(--orange)" }}>POINT</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.68)", fontSize: "0.95rem", maxWidth: "34rem", margin: "0 auto", lineHeight: 1.65 }}>
            Lengkapi data diri dan kendaraan kamu agar pendataan Paguyuban Online Lintas Timur Karawang rapi dan terdata resmi.
          </p>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }}>
            <path d="M0 30 C480 60 960 0 1440 30 L1440 60 L0 60 Z" fill="var(--bg)" />
          </svg>
        </div>
      </section>
    </>
  );
}
