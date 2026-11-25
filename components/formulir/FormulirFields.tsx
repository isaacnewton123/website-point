"use client";

import { FaWhatsapp } from "react-icons/fa";
import { FiCheckCircle, FiLock } from "react-icons/fi";

export type KolomKey = "nama_lengkap" | "tanggal_lahir" | "alamat" | "plat" | "tipe_warna_unit";
export type ProfilData = Record<KolomKey, string>;

export type FormApiResponse = {
  ok: boolean;
  ditemukan?: boolean;
  nomor?: string;
  status?: string;
  kekurangan?: KolomKey[];
  profil?: ProfilData;
  error?: string;
  errors?: Record<string, string>;
};

export const FIELDS: { key: KolomKey; label: string; placeholder: string; type: "text" | "date" | "textarea" }[] = [
  { key: "nama_lengkap", label: "Nama Lengkap", placeholder: "Contoh: Dedi Rusdiyanto", type: "text" },
  { key: "tanggal_lahir", label: "Tanggal Lahir", placeholder: "", type: "date" },
  { key: "alamat", label: "Alamat Lengkap", placeholder: "Contoh: Perum CKM Blok FL 07, Majalaya, Karawang", type: "textarea" },
  { key: "plat", label: "Nomor Plat Kendaraan", placeholder: "Contoh: T 1590 BE", type: "text" },
  { key: "tipe_warna_unit", label: "Tipe & Warna Kendaraan", placeholder: "Contoh: Honda Brio Putih", type: "text" },
];

export function ProgressCard({ terisi }: { terisi: number }) {
  const lengkap = terisi === FIELDS.length;
  return (
    <div style={{
      background: "var(--bg)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)", padding: "1rem 1.15rem", marginBottom: "1.35rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.55rem", fontSize: "0.85rem" }}>
        <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>
          {lengkap ? "Semua data pendaftaran sudah lengkap!" : `Masih ada ${FIELDS.length - terisi} data yang perlu diisi`}
        </span>
        <span style={{ fontWeight: 700, color: lengkap ? "#16a34a" : "var(--orange)" }}>
          {terisi}/{FIELDS.length}
        </span>
      </div>
      <div style={{ height: 8, background: "var(--border)", borderRadius: 9999, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${(terisi / FIELDS.length) * 100}%`,
          background: lengkap ? "#16a34a" : "var(--orange)", transition: "width 0.35s ease",
        }} />
      </div>
    </div>
  );
}

export function RestrictedNoticeCard({ error }: { error?: string }) {
  return (
    <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16, margin: "0 auto 1rem",
        background: "rgba(249,115,22,0.12)", color: "var(--orange)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <FiLock size={24} />
      </div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Tautan Undangan Diperlukan
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.65, marginBottom: "1.5rem" }}>
        {error || "Untuk menjaga keamanan database anggota, formulir pendaftaran hanya bisa dibuka melalui tautan undangan khusus yang dibagikan saat kamu bergabung ke grup WhatsApp POINT."}
      </p>
      <a href="https://wa.me/6283117772744?text=Halo%20admin%20POINT%2C%20saya%20ingin%20bergabung."
        target="_blank" rel="noopener noreferrer"
        className="btn" style={{ background: "#22c55e", color: "#fff", width: "100%", justifyContent: "center", gap: "0.5rem" }}>
        <FaWhatsapp size={18} /> Hubungi Admin via WhatsApp
      </a>
    </div>
  );
}

export function ProfileField(props: {
  fieldKey: KolomKey; label: string; placeholder: string; type: "text" | "date" | "textarea";
  value: string; error?: string; onChange: (v: string) => void;
}) {
  const terisi = Boolean(props.value.trim());
  const badgeStyle: React.CSSProperties = terisi
    ? { background: "rgba(22,163,74,0.12)", color: "#15803d" }
    : { background: "rgba(249,115,22,0.12)", color: "var(--orange-hover)" };

  return (
    <div className="form-group">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label className="form-label" htmlFor={props.fieldKey}>{props.label}</label>
        <span style={{ ...badgeStyle, fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 9999, display: "inline-flex", alignItems: "center", gap: 4 }}>
          {terisi && <FiCheckCircle size={11} />}
          {terisi ? "Terisi" : "Belum diisi"}
        </span>
      </div>
      {props.type === "textarea" ? (
        <textarea id={props.fieldKey} className="form-input" rows={3} placeholder={props.placeholder}
          value={props.value} onChange={(e) => props.onChange(e.target.value)} />
      ) : (
        <input id={props.fieldKey} type={props.type} className="form-input" placeholder={props.placeholder}
          style={props.fieldKey === "plat" ? { textTransform: "uppercase" } : undefined}
          value={props.value} onChange={(e) => props.onChange(e.target.value)} />
      )}
      {props.error && <span style={{ fontSize: "0.78rem", color: "#dc2626" }}>{props.error}</span>}
    </div>
  );
}
