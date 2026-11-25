"use client";

import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import {
  FORM_FIELDS,
  FormField,
  ProgressCard,
  SuccessCard,
  type FormKey,
  type FormValues,
  type SubmitResponse,
} from "./FormulirFields";

const EMPTY_VALUES: FormValues = {
  nomor: "", nama_lengkap: "", tanggal_lahir: "", alamat: "", plat: "", tipe_warna_unit: "",
};

async function postPendaftaran(payload: Record<string, string>): Promise<{ ok: boolean; data: SubmitResponse }> {
  const res = await fetch("/api/formulir", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as SubmitResponse;
  return { ok: res.ok && data.ok, data };
}

function usePendaftaranState() {
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [website, setWebsite] = useState("");
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sukses, setSukses] = useState<{ nama: string; nomor: string; sudahDisetujui: boolean } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setAlert(null);
    setErrors({});
    setSaving(true);
    try {
      const { ok, data } = await postPendaftaran({ ...values, website });
      if (!ok) {
        if (data.errors) setErrors(data.errors);
        setAlert(data.error || "Periksa kembali isian yang masih belum valid.");
        return;
      }
      setSukses({
        nama: data.nama_lengkap ?? values.nama_lengkap,
        nomor: data.nomor ?? values.nomor,
        sudahDisetujui: Boolean(data.sudahDisetujui),
      });
    } catch {
      setAlert("Gagal mengirim pendaftaran ke server.");
    } finally {
      setSaving(false);
    }
  }

  return {
    values, website, setWebsite, saving, alert, errors, sukses, submit,
    updateField: (k: FormKey, v: string) => setValues((prev) => ({ ...prev, [k]: v })),
    reset: () => { setValues(EMPTY_VALUES); setErrors({}); setAlert(null); setSukses(null); },
  };
}

function RegistrationForm(props: {
  values: FormValues;
  website: string;
  errors: Record<string, string>;
  saving: boolean;
  onFieldChange: (k: FormKey, v: string) => void;
  onWebsiteChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const terisi = FORM_FIELDS.filter((f) => Boolean(props.values[f.key].trim())).length;
  return (
    <form onSubmit={props.onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }} noValidate>
      <ProgressCard terisi={terisi} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
        value={props.website} onChange={(e) => props.onWebsiteChange(e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
      {FORM_FIELDS.map((f) => (
        <FormField key={f.key} fieldKey={f.key} label={f.label} placeholder={f.placeholder}
          type={f.type} value={props.values[f.key]} error={props.errors[f.key]}
          onChange={(v) => props.onFieldChange(f.key, v)} />
      ))}
      <button type="submit" disabled={props.saving} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "0.4rem" }}>
        {props.saving ? "Mengirim..." : <><FiCheck size={17} /> Daftar Anggota POINT</>}
      </button>
    </form>
  );
}

export default function FormulirClient() {
  const st = usePendaftaranState();

  return (
    <section style={{ padding: "0 0 5rem", marginTop: "-2.75rem", position: "relative", zIndex: 2 }}>
      <div className="container" style={{ maxWidth: 620 }}>
        <div className="card" style={{ padding: "2rem 1.75rem", boxShadow: "var(--shadow-lg)" }}>
          {st.alert && (
            <div style={{
              padding: "0.85rem 1rem", borderRadius: "var(--radius)", marginBottom: "1.25rem",
              fontSize: "0.88rem", lineHeight: 1.5, fontWeight: 500,
              background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "#b91c1c",
            }}>
              {st.alert}
            </div>
          )}
          {st.sukses ? (
            <SuccessCard nama={st.sukses.nama} nomor={st.sukses.nomor}
              sudahDisetujui={st.sukses.sudahDisetujui} onReset={st.reset} />
          ) : (
            <RegistrationForm values={st.values} website={st.website} errors={st.errors}
              saving={st.saving} onFieldChange={st.updateField}
              onWebsiteChange={st.setWebsite} onSubmit={st.submit} />
          )}
        </div>
      </div>
    </section>
  );
}
