import { NextResponse, type NextRequest } from "next/server";
import { getFormSecret, verifikasiTokenFormulir } from "@/lib/formulir-token";
import {
  KOLOM_WAJIB,
  LABEL_KOLOM,
  normalisasiNomor,
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

type BodyPayload = Partial<Record<"token" | "nomor" | KolomWajib, unknown>>;

function selesaikanNomor(
  token: string | undefined,
  nomorRaw: string | undefined,
  secret: string,
): { nomor?: string; error?: string } {
  if (token && token.trim()) {
    const ver = verifikasiTokenFormulir(token.trim(), secret);
    return ver
      ? { nomor: ver.nomor }
      : { error: "Tautan formulir tidak valid atau sudah kedaluwarsa." };
  }
  if (nomorRaw && nomorRaw.trim()) {
    const norm = normalisasiNomor(nomorRaw);
    return norm ? { nomor: norm } : { error: "Format nomor WhatsApp tidak valid." };
  }
  return { error: "Sertakan token atau nomor WhatsApp." };
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
    const sp = request.nextUrl.searchParams;
    const hasil = selesaikanNomor(sp.get("t") ?? undefined, sp.get("nomor") ?? undefined, secret);
    if (!hasil.nomor) {
      return NextResponse.json({ ok: false, error: hasil.error }, { status: 400 });
    }
    const anggota = await ambilAnggotaByNomor(hasil.nomor);
    return NextResponse.json({
      ok: true,
      ditemukan: Boolean(anggota),
      nomor: hasil.nomor,
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
    const token = typeof body.token === "string" ? body.token : undefined;
    const nomorRaw = typeof body.nomor === "string" ? body.nomor : undefined;
    const hasil = selesaikanNomor(token, nomorRaw, secret);
    if (!hasil.nomor) {
      return NextResponse.json({ ok: false, error: hasil.error }, { status: 400 });
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

    const anggota = await simpanAnggotaFormulir(hasil.nomor, isian);
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
