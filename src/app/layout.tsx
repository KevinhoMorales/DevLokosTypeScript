import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const eudoxusSans = localFont({
  src: [
    {
      path: "./font/EudoxusSans-ExtraLight-BF659b6cb1e7092.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./font/EudoxusSans-Light-BF659b6cb2036b5.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./font/EudoxusSans-Regular-BF659b6cb1d4714.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./font/EudoxusSans-Medium-BF659b6cb1c14cb.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./font/EudoxusSans-Bold-BF659b6cb1408e5.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./font/EudoxusSans-ExtraBold-BF659b6cb1b96c9.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-eudoxus-sans",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${eudoxusSans.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-background-dark text-white`}
      >
        {children}
      </body>
    </html>
  );
}
