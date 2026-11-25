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
  langsungAktif: boolean;
  nomor: string;
  nama_lengkap: string;
  status: string;
};

type AnggotaCekRow = {
  nomor: string;
  nama_lengkap: string | null;
  status: string;
  aktif_di_grup: boolean;
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

async function cekAnggota(nomor: string): Promise<AnggotaCekRow | null> {
  const sql = getSql();
  const rows = (await sql`
    select nomor, nama_lengkap, status, aktif_di_grup
    from anggota
    where nomor = ${nomor}
    limit 1
  `) as AnggotaCekRow[];
  return rows[0] ?? null;
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

async function upsertPendaftarDisetujui(input: PendaftarInput): Promise<void> {
  const sql = getSql();
  await sql`
    insert into pendaftar (nomor, nama_lengkap, tanggal_lahir, alamat, plat, tipe_warna_unit, status)
    values (
      ${input.nomor}, ${input.nama_lengkap}, ${input.tanggal_lahir}::date,
      ${input.alamat}, ${input.plat}, ${input.tipe_warna_unit}, 'disetujui'
    )
    on conflict (nomor) do update set
      nama_lengkap = excluded.nama_lengkap,
      tanggal_lahir = excluded.tanggal_lahir,
      alamat = excluded.alamat,
      plat = excluded.plat,
      tipe_warna_unit = excluded.tipe_warna_unit,
      status = 'disetujui',
      diperbarui_pada = now()
  `;
}

async function lengkapiAnggotaAktif(input: PendaftarInput): Promise<PendaftarResult> {
  const sql = getSql();
  const updated = (await sql`
    update anggota set
      nama_lengkap = coalesce(nullif(trim(nama_lengkap), ''), ${input.nama_lengkap}),
      tanggal_lahir = coalesce(tanggal_lahir, ${input.tanggal_lahir}::date),
      alamat = coalesce(nullif(trim(alamat), ''), ${input.alamat}),
      plat = coalesce(nullif(trim(plat), ''), ${input.plat}),
      tipe_warna_unit = coalesce(nullif(trim(tipe_warna_unit), ''), ${input.tipe_warna_unit}),
      kekurangan = '{}',
      status = 'LENGKAP',
      diperbarui_pada = now()
    where nomor = ${input.nomor} and aktif_di_grup = true and status = 'DATA_KURANG'
    returning nomor, nama_lengkap, status
  `) as { nomor: string; nama_lengkap: string | null; status: string }[];

  const row = updated[0];
  if (!row) {
    return {
      sudahDisetujui: true,
      langsungAktif: false,
      nomor: input.nomor,
      nama_lengkap: input.nama_lengkap,
      status: "LENGKAP",
    };
  }
  await sql`update antrean set status = 'selesai' where nomor = ${input.nomor} and status <> 'selesai'`;
  await upsertPendaftarDisetujui(input);
  return {
    sudahDisetujui: false,
    langsungAktif: true,
    nomor: row.nomor,
    nama_lengkap: row.nama_lengkap ?? input.nama_lengkap,
    status: row.status,
  };
}

async function upsertPendaftarMenunggu(input: PendaftarInput): Promise<PendaftarResult> {
  const sql = getSql();
  const rows = (await sql`
    insert into pendaftar (nomor, nama_lengkap, tanggal_lahir, alamat, plat, tipe_warna_unit, status)
    values (
      ${input.nomor}, ${input.nama_lengkap}, ${input.tanggal_lahir}::date,
      ${input.alamat}, ${input.plat}, ${input.tipe_warna_unit}, 'menunggu'
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
    langsungAktif: false,
    nomor: rows[0]?.nomor ?? input.nomor,
    nama_lengkap: rows[0]?.nama_lengkap ?? input.nama_lengkap,
    status: rows[0]?.status ?? "menunggu",
  };
}

export async function simpanPendaftar(input: PendaftarInput): Promise<PendaftarResult> {
  const anggota = await cekAnggota(input.nomor);
  if (anggota && anggota.status === "LENGKAP") {
    return {
      sudahDisetujui: true,
      langsungAktif: false,
      nomor: input.nomor,
      nama_lengkap: anggota.nama_lengkap ?? input.nama_lengkap,
      status: "LENGKAP",
    };
  }
  if (anggota && anggota.aktif_di_grup && anggota.status === "DATA_KURANG") {
    return lengkapiAnggotaAktif(input);
  }
  if (!anggota) {
    const sudah = await cekSudahDisetujui(input.nomor);
    if (sudah) {
      return {
        sudahDisetujui: true,
        langsungAktif: false,
        nomor: input.nomor,
        nama_lengkap: sudah.nama_lengkap,
        status: sudah.status,
      };
    }
  }
  return upsertPendaftarMenunggu(input);
}
