"use client";

import { useState } from "react";
import Image from "next/image";
import { FiX, FiChevronLeft, FiChevronRight, FiCamera } from "react-icons/fi";

const ITEMS = [
  { id: 1, src: "https://picsum.photos/seed/point1/800/600", caption: "Kegiatan Rutin POINT" },
  { id: 2, src: "https://picsum.photos/seed/point2/800/600", caption: "Kopdar Bulanan Karawang" },
  { id: 3, src: "https://picsum.photos/seed/point3/800/600", caption: "Bakti Sosial Anggota" },
  { id: 4, src: "https://picsum.photos/seed/point4/800/600", caption: "Kumpul Bareng Driver" },
  { id: 5, src: "https://picsum.photos/seed/point5/800/600", caption: "Aksi Solidaritas POINT" },
  { id: 6, src: "https://picsum.photos/seed/point6/800/600", caption: "Pertemuan Anggota" },
  { id: 7, src: "https://picsum.photos/seed/point7/800/600", caption: "Kebersamaan Komunitas" },
  { id: 8, src: "https://picsum.photos/seed/point8/800/600", caption: "Saling Berbagi Rezeki" },
  { id: 9, src: "https://picsum.photos/seed/point9/800/600", caption: "Touring Bersama POINT" },
];

export default function GallerySection() {
  const [lb, setLb] = useState<number | null>(null);
  const prev = () => setLb((i) => (i !== null ? (i - 1 + ITEMS.length) % ITEMS.length : null));
  const next = () => setLb((i) => (i !== null ? (i + 1) % ITEMS.length : null));

  return (
    <section id="galeri" className="section" style={{ background: "var(--surface)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span className="badge">Galeri Foto</span>
          <h2 className="section-title" style={{ textAlign: "center" }}>
            Momen <span style={{ color: "var(--orange)" }}>Kebersamaan</span>
          </h2>
          <p className="section-sub" style={{ textAlign: "center", margin: "0 auto" }}>
            Dokumentasi kegiatan dan kopdar komunitas POINT Karawang. Klik foto untuk melihat lebih besar.
          </p>
        </div>

        {/* uses .grid-gallery class — 3 col → 2 col → 1 col */}
        <div className="grid-gallery">
          {ITEMS.map((item, idx) => (
            <button key={item.id} id={`gallery-item-${item.id}`}
              onClick={() => setLb(idx)} className="gallery-item"
              style={{ border: "none", padding: 0, cursor: "pointer" }}>
              <Image src={item.src} alt={item.caption} fill
                sizes="(max-width:480px) 100vw,(max-width:768px) 50vw,33vw"
                style={{ objectFit: "cover" }} />
              <div className="gallery-overlay">
                <span style={{ color: "#fff", fontSize: "0.82rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <FiCamera size={13} style={{ color: "var(--orange)" }} />
                  {item.caption}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lb !== null && (
        <div className="lightbox" onClick={() => setLb(null)}>
          <div style={{ position: "relative", maxWidth: 860, width: "100%" }} onClick={(e) => e.stopPropagation()}>
            <button id="lightbox-close" onClick={() => setLb(null)} style={{
              position: "absolute", top: -44, right: 0, background: "rgba(255,255,255,0.1)",
              border: "none", borderRadius: 8, padding: "0.4rem", color: "#fff", cursor: "pointer", display: "flex"
            }}>
              <FiX size={22} />
            </button>
            <div style={{ position: "relative", aspectRatio: "4/3", borderRadius: 16, overflow: "hidden", background: "#0a0a0a" }}>
              <Image src={ITEMS[lb].src} alt={ITEMS[lb].caption} fill style={{ objectFit: "contain" }} sizes="100vw" />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem", color: "#fff" }}>
              <button id="lightbox-prev" onClick={prev} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "0.6rem", color: "#fff", cursor: "pointer", display: "flex" }}>
                <FiChevronLeft size={20} />
              </button>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{ITEMS[lb].caption}</p>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem" }}>{lb + 1} / {ITEMS.length}</p>
              </div>
              <button id="lightbox-next" onClick={next} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "0.6rem", color: "#fff", cursor: "pointer", display: "flex" }}>
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
