import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./_components/header";
import Footer from "./_components/footer";
import { isAdminPath } from "@/lib/path-utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Borak Travel & Tours",
  description: "This is great naman",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAdmin = await isAdminPath();
  const showHeaderFooter = !isAdmin;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen grid grid-rows-[1fr_auto]`}
        suppressHydrationWarning
      >

          {showHeaderFooter && <Header />}
          {children}
          {showHeaderFooter && <Footer />}
      </body>
    </html>
  );
}
