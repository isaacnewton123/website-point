import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import FormulirClient from "@/components/formulir/FormulirClient";
import FormulirHeader from "@/components/formulir/FormulirHeader";

export const metadata: Metadata = {
  title: "Formulir Pendaftaran Anggota",
  description: "Formulir pendaftaran anggota baru POINT Karawang melalui tautan undangan grup WhatsApp.",
};

function FormulirFallback() {
  return (
    <section style={{ padding: "0 0 5rem", marginTop: "-2.75rem", position: "relative", zIndex: 2 }}>
      <div className="container" style={{ maxWidth: 620 }}>
        <div className="card" style={{ padding: "2.5rem 1.75rem", textAlign: "center", color: "var(--text-muted)" }}>
          Memuat formulir...
        </div>
      </div>
    </section>
  );
}

export default function FormulirPage() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <FormulirHeader />
      <Suspense fallback={<FormulirFallback />}>
        <FormulirClient />
      </Suspense>
      <Footer />
    </main>
  );
}
