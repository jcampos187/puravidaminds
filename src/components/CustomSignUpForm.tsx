"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import CarretaWheel from "./CarretaWheel";
import { useTranslations } from "@/i18n/useTranslations";

const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Wraps a promise with a timeout so it doesn't hang indefinitely.
 * Used for Clerk SDK calls which don't accept AbortSignal natively.
 */
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Request timed out after ${ms / 1000}s: ${label}`)), ms)
    ),
  ]);
}

export function CustomSignUpForm() {
  const { t } = useTranslations();
  const { signUp, errors: clerkErrors } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<"signup" | "verify" | "complete">("signup");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const passwordStrength = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>_]/.test(password),
  };

  const metCount = Object.values(passwordStrength).filter(Boolean).length;
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const [businessName, setBusinessName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  function formatClerkErrorMessage(err: unknown): string {
    if (err && typeof err === "object") {
      const apiErr = err as { errors?: Array<{ longMessage?: string; message?: string; code?: string }> };
      if (apiErr.errors?.[0]) {
        return apiErr.errors[0].longMessage || apiErr.errors[0].message || apiErr.errors[0].code || t("auth.signUp.error");
      }
      const clerkErr = err as { code?: string; longMessage?: string; message?: string; clerkError?: boolean };
      return clerkErr.longMessage || clerkErr.message || (clerkErr.code ? `Error: ${clerkErr.code}` : t("auth.signUp.error"));
    }
    if (err instanceof Error) return err.message;
    return t("auth.signUp.error");
  }

  const clerkErrItem = Array.isArray(clerkErrors) ? clerkErrors[0] : null;
  const displayError = error || clerkErrItem?.longMessage || clerkErrItem?.message || null;

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("auth.signUp.passwordMismatch"));
      return;
    }

    // Server-side password validation before sending to Clerk
    setIsSubmitting(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      let validationRes: Response;
      try {
        validationRes = await fetch("/api/validate-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!validationRes.ok) {
        const body = await validationRes.json().catch(() => ({}));
        setError(body?.error || t("auth.signUp.serverValidationError"));
        setIsSubmitting(false);
        return;
      }

      const validationData = await validationRes.json();

      if (!validationData.valid) {
        setError(t("auth.signUp.serverValidationFailed"));
        setIsSubmitting(false);
        return;
      }

      const createResult = await withTimeout(
        signUp.create({
          emailAddress: email,
          firstName: name,
        }),
        REQUEST_TIMEOUT_MS,
        "Creating Clerk account"
      );

      if (createResult?.error) {
        console.error("Clerk signUp.create error:", createResult.error);
        setError(formatClerkErrorMessage(createResult.error));
        setIsSubmitting(false);
        return;
      }

      const pwdResult = await withTimeout(
        signUp.password({ password }),
        REQUEST_TIMEOUT_MS,
        "Setting password"
      );

      if (pwdResult?.error) {
        console.error("Clerk signUp.password error:", pwdResult.error);
        setError(formatClerkErrorMessage(pwdResult.error));
        setIsSubmitting(false);
        return;
      }

      try {
        await withTimeout(
          signUp.verifications.sendEmailCode(),
          REQUEST_TIMEOUT_MS,
          "Sending verification email"
        );
        setStep("verify");
      } catch (emailErr) {
        // If sending email code fails (timeout or Clerk issue), auto-finalize
        // so the user isn't stuck with an incomplete sign-up.
        console.warn("Email verification failed, auto-finalizing:", emailErr);
        try {
          await withTimeout(
            signUp.finalize(),
            REQUEST_TIMEOUT_MS,
            "Finalizing sign-up"
          );
          await saveProfile();
          setStep("complete");
          setTimeout(() => router.push("/dashboard"), 1500);
        } catch (finalizeErr) {
          console.error("Auto-finalize failed:", finalizeErr);
          setError(
            emailErr instanceof Error && emailErr.message.includes("timed out")
              ? t("auth.signUp.timeout")
              : t("auth.signUp.emailSendFailed")
          );
        }
      }
    } catch (err: unknown) {
      console.error("Clerk signUp exception:", err);
      if (err instanceof Error && (err.name === "AbortError" || err.message.includes("timed out"))) {
        setError(t("auth.signUp.timeout"));
      } else {
        setError(formatClerkErrorMessage(err));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifySubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const verifyResult = await withTimeout(
        signUp.verifications.verifyEmailCode({ code }),
        REQUEST_TIMEOUT_MS,
        "Verifying email code"
      );

      if (verifyResult?.error) {
        console.error("Clerk verifyEmailCode error:", verifyResult.error);
        setError(formatClerkErrorMessage(verifyResult.error));
        setIsSubmitting(false);
        return;
      }

      await withTimeout(
        signUp.finalize(),
        REQUEST_TIMEOUT_MS,
        "Finalizing sign-up"
      );
      await saveProfile();
      setStep("complete");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: unknown) {
      console.error("Clerk signUp exception:", err);
      if (err instanceof Error && err.message.includes("timed out")) {
        setError(t("auth.signUp.timeout"));
      } else {
        setError(formatClerkErrorMessage(err));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveProfile() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      const res = await fetch("/api/artisan-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          businessName: businessName || null,
          bio: bio || null,
          phone: phone || null,
          whatsapp: whatsapp || null,
          website: website || null,
          instagram: instagram || null,
          facebook: facebook || null,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.warn("Profile save returned error:", body?.error || res.status);
      }
    } catch (err) {
      console.warn("Profile save failed — user can complete later:", err);
    }
  }

  return (
    <div id="custom-signup-form" className="w-full max-w-lg text-left">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step === "signup" ? "bg-carreta-red text-white" : "bg-carreta-red/10 text-carreta-red"}`}>1</span>
        <span className="h-px w-8 bg-carreta-red/30" />
        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step === "verify" ? "bg-carreta-red text-white" : step === "complete" ? "bg-green-500 text-white" : "bg-carreta-red/10 text-carreta-red"}`}>{step === "complete" ? "✓" : "2"}</span>
        <span className="h-px w-8 bg-carreta-red/30" />
        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step === "complete" ? "bg-green-500 text-white" : "bg-carreta-red/10 text-carreta-red"}`}>3</span>
      </div>

      {displayError && (
        <div className="mb-6 rounded-xl border-2 border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">{displayError}</div>
      )}

      {step === "complete" ? (
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl dark:bg-green-900/30">🎉</div>
          </div>
          <h2 className="text-xl font-bold text-[#1A1A2E] dark:text-carreta-eggshell">{t("auth.complete.title")}</h2>
          <p className="mt-2 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">{t("auth.complete.redirect")}</p>
          <div className="mt-6 flex justify-center"><CarretaWheel size={32} animated /></div>
        </div>
      ) : step === "verify" ? (
        <form onSubmit={handleVerifySubmit} className="space-y-5">
          <div className="text-center">
            <p className="text-sm text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">{t("auth.verify.sent", email)}</p>
          </div>              <div>
                <label htmlFor="code" className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">{t("auth.verify.title")}</label>
                <input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("auth.verify.placeholder")} autoComplete="one-time-code" className="w-full rounded-xl border-2 border-carreta-red/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-red dark:bg-[#22223A] dark:text-carreta-eggshell" required />
          </div>
          <div id="clerk-captcha" />
          <button type="submit" disabled={isSubmitting || !code} className="carreta-btn w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-50">{isSubmitting ? t("auth.verify.submitting") : t("auth.verify.submit")}</button>
          <button type="button" onClick={() => setStep("signup")} className="w-full text-sm text-[#1A1A2E]/60 hover:text-carreta-red dark:text-carreta-eggshell/60 dark:hover:text-carreta-gold">{t("auth.verify.back")}</button>
        </form>
      ) : (
        <form onSubmit={handleAuthSubmit} className="space-y-5">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-carreta-red">{t("auth.signUp.account")}</h3>
            <div className="space-y-4 rounded-xl border-2 border-carreta-red/10 bg-white/50 p-4 dark:bg-[#22223A]/50">
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">{t("auth.signUp.fullName")}</label>
                <input id="fullName" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("auth.signUp.fullNamePlaceholder")} autoComplete="name" className="w-full rounded-xl border-2 border-carreta-red/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-red dark:bg-[#22223A] dark:text-carreta-eggshell" required />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">{t("auth.signUp.email")}</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("auth.signUp.emailPlaceholder")} autoComplete="email" className="w-full rounded-xl border-2 border-carreta-red/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-red dark:bg-[#22223A] dark:text-carreta-eggshell" required />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">{t("auth.signUp.password")}</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); setPasswordTouched(true); }}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); confirmPasswordRef.current?.focus(); } }}
                    placeholder={t("auth.signUp.passwordPlaceholder")}
                    autoComplete="new-password"
                    minLength={8}
                    className="w-full rounded-xl border-2 border-carreta-red/20 bg-white px-5 py-3 pr-12 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-red dark:bg-[#22223A] dark:text-carreta-eggshell"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? t("auth.signUp.hidePassword") : t("auth.signUp.showPassword")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A2E]/40 transition-colors hover:text-[#1A1A2E]/70 dark:text-carreta-eggshell/40 dark:hover:text-carreta-eggshell/70"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Password strength indicator */}
                {passwordTouched && password.length > 0 && (
                  <div className="mt-3 rounded-lg border border-carreta-red/10 bg-white/50 p-3 transition-all dark:bg-[#22223A]/50">
                    <p className="mb-2 text-xs font-medium text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">{t("auth.signUp.passwordStrength")}</p>
                    <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-[#1A1A2E]/10 dark:bg-carreta-eggshell/10">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${(metCount / 5) * 100}%`,
                          backgroundColor:
                            metCount <= 2 ? "#ef4444" : metCount <= 3 ? "#f59e0b" : metCount <= 4 ? "#22c55e" : "#16a34a",
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {[
                        { key: "minLength", met: passwordStrength.minLength, label: t("auth.signUp.passwordMinLength") },
                        { key: "hasUpper", met: passwordStrength.hasUpper, label: t("auth.signUp.passwordUpper") },
                        { key: "hasLower", met: passwordStrength.hasLower, label: t("auth.signUp.passwordLower") },
                        { key: "hasNumber", met: passwordStrength.hasNumber, label: t("auth.signUp.passwordNumber") },
                        { key: "hasSpecial", met: passwordStrength.hasSpecial, label: t("auth.signUp.passwordSpecial") },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center gap-1.5 text-xs">
                          <span className={`shrink-0 transition-colors ${item.met ? "text-green-600 dark:text-green-400" : "text-[#1A1A2E]/30 dark:text-carreta-eggshell/30"}`}>
                            {item.met ? "✓" : "○"}
                          </span>
                          <span className={`transition-colors ${item.met ? "text-green-700 dark:text-green-300" : "text-[#1A1A2E]/50 dark:text-carreta-eggshell/50"}`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">{t("auth.signUp.confirmPassword")}</label>
                <div className="relative">
                  <input
                    ref={confirmPasswordRef}
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                    placeholder={t("auth.signUp.confirmPasswordPlaceholder")}
                    autoComplete="new-password"
                    minLength={8}
                    className={`w-full rounded-xl border-2 bg-white px-5 py-3 pr-12 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-red dark:bg-[#22223A] dark:text-carreta-eggshell ${confirmPassword && password !== confirmPassword ? "border-red-500" : "border-carreta-red/20"}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    aria-label={showConfirmPassword ? t("auth.signUp.hidePassword") : t("auth.signUp.showPassword")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A2E]/40 transition-colors hover:text-[#1A1A2E]/70 dark:text-carreta-eggshell/40 dark:hover:text-carreta-eggshell/70"
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-carreta-gold">{t("auth.signUp.artisanProfile")}</h3>
            <p className="mb-3 text-xs text-[#1A1A2E]/50 dark:text-carreta-eggshell/50">{t("auth.signUp.artisanProfileHint")}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="businessName" className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">{t("auth.signUp.businessName")}</label>
                <input id="businessName" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder={t("auth.signUp.businessNamePlaceholder")} autoComplete="organization" className="w-full rounded-xl border-2 border-carreta-gold/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-gold dark:bg-[#22223A] dark:text-carreta-eggshell" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="bio" className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">{t("auth.signUp.bio")} *</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={t("auth.signUp.bioPlaceholder")}
                  rows={3}
                  required
                  className="w-full rounded-xl border-2 border-carreta-gold/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-gold dark:bg-[#22223A] dark:text-carreta-eggshell"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">{t("auth.signUp.phone")} *</label>
                <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("auth.signUp.phonePlaceholder")} autoComplete="tel" required className="w-full rounded-xl border-2 border-carreta-gold/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-gold dark:bg-[#22223A] dark:text-carreta-eggshell" />
              </div>
              <div>
                <label htmlFor="whatsapp" className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">{t("auth.signUp.whatsapp")} *</label>
                <input id="whatsapp" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder={t("auth.signUp.whatsappPlaceholder")} autoComplete="tel" required className="w-full rounded-xl border-2 border-carreta-gold/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-gold dark:bg-[#22223A] dark:text-carreta-eggshell" />
              </div>
              <div>
                <label htmlFor="website" className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">{t("auth.signUp.website")}</label>
                <input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder={t("auth.signUp.websitePlaceholder")} autoComplete="url" className="w-full rounded-xl border-2 border-carreta-gold/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-gold dark:bg-[#22223A] dark:text-carreta-eggshell" />
              </div>
              <div>
                <label htmlFor="instagram" className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">{t("auth.signUp.instagram")}</label>
                <input id="instagram" type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder={t("auth.signUp.instagramPlaceholder")} autoComplete="off" className="w-full rounded-xl border-2 border-carreta-gold/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-gold dark:bg-[#22223A] dark:text-carreta-eggshell" />
              </div>
              <div>
                <label htmlFor="facebook" className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">{t("auth.signUp.facebook")}</label>
                <input id="facebook" type="url" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder={t("auth.signUp.facebookPlaceholder")} autoComplete="off" className="w-full rounded-xl border-2 border-carreta-gold/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-gold dark:bg-[#22223A] dark:text-carreta-eggshell" />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border-2 border-carreta-red/10 bg-white/50 p-4 dark:bg-[#22223A]/50">
            <input
              id="acceptTerms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-2 border-carreta-red/30 text-carreta-red focus:ring-carreta-red"
              required
            />
            <label htmlFor="acceptTerms" className="text-xs leading-relaxed text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
              {t("auth.signUp.acceptTerms")}{" "}
              <Link href="/terms" className="font-medium text-carreta-red underline underline-offset-2 hover:text-carreta-red/80">
                {t("auth.signUp.termsLink")}
              </Link>{" "}
              {t("auth.signUp.and")}{" "}
              <Link href="/privacy" className="font-medium text-carreta-red underline underline-offset-2 hover:text-carreta-red/80">
                {t("auth.signUp.privacyLink")}
              </Link>
            </label>
          </div>

          <div id="clerk-captcha" />
          <button type="submit" disabled={isSubmitting || !email || !password || !confirmPassword || !name || !acceptedTerms} className="carreta-btn flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold disabled:opacity-50">
            {isSubmitting ? <><CarretaWheel size={18} animated /> {t("auth.signUp.submitting")}</> : t("auth.signUp.submit")}
          </button>
          <p className="text-center text-xs text-[#1A1A2E]/50 dark:text-carreta-eggshell/50">{t("auth.signUp.terms")}</p>
        </form>
      )}
    </div>
  );
}
