import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// ─── Update BASE_URL saat deploy ─────────────────────────────────────────────
const BASE_URL = "https://point-karawang.netlify.app";
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "POINT – Paguyuban Online Lintas Timur | Karawang",
    template: "%s | POINT Karawang",
  },
  description:
    "POINT (Paguyuban Online Lintas Timur) adalah komunitas driver online di Karawang, Jawa Barat. Bersatu dalam solidaritas tanpa batas – Grab, Gojek, Lalamove, InDriver, Maxim.",
  keywords: [
    "POINT",
    "Paguyuban Online Lintas Timur",
    "komunitas driver online",
    "Karawang",
    "solidaritas tanpa batas",
    "GrabCar",
    "GoCar",
    "Lalamove",
    "InDriver",
    "Maxim",
    "driver online Karawang",
    "paguyuban Karawang",
  ],
  authors: [{ name: "POINT Community", url: BASE_URL }],
  creator: "POINT Karawang",
  publisher: "POINT – Paguyuban Online Lintas Timur",
  category: "community",

  // ─── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "POINT Karawang",
    title: "POINT – Solidaritas Tanpa Batas",
    description:
      "Komunitas driver online di Karawang yang bersatu lintas platform. Grab, Gojek, Lalamove, InDriver, Maxim – satu keluarga, satu solidaritas.",
    locale: "id_ID",
    images: [
      {
        url: `${BASE_URL}/op-image.png`,
        width: 1200,
        height: 630,
        alt: "POINT – Paguyuban Online Lintas Timur Karawang",
        type: "image/png",
      },
    ],
  },

  // ─── Twitter / X Card ──────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@pointkarawang",
    creator: "@pointkarawang",
    title: "POINT – Solidaritas Tanpa Batas",
    description:
      "Komunitas driver online di Karawang yang bersatu lintas platform dalam solidaritas tanpa batas.",
    images: [`${BASE_URL}/op-image.png`],
  },

  // ─── PWA / App ─────────────────────────────────────────────────────────────
  applicationName: "POINT Karawang",
  appleWebApp: {
    capable: true,
    title: "POINT - Karawang",
    statusBarStyle: "black-translucent",
  },
  manifest: "/manifest.json",

  // ─── Robots ────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ─── Verification Google Search Console (isi jika ada) ────────────────────
  // verification: { google: "GOOGLE_SEARCH_CONSOLE_TOKEN" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <head>
        <meta name="apple-mobile-web-app-title" content="POINT - Karawang" />
        <meta name="theme-color" content="#1e2a5e" />
        <meta name="color-scheme" content="light dark" />
        <link rel="canonical" href={BASE_URL} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
