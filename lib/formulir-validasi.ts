export const KOLOM_WAJIB = [
  "nama_lengkap",
  "tanggal_lahir",
  "alamat",
  "plat",
  "tipe_warna_unit",
] as const;

export type KolomWajib = (typeof KOLOM_WAJIB)[number];

export const LABEL_KOLOM: Record<KolomWajib, string> = {
  nama_lengkap: "Nama lengkap",
  tanggal_lahir: "Tanggal lahir",
  alamat: "Alamat lengkap",
  plat: "Nomor plat kendaraan",
  tipe_warna_unit: "Tipe dan warna kendaraan",
};

const BULAN: Record<string, number> = {
  januari: 1, january: 1, jan: 1,
  februari: 2, february: 2, feb: 2,
  maret: 3, march: 3, mar: 3,
  april: 4, apr: 4,
  mei: 5, may: 5,
  juni: 6, june: 6, jun: 6,
  juli: 7, july: 7, jul: 7,
  agustus: 8, august: 8, agu: 8, aug: 8, agt: 8,
  september: 9, sep: 9, sept: 9,
  oktober: 10, october: 10, okt: 10, oct: 10,
  november: 11, nov: 11,
  desember: 12, december: 12, des: 12, dec: 12,
};

export function normalisasiNomor(mentah: string): string | null {
  const awal = mentah.trim();
  if (!awal) return null;
  const perbaikiTypo = awal.replace(/(?<=\d)[Oo]|[Oo](?=\d)/g, "0");
  const bertandaPlus = perbaikiTypo.startsWith("+");
  let digit = perbaikiTypo.replace(/\D/g, "");
  if (!digit) return null;

  if (digit.startsWith("620")) {
    digit = `62${digit.slice(3)}`;
  } else if (!bertandaPlus) {
    if (digit.startsWith("0")) digit = `62${digit.slice(1)}`;
    else if (digit.startsWith("8")) digit = `62${digit}`;
  }

  if (digit.startsWith("62")) {
    return digit.length >= 10 && digit.length <= 15 ? `+${digit}` : null;
  }
  return digit.length >= 9 && digit.length <= 15 ? `+${digit}` : null;
}

export function normalisasiPlat(mentah: string): string | null {
  const bersih = mentah.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (bersih.length < 3 || bersih.length > 12) return null;
  if (!/[A-Z]/.test(bersih) || !/\d/.test(bersih)) return null;
  return bersih;
}

function tanggalJikaWajar(tahun: number, bulan: number, tanggal: number, hari: Date): string | null {
  if (bulan < 1 || bulan > 12 || tanggal < 1 || tanggal > 31) return null;
  const nilai = new Date(tahun, bulan - 1, tanggal);
  if (nilai.getFullYear() !== tahun || nilai.getMonth() !== bulan - 1 || nilai.getDate() !== tanggal) {
    return null;
  }
  const tertua = new Date(1940, 0, 1);
  const termuda = new Date(hari.getFullYear() - 16, hari.getMonth(), hari.getDate());
  if (nilai < tertua || nilai > termuda) return null;
  return `${tahun}-${String(bulan).padStart(2, "0")}-${String(tanggal).padStart(2, "0")}`;
}

export function parseTanggalLahir(mentah: string, hari = new Date()): string | null {
  const teks = mentah.trim();
  if (!teks) return null;

  const iso = teks.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return tanggalJikaWajar(Number(iso[1]), Number(iso[2]), Number(iso[3]), hari);

  const angka = teks.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  if (angka) return tanggalJikaWajar(Number(angka[3]), Number(angka[2]), Number(angka[1]), hari);

  const kata = teks.toLowerCase().match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/);
  if (kata) {
    const bulan = BULAN[kata[2]];
    return bulan ? tanggalJikaWajar(Number(kata[3]), bulan, Number(kata[1]), hari) : null;
  }
  return null;
}

export function validasiKolom(kolom: KolomWajib, mentah: string, hari = new Date()): string | null {
  const teks = mentah.trim();
  if (!teks) return null;

  if (kolom === "nama_lengkap") {
    if (teks.startsWith("@") || teks.length > 120) return null;
    const huruf = teks.match(/[A-Za-zÀ-ÿ]/g);
    return huruf && huruf.length >= 2 ? teks : null;
  }
  if (kolom === "tanggal_lahir") return parseTanggalLahir(teks, hari);
  if (kolom === "alamat") {
    const kata = teks.split(/\s+/).filter(Boolean);
    return kata.length >= 2 && teks.length >= 8 && /[A-Za-zÀ-ÿ]/.test(teks) ? teks : null;
  }
  if (kolom === "plat") return normalisasiPlat(teks);

  const kata = teks.split(/\s+/).filter(Boolean);
  return kata.length >= 2 && /[A-Za-zÀ-ÿ]/.test(teks) ? teks : null;
}

export function hitungKekurangan(profil: Record<KolomWajib, string | null>): KolomWajib[] {
  return KOLOM_WAJIB.filter((kolom) => {
    const nilai = profil[kolom];
    return !nilai || !nilai.trim();
  });
}
