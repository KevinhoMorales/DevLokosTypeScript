import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "yt3.ggpht.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "kevinhomorales.com",
      },
      {
        protocol: "https",
        hostname: "www.kevinhomorales.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/terminos", destination: "/terms", permanent: true },
      { source: "/privacidad", destination: "/privacy", permanent: true },
      { source: "/productos", destination: "/products", permanent: true },
      { source: "/tutoriales", destination: "/tutorials", permanent: true },
      { source: "/academia", destination: "/academy", permanent: true },
      { source: "/empresarial", destination: "/enterprise", permanent: true },
      { source: "/eventos", destination: "/events", permanent: true },
    ];
  },
};

export default nextConfig;
