import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/layout/Sidebar";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://contaup-techbalance.vercel.app"
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
    url: "https://contaup-techbalance.vercel.app",
    siteName: "ContaUp",
    images: [
      {
        url: "https://contaup-techbalance.vercel.app/contauplogo.png",
        width: 512,
        height: 512,
        alt: "ContaUp - Gestão Financeira",
      },
    ],
    type: "website",
  },
};

import { AuthProvider } from "@/shared/AuthContext";
import { Providers } from "@/shared/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} dark antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/2.4.2/uicons-regular-rounded/css/uicons-regular-rounded.css"
          precedence="default"
        />
      </head>
      <body className="min-h-screen">
        <Providers>
          <AuthProvider>
            <Sidebar>{children}</Sidebar>
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
