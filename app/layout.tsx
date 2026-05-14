import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "POINT – Paguyuban Online Lintas Timur | Karawang",
  description:
    "POINT (Paguyuban Online Lintas Timur) adalah komunitas driver online roda 4 di Karawang. Bersatu dalam solidaritas tanpa batas – Grab, Gojek, Lalamove, InDriver, Maxim.",
  keywords: [
    "POINT",
    "Paguyuban Online Lintas Timur",
    "komunitas driver online",
    "Karawang",
    "solidaritas tanpa batas",
    "GrabCar",
    "GoCar",
  ],
  openGraph: {
    title: "POINT – Solidaritas Tanpa Batas",
    description:
      "Komunitas driver online roda 4 di Karawang. Saling membantu, berbagi info, dan merayakan kebersamaan.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
