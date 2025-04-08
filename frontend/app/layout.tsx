import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./_components/header";
import Footer from "./_components/footer";
import { isAdminPath } from "@/lib/path-utils";
import { ThemeProvider } from "@/components/theme-provider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use the non-async version directly
  const isAdmin = isAdminPath();
  
  // Invert the condition since you want to show Header/Footer when NOT on admin pages
  const showHeaderFooter = !isAdmin;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen grid grid-rows-[1fr_auto]`}
        suppressHydrationWarning
      >
        {showHeaderFooter && <Header />}

        <ThemeProvider 
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="borak-theme"
        >
          {children}
        </ThemeProvider>
        {showHeaderFooter && <Footer />}
      </body>
    </html>
  );
}
