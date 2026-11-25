import { NextResponse, type NextRequest } from "next/server";
import { getFormSecret, verifikasiTokenFormulir } from "@/lib/formulir-token";
import {
  KOLOM_WAJIB,
  LABEL_KOLOM,
  validasiKolom,
  type KolomWajib,
} from "@/lib/formulir-validasi";
import {
  ambilAnggotaByNomor,
  getDatabaseUrl,
  simpanAnggotaFormulir,
  type AnggotaProfilRow,
} from "@/lib/neon";

export const dynamic = "force-dynamic";

type BodyPayload = Partial<Record<"token" | KolomWajib, unknown>>;

const PESAN_TERKUNCI =
  "Formulir pendaftaran hanya bisa diakses melalui tautan undangan resmi dari grup WhatsApp POINT.";

function verifikasiUndangan(tokenRaw: unknown, secret: string): string | null {
  if (typeof tokenRaw !== "string" || !tokenRaw.trim()) return null;
  return verifikasiTokenFormulir(tokenRaw.trim(), secret)?.nomor ?? null;
}

function bentukProfil(row: AnggotaProfilRow | null) {
  return {
    nama_lengkap: row?.nama_lengkap ?? "",
    tanggal_lahir: row?.tanggal_lahir ?? "",
    alamat: row?.alamat ?? "",
    plat: row?.plat ?? "",
    tipe_warna_unit: row?.tipe_warna_unit ?? "",
  };
}

function validasiPayload(body: BodyPayload) {
  const isian: Partial<Record<KolomWajib, string>> = {};
  const errors: Record<string, string> = {};
  for (const kolom of KOLOM_WAJIB) {
    const mentah = body[kolom];
    if (typeof mentah !== "string" || !mentah.trim()) continue;
    const bersih = validasiKolom(kolom, mentah);
    if (bersih) isian[kolom] = bersih;
    else errors[kolom] = `${LABEL_KOLOM[kolom]} belum valid.`;
  }
  return { isian, errors };
}

export async function GET(request: NextRequest) {
  try {
    const secret = getFormSecret(getDatabaseUrl());
    const nomor = verifikasiUndangan(request.nextUrl.searchParams.get("t"), secret);
    if (!nomor) {
      return NextResponse.json({ ok: false, error: PESAN_TERKUNCI }, { status: 401 });
    }
    const anggota = await ambilAnggotaByNomor(nomor);
    return NextResponse.json({
      ok: true,
      ditemukan: Boolean(anggota),
      nomor,
      status: anggota?.status ?? "DATA_KURANG",
      kekurangan: anggota?.kekurangan ?? [...KOLOM_WAJIB],
      profil: bentukProfil(anggota),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan server";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as BodyPayload;
    const secret = getFormSecret(getDatabaseUrl());
    const nomor = verifikasiUndangan(body.token, secret);
    if (!nomor) {
      return NextResponse.json({ ok: false, error: PESAN_TERKUNCI }, { status: 401 });
    }

    const { isian, errors } = validasiPayload(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { ok: false, error: "Ada isian yang belum valid, silakan diperbaiki.", errors },
        { status: 422 },
      );
    }
    if (Object.keys(isian).length === 0) {
      return NextResponse.json(
        { ok: false, error: "Isi minimal satu kolom sebelum menyimpan.", errors: {} },
        { status: 422 },
      );
    }

    const anggota = await simpanAnggotaFormulir(nomor, isian);
    return NextResponse.json({
      ok: true,
      nomor: anggota.nomor,
      status: anggota.status,
      kekurangan: anggota.kekurangan,
      profil: bentukProfil(anggota),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan server";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
