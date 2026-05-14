import Image from "next/image";
import { FaWhatsapp, FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const NAV = ["Beranda","Tentang","Galeri","Musik","Anniversary","Kontak"];
const SOCIAL = [
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: FaXTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaWhatsapp, href: "https://wa.me/6281234567890", label: "WhatsApp" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--navy-dark)", color: "#fff" }}>
      <div className="container" style={{ paddingTop: "3.5rem", paddingBottom: "1.5rem" }}>
        {/* grid-footer: 2fr 1fr 1fr → 1col mobile */}
        <div className="grid-footer">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "1rem" }}>
              <Image src="/logo-dark.png" alt="POINT" width={36} height={36} style={{ objectFit: "contain" }} />
              <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--orange)", letterSpacing: "0.08em" }}>POINT</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", lineHeight: 1.75, maxWidth: "22rem" }}>
              Paguyuban Online Lintas Timur – komunitas driver online yang bersatu dalam solidaritas tanpa batas di Karawang, Jawa Barat.
            </p>
          </div>

          <div>
            <p style={{ fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem", color: "rgba(255,255,255,0.6)" }}>
              Navigasi
            </p>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {NAV.map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="footer-link">{item}</a>
              ))}
            </nav>
          </div>

          <div>
            <p style={{ fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem", color: "rgba(255,255,255,0.6)" }}>
              Ikuti Kami
            </p>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="social-icon"
                  style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.6)", transition: "var(--transition)", textDecoration: "none" }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              Karawang, Jawa Barat
            </p>
          </div>
        </div>

        <div style={{ paddingTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem" }}>
            © 2025 POINT Community – Paguyuban Online Lintas Timur
          </p>
          <p style={{ color: "var(--orange)", fontSize: "0.85rem", fontStyle: "italic", fontWeight: 600 }}>
            &ldquo;Solidaritas Tanpa Batas&rdquo;
          </p>
        </div>
      </div>
      <style>{`.social-icon:hover { background: var(--orange) !important; color: #fff !important; }`}</style>
    </footer>
  );
}
