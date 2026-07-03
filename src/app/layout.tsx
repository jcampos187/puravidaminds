import type { Metadata } from "next";
import { cookies } from "next/headers";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read theme cookie so the correct class is rendered server-side — no flash, no inline script needed
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme");
  const initialTheme = themeCookie?.value === "dark" ? "dark" : "light";

  return (
    <ClerkProvider>
      <LanguageProvider>
        <ThemeProvider initialServerTheme={initialTheme}>
          <html
            lang="en"
            className={`h-full antialiased${initialTheme === "dark" ? " dark" : ""}`}
            suppressHydrationWarning
          >
            <head />
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
