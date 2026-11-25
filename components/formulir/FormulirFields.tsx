"use client";

import { FaWhatsapp } from "react-icons/fa";
import { FiCheckCircle, FiRefreshCw } from "react-icons/fi";

export type FormKey = "nomor" | "nama_lengkap" | "tanggal_lahir" | "alamat" | "plat" | "tipe_warna_unit";
export type FormValues = Record<FormKey, string>;

export type SubmitResponse = {
  ok: boolean;
  nomor?: string;
  nama_lengkap?: string;
  status?: string;
  sudahDisetujui?: boolean;
  error?: string;
  errors?: Record<string, string>;
};

export const FORM_FIELDS: {
  key: FormKey;
  label: string;
  placeholder: string;
  type: "tel" | "text" | "date" | "textarea";
}[] = [
  { key: "nomor", label: "Nomor WhatsApp Aktif", placeholder: "Contoh: 081234567890", type: "tel" },
  { key: "nama_lengkap", label: "Nama Lengkap", placeholder: "Contoh: Dedi Rusdiyanto", type: "text" },
  { key: "tanggal_lahir", label: "Tanggal Lahir", placeholder: "", type: "date" },
  { key: "alamat", label: "Alamat Lengkap", placeholder: "Contoh: Perum CKM Blok FL 07, Majalaya, Karawang", type: "textarea" },
  { key: "plat", label: "Nomor Plat Kendaraan", placeholder: "Contoh: T 1590 BE", type: "text" },
  { key: "tipe_warna_unit", label: "Tipe & Warna Kendaraan", placeholder: "Contoh: Honda Brio Putih", type: "text" },
];

export function ProgressCard({ terisi }: { terisi: number }) {
  const lengkap = terisi === FORM_FIELDS.length;
  return (
    <div style={{
      background: "var(--bg)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)", padding: "1rem 1.15rem", marginBottom: "1.35rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.55rem", fontSize: "0.85rem" }}>
        <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>
          {lengkap ? "Semua kolom sudah terisi, siap dikirim!" : `Lengkapi ${FORM_FIELDS.length - terisi} kolom lagi`}
        </span>
        <span style={{ fontWeight: 700, color: lengkap ? "#16a34a" : "var(--orange)" }}>
          {terisi}/{FORM_FIELDS.length}
        </span>
      </div>
      <div style={{ height: 8, background: "var(--border)", borderRadius: 9999, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${(terisi / FORM_FIELDS.length) * 100}%`,
          background: lengkap ? "#16a34a" : "var(--orange)", transition: "width 0.35s ease",
        }} />
      </div>
    </div>
  );
}

export function FormField(props: {
  fieldKey: FormKey;
  label: string;
  placeholder: string;
  type: "tel" | "text" | "date" | "textarea";
  value: string;
  error?: string;
  onChange: (v: string) => void;
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
          {terisi ? "Siap" : "Wajib"}
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

export function SuccessCard(props: {
  nama: string;
  nomor: string;
  sudahDisetujui: boolean;
  onReset: () => void;
}) {
  const pesanWa = encodeURIComponent(
    `Halo admin POINT, saya ${props.nama} (${props.nomor}) sudah mengisi formulir pendaftaran anggota.`,
  );
  return (
    <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
      <div style={{
        width: 58, height: 58, borderRadius: 16, margin: "0 auto 1rem",
        background: "rgba(22,163,74,0.12)", color: "#16a34a",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <FiCheckCircle size={28} />
      </div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.55rem" }}>
        {props.sudahDisetujui ? "Kamu Sudah Terdaftar Resmi!" : "Pendaftaran Diterima!"}
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.65, marginBottom: "1.5rem" }}>
        {props.sudahDisetujui
          ? `Nomor ${props.nomor} (${props.nama}) sudah disetujui dan terdaftar di database anggota POINT.`
          : `Terima kasih ${props.nama}. Data pendaftaran untuk ${props.nomor} sudah masuk antrean dan akan otomatis aktif begitu kamu masuk grup WhatsApp POINT.`}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        <a href={`https://wa.me/6283117772744?text=${pesanWa}`} target="_blank" rel="noopener noreferrer"
          className="btn" style={{ background: "#22c55e", color: "#fff", width: "100%", justifyContent: "center", gap: "0.5rem" }}>
          <FaWhatsapp size={18} /> Konfirmasi ke Admin WhatsApp
        </a>
        <button type="button" onClick={props.onReset} className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
          <FiRefreshCw size={15} /> Isi Pendaftaran Lain
        </button>
      </div>
    </div>
  );
}
