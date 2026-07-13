"use client";

import { useState } from "react";
import { SignIn } from "@clerk/nextjs";
import CarretaWheel from "@/components/CarretaWheel";
import { useTranslations } from "@/i18n/useTranslations";

export default function SignInPage() {
  const { t } = useTranslations();
  const [email, setEmail] = useState("");
  const [validatedEmail, setValidatedEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckEmail(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/check-artisan?email=${encodeURIComponent(email.trim())}`
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Server error");
      }

      const data = await res.json();

      if (data.exists) {
        // Email belongs to an existing artisan — proceed to Clerk sign-in
        setValidatedEmail(email.trim().toLowerCase());
      } else {
        setError(t("auth.signIn.notFound"));
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("auth.signIn.notFound")
      );
    } finally {
      setChecking(false);
    }
  }

  // ─── Step 2: Show Clerk's SignIn component ────────────────
  if (validatedEmail) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center bg-gradient-to-b from-carreta-cream via-white to-carreta-cream px-6 py-24 dark:from-[#1A1A2E] dark:via-[#22223A] dark:to-[#1A1A2E]">
        <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='none' stroke='%23CC2936' stroke-width='3'/%3E%3Cline x1='60' y1='12' x2='60' y2='108' stroke='%23005ABB' stroke-width='2'/%3E%3Cline x1='12' y1='60' x2='108' y2='60' stroke='%23005ABB' stroke-width='2'/%3E%3C/svg%3E\")`,
              backgroundSize: "120px 120px",
            }}
          />
        </div>
        <div className="relative w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <CarretaWheel size={48} variant="outline" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell">
              {t("auth.signIn.title")}
            </h1>
            <p className="mt-2 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
              {t("auth.signIn.sub")}
            </p>
          </div>
          <SignIn initialValues={{ emailAddress: validatedEmail }} />
        </div>
      </div>
    );
  }

  // ─── Step 1: Ask for email to validate ────────────────────
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-gradient-to-b from-carreta-cream via-white to-carreta-cream px-6 py-24 dark:from-[#1A1A2E] dark:via-[#22223A] dark:to-[#1A1A2E]">
      <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='none' stroke='%23CC2936' stroke-width='3'/%3E%3Cline x1='60' y1='12' x2='60' y2='108' stroke='%23005ABB' stroke-width='2'/%3E%3Cline x1='12' y1='60' x2='108' y2='60' stroke='%23005ABB' stroke-width='2'/%3E%3C/svg%3E\")`,
            backgroundSize: "120px 120px",
          }}
        />
      </div>
      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <CarretaWheel size={48} variant="outline" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell">
            {t("auth.signIn.title")}
          </h1>
          <p className="mt-2 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
            {t("auth.signIn.sub")}
          </p>
        </div>

        <form onSubmit={handleCheckEmail} className="space-y-5">
          <div>
            <label
              htmlFor="check-email"
              className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell"
            >
              {t("auth.signIn.emailLabel")}
            </label>
            <input
              id="check-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.signIn.emailPlaceholder")}
              autoComplete="email"
              required
              className="w-full rounded-xl border-2 border-carreta-blue/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-blue dark:bg-[#22223A] dark:text-carreta-eggshell"
            />
          </div>

          {error && (
            <div className="rounded-xl border-2 border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={checking || !email.trim()}
            className="carreta-btn flex w-full items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-semibold disabled:opacity-50"
          >
            {checking ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {t("auth.signIn.checking")}
              </>
            ) : (
              t("auth.signIn.continue")
            )}
          </button>

          <p className="text-center text-xs text-[#1A1A2E]/50 dark:text-carreta-eggshell/50">
            {t("auth.signIn.noAccount")}{" "}
            <a
              href="/register"
              className="font-medium text-carreta-red hover:text-carreta-orange"
            >
              {t("auth.signIn.joinLink")}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
