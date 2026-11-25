import type { Metadata } from "next";
import Footer from "@/components/Footer";
import FormulirClient from "@/components/formulir/FormulirClient";
import FormulirHeader from "@/components/formulir/FormulirHeader";

export const metadata: Metadata = {
  title: "Formulir Pendaftaran Anggota",
  description: "Formulir pendaftaran anggota baru Paguyuban Online Lintas Timur (POINT) Karawang.",
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
