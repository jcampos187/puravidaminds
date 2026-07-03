import type { Metadata } from "next";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pura Vida Artesanías — Authentic Costa Rican Handcrafts",
  description:
    "Discover authentic Costa Rican handcrafted products. Connect directly with skilled artisans from Sarchí and across Costa Rica. Pura Vida.",
  keywords: [
    "Costa Rica",
    "artesanías",
    "handcrafted",
    "Sarchí",
    "carretas",
    "Costa Rican crafts",
    "artisans",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <LanguageProvider>
        <ThemeProvider>
          <html
            lang="en"
            className="h-full antialiased"
            suppressHydrationWarning
          >
            <head>
              {/* Prevent flash of wrong theme — applies stored/system preference before any rendering */}
              <Script
                id="theme-init"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                  __html: `(function(){try{var t=localStorage.getItem("theme");if(t&&t==="dark")document.documentElement.classList.add("dark");else{var m=window.matchMedia("(prefers-color-scheme:dark)");if(m.matches)document.documentElement.classList.add("dark")}}catch(e){}})()`,
                }}
              />
            </head>
            <body className="flex min-h-full flex-col bg-carreta-cream font-sans text-[#1A1A2E] dark:bg-[#1A1A2E] dark:text-carreta-eggshell">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </body>
          </html>
        </ThemeProvider>
      </LanguageProvider>
    </ClerkProvider>
  );
}
