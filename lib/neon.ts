import { neon } from "@neondatabase/serverless";

export type PendaftarInput = {
  nomor: string;
  nama_lengkap: string;
  tanggal_lahir: string;
  alamat: string;
  plat: string;
  tipe_warna_unit: string;
};

export type PendaftarResult = {
  sudahDisetujui: boolean;
  nomor: string;
  nama_lengkap: string;
  status: string;
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

async function cekSudahDisetujui(nomor: string): Promise<{ status: string; nama_lengkap: string } | null> {
  const sql = getSql();
  const rows = (await sql`
    select status, nama_lengkap
    from pendaftar
    where nomor = ${nomor}
    limit 1
  `) as { status: string; nama_lengkap: string }[];
  if (rows[0]?.status === "disetujui") return rows[0];
  return null;
}

export async function simpanPendaftar(input: PendaftarInput): Promise<PendaftarResult> {
  const sudah = await cekSudahDisetujui(input.nomor);
  if (sudah) {
    return {
      sudahDisetujui: true,
      nomor: input.nomor,
      nama_lengkap: sudah.nama_lengkap,
      status: sudah.status,
    };
  }

  const sql = getSql();
  const rows = (await sql`
    insert into pendaftar (nomor, nama_lengkap, tanggal_lahir, alamat, plat, tipe_warna_unit, status)
    values (
      ${input.nomor},
      ${input.nama_lengkap},
      ${input.tanggal_lahir}::date,
      ${input.alamat},
      ${input.plat},
      ${input.tipe_warna_unit},
      'menunggu'
    )
    on conflict (nomor) do update set
      nama_lengkap = excluded.nama_lengkap,
      tanggal_lahir = excluded.tanggal_lahir,
      alamat = excluded.alamat,
      plat = excluded.plat,
      tipe_warna_unit = excluded.tipe_warna_unit,
      status = 'menunggu',
      diperbarui_pada = now()
    returning nomor, nama_lengkap, status
  `) as { nomor: string; nama_lengkap: string; status: string }[];

  return {
    sudahDisetujui: false,
    nomor: rows[0]?.nomor ?? input.nomor,
    nama_lengkap: rows[0]?.nama_lengkap ?? input.nama_lengkap,
    status: rows[0]?.status ?? "menunggu",
  };
}
