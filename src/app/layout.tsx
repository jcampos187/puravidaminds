import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { LanguageProvider } from "@/i18n/LanguageProvider";
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
        <html
          lang="en"
          className="h-full antialiased"
        >
          <body className="flex min-h-full flex-col bg-carreta-cream font-sans text-[#1A1A2E] dark:bg-[#1A1A2E] dark:text-carreta-eggshell">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </body>
        </html>
      </LanguageProvider>
    </ClerkProvider>
  );
}
