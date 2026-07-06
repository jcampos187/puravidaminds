"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import CarretaWheel from "./CarretaWheel";
import { useTranslations } from "@/i18n/useTranslations";

export function CustomSignUpForm() {
  const { t } = useTranslations();
  const { signUp, errors: clerkErrors } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<"signup" | "verify" | "complete">("signup");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");

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
    setIsSubmitting(true);

    try {
      const createResult = await signUp.create({
        emailAddress: email,
        firstName: name,
      });

      if (createResult?.error) {
        console.error("Clerk signUp.create error:", createResult.error);
        setError(formatClerkErrorMessage(createResult.error));
        setIsSubmitting(false);
        return;
      }

      const pwdResult = await signUp.password({ password });

      if (pwdResult?.error) {
        console.error("Clerk signUp.password error:", pwdResult.error);
        setError(formatClerkErrorMessage(pwdResult.error));
        setIsSubmitting(false);
        return;
      }

      try {
        await signUp.verifications.sendEmailCode();
        setStep("verify");
      } catch {
        await signUp.finalize();
        await saveProfile();
        setStep("complete");
        setTimeout(() => router.push("/dashboard"), 1500);
      }
    } catch (err: unknown) {
      console.error("Clerk signUp exception:", err);
      setError(formatClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifySubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const verifyResult = await signUp.verifications.verifyEmailCode({ code });

      if (verifyResult?.error) {
        console.error("Clerk verifyEmailCode error:", verifyResult.error);
        setError(formatClerkErrorMessage(verifyResult.error));
        setIsSubmitting(false);
        return;
      }

      await signUp.finalize();
      await saveProfile();
      setStep("complete");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: unknown) {
      console.error("Clerk signUp exception:", err);
      setError(formatClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveProfile() {
    try {
      await fetch("/api/artisan-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          businessName: businessName || null,
          phone: phone || null,
          whatsapp: whatsapp || null,
          website: website || null,
          instagram: instagram || null,
          facebook: facebook || null,
        }),
      });
    } catch {
      console.warn("Profile save failed — user can complete later");
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
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.signUp.passwordPlaceholder")} autoComplete="new-password" minLength={8} className="w-full rounded-xl border-2 border-carreta-red/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-red dark:bg-[#22223A] dark:text-carreta-eggshell" required />
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
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">{t("auth.signUp.phone")}</label>
                <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("auth.signUp.phonePlaceholder")} autoComplete="tel" className="w-full rounded-xl border-2 border-carreta-gold/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-gold dark:bg-[#22223A] dark:text-carreta-eggshell" />
              </div>
              <div>
                <label htmlFor="whatsapp" className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">{t("auth.signUp.whatsapp")}</label>
                <input id="whatsapp" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder={t("auth.signUp.whatsappPlaceholder")} autoComplete="tel" className="w-full rounded-xl border-2 border-carreta-gold/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-gold dark:bg-[#22223A] dark:text-carreta-eggshell" />
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

          <div id="clerk-captcha" />
          <button type="submit" disabled={isSubmitting || !email || !password || !name} className="carreta-btn flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold disabled:opacity-50">
            {isSubmitting ? <><CarretaWheel size={18} animated /> {t("auth.signUp.submitting")}</> : t("auth.signUp.submit")}
          </button>
          <p className="text-center text-xs text-[#1A1A2E]/50 dark:text-carreta-eggshell/50">{t("auth.signUp.terms")}</p>
        </form>
      )}
    </div>
  );
}
