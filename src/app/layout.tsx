import type { Metadata } from "next";
import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://devlokos.com'),
  title: "DevLokos - Comunidad de Desarrolladores Latinoamérica",
  description: "DevLokos es una comunidad para desarrolladores y creadores tech que quieren aprender, conectar y construir desde Latinoamérica. Podcast, academia, contenido gratuito y más.",
  keywords: "DevLokos, comunidad de desarrolladores, tecnología, Latinoamérica, podcast, academia, contenido tech, programación, desarrollo web, JavaScript, React, Node.js, TypeScript",
  authors: [{ name: "DevLokos" }],
  creator: "DevLokos",
  publisher: "DevLokos",
  robots: "index, follow",
  openGraph: {
    title: "DevLokos - Comunidad de Desarrolladores Latinoamérica",
    description: "Construimos comunidad, conocimiento y tecnología desde Latinoamérica",
    type: "website",
    locale: "es_ES",
    siteName: "DevLokos",
    url: "https://devlokos.com",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "DevLokos - Comunidad de Desarrolladores Latinoamérica",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevLokos - Comunidad de Desarrolladores Latinoamérica",
    description: "Construimos comunidad, conocimiento y tecnología desde Latinoamérica",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://devlokos.com",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "256x256", type: "image/png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/favicon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
