import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/layout/Sidebar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
  ),
  title: "ContaUp",
  description: "Plataforma de contabilidade e gestão financeira.",
  icons: {
    icon: "/contauplogo.png",
  },
  openGraph: {
    title: "ContaUp",
    description: "Plataforma de contabilidade e gestão financeira.",
    images: [{ url: "/contauplogo.png", width: 512, height: 512, alt: "ContaUp" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} dark antialiased`}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <body className="min-h-screen">
        <Sidebar>{children}</Sidebar>
      </body>
    </html>
  );
}
