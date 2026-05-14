"use client";

import { FiMapPin } from "react-icons/fi";
import { FaWhatsapp, FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const SOCIALS = [
  { icon: FaInstagram, label: "Instagram", handle: "@point.karawang", href: "https://instagram.com", color: "#e1306c" },
  { icon: FaFacebookF, label: "Facebook", handle: "POINT Karawang", href: "https://facebook.com", color: "#1877f2" },
  { icon: FaXTwitter, label: "Twitter / X", handle: "@pointkarawang", href: "https://twitter.com", color: "#000000" },
];

export default function ContactSection() {
  return (
    <section id="kontak" className="section" style={{ background: "var(--surface)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="badge">Kontak & Bergabung</span>
          <h2 className="section-title" style={{ textAlign: "center" }}>
            Bergabung Bersama <span style={{ color: "var(--orange)" }}>POINT</span>
          </h2>
          <p className="section-sub" style={{ textAlign: "center", margin: "0 auto" }}>
            Ingin bergabung atau punya pertanyaan? Terbuka untuk semua driver online di Karawang.
          </p>
        </div>

        {/* grid-contact: 2 col → 1 col mobile */}
        <div className="grid-contact">
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className="card" style={{ padding: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(34,197,94,0.3)", flexShrink: 0 }}>
                  <FaWhatsapp size={22} color="#fff" />
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: "var(--text-primary)" }}>WhatsApp</p>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Hubungi admin langsung</p>
                </div>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                Klik tombol di bawah untuk terhubung dengan admin POINT via WhatsApp.
              </p>
              <a id="contact-whatsapp"
                href="https://wa.me/6281234567890?text=Halo%20admin%20POINT%2C%20saya%20ingin%20bergabung."
                target="_blank" rel="noopener noreferrer"
                className="btn" style={{ background: "#22c55e", color: "#fff", width: "100%", justifyContent: "center", textDecoration: "none", gap: "0.5rem" }}>
                <FaWhatsapp size={18} /> Gabung via WhatsApp
              </a>
            </div>

            <div className="card" style={{ padding: "1.75rem", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--orange)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(249,115,22,0.3)" }}>
                <FiMapPin size={22} color="#fff" />
              </div>
              <address style={{ fontStyle: "normal" }}>
                <p style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.25rem" }}>POINT – Paguyuban Online Lintas Timur</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Karawang, Jawa Barat, Indonesia</p>
              </address>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className="card" style={{ padding: "1.75rem" }}>
              <p style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.35rem" }}>Media Sosial</p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.83rem", marginBottom: "1.25rem" }}>Ikuti kami untuk update terkini komunitas POINT.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {SOCIALS.map(({ icon: Icon, label, handle, href, color }) => (
                  <a key={label} id={`contact-${label.toLowerCase()}`} href={href}
                    target="_blank" rel="noopener noreferrer"
                    className="social-link"
                    style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.85rem 1rem", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", textDecoration: "none", transition: "var(--transition)" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={16} color="#fff" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text-primary)" }}>{handle}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{label}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, var(--navy-dark), var(--navy))", borderRadius: "var(--radius-lg)", padding: "1.75rem", color: "#fff" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", marginBottom: "0.6rem" }}>
                Solidaritas Tanpa Batas
              </h3>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                Bergabunglah dengan ratusan driver online Karawang yang telah merasakan manfaat kebersamaan dalam komunitas POINT.
              </p>
              <a id="contact-join-now" href="https://wa.me/6281234567890?text=Saya%20ingin%20bergabung%20POINT"
                target="_blank" rel="noopener noreferrer"
                className="btn btn-primary" style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}>
                Daftar Sekarang
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`.social-link:hover { border-color: var(--orange) !important; background: rgba(249,115,22,0.04); }`}</style>
    </section>
  );
}
