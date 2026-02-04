import type { Metadata } from "next";
import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://devlokos.com'),
  title: "DevLokos - App de contenido tech en español",
  description: "DevLokos es una app móvil que centraliza podcast, tutoriales en video, cursos, servicios empresariales y eventos. El hub digital de la marca DevLokos.",
  keywords: "DevLokos, app tecnología, podcast tech, tutoriales desarrollo, cursos programación, eventos meetups, Latinoamérica, desarrollo web, JavaScript, React, Node.js, TypeScript",
  authors: [{ name: "DevLokos" }],
  creator: "DevLokos",
  publisher: "DevLokos",
  robots: "index, follow",
  openGraph: {
    title: "DevLokos - App de contenido tech en español",
    description: "App que centraliza podcast, tutoriales, cursos, servicios empresariales y eventos. Hub digital DevLokos.",
    type: "website",
    locale: "es_ES",
    siteName: "DevLokos",
    url: "https://devlokos.com",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "DevLokos - App de contenido tech en español",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevLokos - App de contenido tech en español",
    description: "App que centraliza podcast, tutoriales, cursos, servicios empresariales y eventos.",
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
        <div className="min-h-screen bg-black text-white selection:bg-orange-500/30 flex flex-col">
          <NavBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
