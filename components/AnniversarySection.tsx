import Image from "next/image";

const YEARS = [
  { year: "2019", title: "Berdirinya POINT", desc: "POINT resmi dibentuk sebagai wadah driver online Karawang.", src: "https://picsum.photos/seed/ann2019/600/400" },
  { year: "2020", title: "Anniversary Perdana", desc: "Perayaan ulang tahun pertama di tengah semangat kebersamaan.", src: "https://picsum.photos/seed/ann2020/600/400" },
  { year: "2021", title: "Anggota Semakin Bertumbuh", desc: "POINT terus berkembang dengan bergabungnya ratusan anggota baru.", src: "https://picsum.photos/seed/ann2021/600/400" },
  { year: "2022", title: "Bakti Sosial Perdana", desc: "Aksi solidaritas pertama dengan bakti sosial untuk warga Karawang.", src: "https://picsum.photos/seed/ann2022/600/400" },
  { year: "2023", title: "Kopdar Akbar", desc: "Pertemuan akbar terbesar sepanjang sejarah POINT digelar meriah.", src: "https://picsum.photos/seed/ann2023/600/400" },
  { year: "2024", title: "Anniversary Ke-5", desc: "Lima tahun berjalan, POINT semakin solid dan berdampak luas.", src: "https://picsum.photos/seed/ann2024/600/400" },
];

export default function AnniversarySection() {
  return (
    <section id="anniversary" className="section" style={{ background: "var(--bg)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span className="badge">Anniversary</span>
          <h2 className="section-title" style={{ textAlign: "center" }}>
            Perjalanan <span style={{ color: "var(--orange)" }}>POINT</span>
          </h2>
          <p className="section-sub" style={{ textAlign: "center", margin: "0 auto" }}>
            Dari awal berdiri hingga kini, setiap tahun adalah cerita indah solidaritas tanpa batas.
          </p>
        </div>

        {/* Video */}
        <div style={{ marginBottom: "3rem", borderRadius: 20, overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
          <div style={{
            padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.6rem",
            background: "linear-gradient(to right, var(--navy-dark), var(--navy))",
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#ef4444","#f59e0b","#22c55e"].map((c) => (
                <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", fontWeight: 500 }}>
              Video Anniversary POINT 2025
            </span>
          </div>
          <div style={{ position: "relative", paddingTop: "56.25%" }}>
            <iframe id="anniversary-video"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"
              title="Video Anniversary POINT 2025"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>

        {/* grid-3: 3 col → 1 col mobile */}
        <div className="grid-3">
          {YEARS.map((y) => (
            <div key={y.year} className="card" style={{ overflow: "hidden", padding: 0 }}>
              <div style={{ position: "relative", height: 175, overflow: "hidden" }}>
                <Image src={y.src} alt={y.title} fill
                  sizes="(max-width:768px) 100vw,33vw"
                  style={{ objectFit: "cover" }} />
                <div style={{
                  position: "absolute", top: 12, left: 12, background: "var(--orange)",
                  color: "#fff", padding: "0.2rem 0.75rem", borderRadius: 9999,
                  fontSize: "0.78rem", fontWeight: 700,
                }}>
                  {y.year}
                </div>
              </div>
              <div style={{ padding: "1.1rem 1.25rem" }}>
                <h3 style={{ fontWeight: 700, fontSize: "0.93rem", color: "var(--text-primary)", marginBottom: "0.35rem" }}>
                  {y.title}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.65 }}>{y.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
