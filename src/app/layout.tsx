import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Perpustakaan Digital IAD Surakarta",
  description:
    "Katalog daring Perpustakaan Digital Ikatan Adhyaksa Dharmakarini Daerah Surakarta",
  icons: {
    icon: "/favicon/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <header className="border-b bg-card/60 backdrop-blur">
              <div className="mx-auto flex max-w-6xl items-center px-4 py-4 md:px-6">
                <Link href="/" className="flex gap-3">
                  <Image src="/logo_iad-removebg-preview.png" alt="Logo" width={48} height={48} className="object-contain" />

                  <div className="flex flex-col">
                    <span className="text-sm font-semibold tracking-wide text-primary md:text-base">
                      Perpustakaan Digital
                    </span>
                    <span className="text-xs text-muted-foreground md:text-sm">
                      Ikatan Adhyaksa Dharmakarini Daerah Surakarta
                    </span>
                  </div>
                </Link>
              </div>
            </header>
            <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8">
              {children}
            </main>
            <footer className="border-t bg-card/60 py-4 text-xs text-muted-foreground md:text-sm">
              <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 md:flex-row md:items-center md:px-6">
                <span>
                  &copy; {new Date().getFullYear()} Ikatan Adhyaksa Dharmakarini
                  Daerah Surakarta.
                </span>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
