import { NextResponse, type NextRequest } from "next/server";
import {
  KOLOM_WAJIB,
  LABEL_KOLOM,
  normalisasiNomor,
  validasiKolom,
  type KolomWajib,
} from "@/lib/formulir-validasi";
import { simpanPendaftar } from "@/lib/neon";

export const dynamic = "force-dynamic";

type BodyPayload = Partial<Record<"nomor" | "website" | KolomWajib, unknown>>;

function validasiPayload(body: BodyPayload) {
  const errors: Record<string, string> = {};
  const rawNomor = typeof body.nomor === "string" ? body.nomor : "";
  const nomor = normalisasiNomor(rawNomor);
  if (!nomor) {
    errors.nomor = rawNomor.trim()
      ? "Format nomor WhatsApp tidak valid (contoh: 081234567890)."
      : "Nomor WhatsApp wajib diisi.";
  }

  const isian: Partial<Record<KolomWajib, string>> = {};
  for (const kolom of KOLOM_WAJIB) {
    const raw = typeof body[kolom] === "string" ? body[kolom].trim() : "";
    if (!raw) {
      errors[kolom] = `${LABEL_KOLOM[kolom]} wajib diisi.`;
      continue;
    }
    const bersih = validasiKolom(kolom, raw);
    if (bersih) isian[kolom] = bersih;
    else errors[kolom] = `${LABEL_KOLOM[kolom]} belum valid.`;
  }

  return { nomor, isian: isian as Record<KolomWajib, string>, errors };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as BodyPayload;
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({
        ok: true,
        status: "menunggu",
        sudahDisetujui: false,
        langsungAktif: false,
      });
    }

    const { nomor, isian, errors } = validasiPayload(body);
    if (!nomor || Object.keys(errors).length > 0) {
      return NextResponse.json(
        { ok: false, error: "Periksa kembali semua isian yang wajib dilengkapi.", errors },
        { status: 422 },
      );
    }

    const hasil = await simpanPendaftar({ nomor, ...isian });
    return NextResponse.json({
      ok: true,
      nomor: hasil.nomor,
      nama_lengkap: hasil.nama_lengkap,
      status: hasil.status,
      sudahDisetujui: hasil.sudahDisetujui,
      langsungAktif: hasil.langsungAktif,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan server";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
