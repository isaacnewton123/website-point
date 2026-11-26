import type { Metadata } from "next";
import Footer from "@/components/Footer";
import FormulirClient from "@/components/formulir/FormulirClient";
import FormulirHeader from "@/components/formulir/FormulirHeader";

const FORM_URL = "https://point-karawang.netlify.app/formulir";

export const metadata: Metadata = {
  title: "Formulir Anggota Resmi",
  description:
    "Lengkapi data diri & kendaraan anggota Paguyuban Online Lintas Timur (POINT) Karawang. Anggota aktif grup WhatsApp langsung terdata otomatis.",
  alternates: {
    canonical: FORM_URL,
  },
  openGraph: {
    type: "website",
    url: FORM_URL,
    siteName: "POINT Karawang",
    title: "Formulir Anggota Resmi – POINT Karawang",
    description:
      "Isi data diri & kendaraan kamu di sini. Khusus anggota yang sudah di grup WA POINT, data langsung otomatis aktif & lengkap!",
    locale: "id_ID",
    images: [
      {
        url: "/formulir/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Formulir Anggota Resmi POINT Karawang",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Formulir Anggota Resmi – POINT Karawang",
    description:
      "Isi data diri & kendaraan kamu di sini. Khusus anggota grup WA POINT langsung aktif otomatis!",
    images: ["/formulir/opengraph-image"],
  },
};

export default function FormulirPage() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <FormulirHeader />
      <FormulirClient />
      <Footer />
    </main>
  );
}
