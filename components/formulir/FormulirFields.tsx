"use client";

import { FiArrowRight, FiCheckCircle, FiPhone } from "react-icons/fi";

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
          {lengkap ? "Semua data wajib sudah lengkap!" : `Masih ada ${FIELDS.length - terisi} data yang perlu diisi`}
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

export function LookupCard(props: {
  nomor: string;
  loading: boolean;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={props.onSubmit}>
      <div className="form-group" style={{ marginBottom: "1.15rem" }}>
        <label className="form-label" htmlFor="lookup-nomor">Nomor WhatsApp Terdaftar</label>
        <div style={{ position: "relative" }}>
          <FiPhone size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input id="lookup-nomor" type="tel" className="form-input" style={{ paddingLeft: "2.45rem" }}
            placeholder="Contoh: 081234567890" value={props.nomor} onChange={(e) => props.onChange(e.target.value)} />
        </div>
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          Masukkan nomor WA yang aktif di grup POINT Karawang.
        </span>
      </div>
      <button type="submit" disabled={props.loading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
        {props.loading ? "Memeriksa..." : <>Cek Data Saya <FiArrowRight size={16} /></>}
      </button>
    </form>
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
