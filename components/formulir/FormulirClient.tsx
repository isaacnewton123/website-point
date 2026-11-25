"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiCheck, FiRefreshCw } from "react-icons/fi";
import {
  FIELDS,
  LookupCard,
  ProfileField,
  ProgressCard,
  type FormApiResponse,
  type KolomKey,
  type ProfilData,
} from "./FormulirFields";

const EMPTY_PROFIL: ProfilData = {
  nama_lengkap: "", tanggal_lahir: "", alamat: "", plat: "", tipe_warna_unit: "",
};

async function fetchFormulir(query: string): Promise<{ ok: boolean; data: FormApiResponse }> {
  const res = await fetch(`/api/formulir?${query}`);
  const data = (await res.json()) as FormApiResponse;
  return { ok: res.ok && data.ok, data };
}

async function postFormulir(payload: Record<string, string>): Promise<{ ok: boolean; data: FormApiResponse }> {
  const res = await fetch("/api/formulir", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as FormApiResponse;
  return { ok: res.ok && data.ok, data };
}

function useTokenLoader(
  token: string,
  onSuccess: (data: FormApiResponse) => void,
  onError: (msg: string) => void,
  onDone: () => void,
) {
  useEffect(() => {
    if (!token) return;
    let aktif = true;
    fetchFormulir(`t=${encodeURIComponent(token)}`)
      .then(({ ok, data }) => {
        if (!aktif) return;
        if (!ok) onError(data.error || "Tautan tidak valid atau kedaluwarsa.");
        else onSuccess(data);
      })
      .catch(() => { if (aktif) onError("Gagal memuat data formulir."); })
      .finally(() => { if (aktif) onDone(); });
    return () => { aktif = false; };
  }, [token, onSuccess, onError, onDone]);
}

function buildPayload(token: string, activeNomor: string, profil: ProfilData): Record<string, string> {
  const payload: Record<string, string> = token ? { token } : { nomor: activeNomor };
  for (const f of FIELDS) {
    const v = profil[f.key].trim();
    if (v) payload[f.key] = v;
  }
  return payload;
}

function useFormulirState(token: string) {
  const [nomorInput, setNomorInput] = useState("");
  const [activeNomor, setActiveNomor] = useState("");
  const [profil, setProfil] = useState<ProfilData>(EMPTY_PROFIL);
  const [loading, setLoading] = useState(Boolean(token));
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ msg: string; ok: boolean } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useTokenLoader(
    token,
    useCallback((data: FormApiResponse) => { setActiveNomor(data.nomor ?? ""); setProfil(data.profil ?? EMPTY_PROFIL); }, []),
    useCallback((msg: string) => setAlert({ msg, ok: false }), []),
    useCallback(() => setLoading(false), []),
  );

  async function cekNomor(e: React.FormEvent) {
    e.preventDefault();
    if (!nomorInput.trim()) { setAlert({ msg: "Masukkan nomor WhatsApp dulu ya.", ok: false }); return; }
    setAlert(null); setLoading(true);
    try {
      const { ok, data } = await fetchFormulir(`nomor=${encodeURIComponent(nomorInput.trim())}`);
      if (!ok) { setAlert({ msg: data.error || "Format nomor WhatsApp tidak valid.", ok: false }); return; }
      setActiveNomor(data.nomor ?? ""); setProfil(data.profil ?? EMPTY_PROFIL);
    } catch { setAlert({ msg: "Gagal menghubungi server.", ok: false }); }
    finally { setLoading(false); }
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    setAlert(null); setErrors({}); setSaving(true);
    try {
      const { ok, data } = await postFormulir(buildPayload(token, activeNomor, profil));
      if (!ok) {
        if (data.errors) setErrors(data.errors);
        setAlert({ msg: data.error || "Periksa kembali isian yang masih belum valid.", ok: false });
        return;
      }
      setProfil(data.profil ?? profil);
      setAlert({ msg: data.status === "LENGKAP" ? "Terima kasih! Data kamu sudah lengkap dan tersimpan." : "Data berhasil disimpan. Sisa kolom bisa dilengkapi kapan saja.", ok: true });
    } catch { setAlert({ msg: "Gagal menyimpan data ke server.", ok: false }); }
    finally { setSaving(false); }
  }

  return {
    nomorInput, setNomorInput, activeNomor, profil, loading, saving, alert, errors, cekNomor, simpan,
    updateField: (k: KolomKey, v: string) => setProfil((prev) => ({ ...prev, [k]: v })),
    resetNomor: () => { setActiveNomor(""); setAlert(null); setErrors({}); },
  };
}

function ProfileFormCard(props: {
  activeNomor: string; profil: ProfilData; errors: Record<string, string>;
  saving: boolean; showReset: boolean;
  onFieldChange: (k: KolomKey, v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}) {
  const terisi = FIELDS.filter((f) => Boolean(props.profil[f.key].trim())).length;
  return (
    <form onSubmit={props.onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }} noValidate>
      <ProgressCard terisi={terisi} />
      <div className="form-group">
        <label className="form-label" htmlFor="nomor-aktif">Nomor WhatsApp</label>
        <input id="nomor-aktif" type="text" className="form-input" value={props.activeNomor} readOnly
          style={{ background: "var(--bg)", color: "var(--text-muted)", fontWeight: 600 }} />
      </div>
      {FIELDS.map((f) => (
        <ProfileField key={f.key} fieldKey={f.key} label={f.label} placeholder={f.placeholder}
          type={f.type} value={props.profil[f.key]} error={props.errors[f.key]}
          onChange={(v) => props.onFieldChange(f.key, v)} />
      ))}
      <button type="submit" disabled={props.saving} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "0.4rem" }}>
        {props.saving ? "Menyimpan..." : <><FiCheck size={17} /> Simpan Data</>}
      </button>
      {props.showReset && (
        <button type="button" onClick={props.onReset} className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
          <FiRefreshCw size={15} /> Ganti Nomor WA
        </button>
      )}
    </form>
  );
}

export default function FormulirClient() {
  const sp = useSearchParams();
  const token = sp.get("t") ?? "";
  const st = useFormulirState(token);

  return (
    <section style={{ padding: "0 0 5rem", marginTop: "-2.75rem", position: "relative", zIndex: 2 }}>
      <div className="container" style={{ maxWidth: 620 }}>
        <div className="card" style={{ padding: "2rem 1.75rem", boxShadow: "var(--shadow-lg)" }}>
          {st.alert && (
            <div style={{
              padding: "0.85rem 1rem", borderRadius: "var(--radius)", marginBottom: "1.25rem",
              fontSize: "0.88rem", lineHeight: 1.5, fontWeight: 500,
              background: st.alert.ok ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)",
              border: `1px solid ${st.alert.ok ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.3)"}`,
              color: st.alert.ok ? "#15803d" : "#b91c1c",
            }}>
              {st.alert.msg}
            </div>
          )}
          {st.loading && !st.activeNomor ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem 0" }}>Memuat data anggota...</p>
          ) : !st.activeNomor ? (
            <LookupCard nomor={st.nomorInput} loading={st.loading} onChange={st.setNomorInput} onSubmit={st.cekNomor} />
          ) : (
            <ProfileFormCard activeNomor={st.activeNomor} profil={st.profil} errors={st.errors}
              saving={st.saving} showReset={!token} onFieldChange={st.updateField}
              onSubmit={st.simpan} onReset={st.resetNomor} />
          )}
        </div>
      </div>
    </section>
  );
}
