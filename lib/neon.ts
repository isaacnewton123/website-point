import { neon } from "@neondatabase/serverless";
import { hitungKekurangan, KOLOM_WAJIB, type KolomWajib } from "./formulir-validasi";

export type AnggotaProfilRow = {
  nomor: string;
  nama_kontak: string | null;
  nama_lengkap: string | null;
  tanggal_lahir: string | null;
  alamat: string | null;
  plat: string | null;
  tipe_warna_unit: string | null;
  status: string;
  kekurangan: KolomWajib[];
};

export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL belum diatur di environment");
  }
  return url;
}

function getSql() {
  return neon(getDatabaseUrl());
}

export async function ambilAnggotaByNomor(nomor: string): Promise<AnggotaProfilRow | null> {
  const sql = getSql();
  const rows = (await sql`
    select
      nomor,
      nama_kontak,
      nama_lengkap,
      to_char(tanggal_lahir, 'YYYY-MM-DD') as tanggal_lahir,
      alamat,
      plat,
      tipe_warna_unit,
      status,
      kekurangan
    from anggota
    where nomor = ${nomor}
    limit 1
  `) as AnggotaProfilRow[];
  return rows[0] ?? null;
}

export async function simpanAnggotaFormulir(
  nomor: string,
  isian: Partial<Record<KolomWajib, string>>,
): Promise<AnggotaProfilRow> {
  const sql = getSql();
  await sql`
    insert into anggota (nomor, status, aktif_di_grup, kekurangan)
    values (${nomor}, 'DATA_KURANG', true, ${[...KOLOM_WAJIB]})
    on conflict (nomor) do nothing
  `;
  await sql`
    update anggota
    set
      nama_lengkap = coalesce(${isian.nama_lengkap ?? null}, nama_lengkap),
      tanggal_lahir = coalesce(${isian.tanggal_lahir ?? null}::date, tanggal_lahir),
      alamat = coalesce(${isian.alamat ?? null}, alamat),
      plat = coalesce(${isian.plat ?? null}, plat),
      tipe_warna_unit = coalesce(${isian.tipe_warna_unit ?? null}, tipe_warna_unit),
      diperbarui_pada = now()
    where nomor = ${nomor}
  `;
  const sekarang = await ambilAnggotaByNomor(nomor);
  if (!sekarang) throw new Error("Data anggota tidak ditemukan setelah disimpan");

  const kekurangan = hitungKekurangan({
    nama_lengkap: sekarang.nama_lengkap,
    tanggal_lahir: sekarang.tanggal_lahir,
    alamat: sekarang.alamat,
    plat: sekarang.plat,
    tipe_warna_unit: sekarang.tipe_warna_unit,
  });
  const statusBaru = kekurangan.length === 0 ? "LENGKAP" : "DATA_KURANG";

  const updated = (await sql`
    update anggota
    set kekurangan = ${kekurangan}, status = ${statusBaru}, diperbarui_pada = now()
    where nomor = ${nomor}
    returning nomor, nama_kontak, nama_lengkap,
      to_char(tanggal_lahir, 'YYYY-MM-DD') as tanggal_lahir,
      alamat, plat, tipe_warna_unit, status, kekurangan
  `) as AnggotaProfilRow[];

  if (statusBaru === "LENGKAP") {
    await sql`update antrean set status = 'selesai' where nomor = ${nomor} and status <> 'selesai'`;
  }
  return updated[0] ?? sekarang;
}
