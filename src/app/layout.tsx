import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "./_components/query-provider";

const geist = Geist({ variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Dentis",
  description: "Dentis frontend learning workspace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
