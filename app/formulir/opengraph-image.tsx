import { ImageResponse } from "next/og";

export const alt = "Formulir Anggota Resmi POINT Karawang";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function FormulirOpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e2a5e 60%, #16224a 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#f97316",
            color: "#ffffff",
            fontSize: 22,
            fontWeight: 700,
            padding: "10px 24px",
            borderRadius: 9999,
            alignSelf: "flex-start",
          }}
        >
          FORMULIR RESMI ANGGOTA
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.12, maxWidth: 960 }}>
            Pendaftaran & Pembaruan Data Anggota POINT
          </div>
          <div style={{ fontSize: 28, color: "#cbd5e1", lineHeight: 1.4, maxWidth: 920 }}>
            Paguyuban Online Lintas Timur Karawang — anggota aktif grup WA langsung terdata otomatis.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#fb923c" }}>
          <span>point-karawang.netlify.app/formulir</span>
          <span>Solidaritas Tanpa Batas</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
