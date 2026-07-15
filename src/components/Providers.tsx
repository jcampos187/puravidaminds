"use client";

import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { ThemeProvider } from "./ThemeProvider";

interface ProvidersProps {
  children: ReactNode;
  initialServerTheme?: "light" | "dark";
}

/**
 * Wraps all client-side providers (Clerk, Language, Theme) in a single
 * client component so the root layout stays a Server Component.
 *
 * This is the recommended Next.js pattern to avoid hydration mismatches
 * from provider-injected content that differs between server and client.
 */
export default function Providers({ children, initialServerTheme }: ProvidersProps) {
  return (
    <ClerkProvider>
      <LanguageProvider>
        <ThemeProvider initialServerTheme={initialServerTheme}>
          {children}
        </ThemeProvider>
      </LanguageProvider>
    </ClerkProvider>
  );
}
