"use client";

import { useState, useEffect, FormEvent } from "react";
import { useTranslations } from "@/i18n/useTranslations";
import CarretaWheel from "./CarretaWheel";

export default function ContactForm() {
  const { t } = useTranslations();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // After showing success for 4 seconds, reset the form so user can send again
  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => setStatus("idle"), 4000);
    return () => clearTimeout(timer);
  }, [status]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || t("contact.form.error"));
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMsg(t("contact.form.error"));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {status === "success" ? (
        <div className="rounded-xl border-2 border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400">
          {t("contact.form.success")}
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="mb-1 block text-xs font-medium text-carreta-eggshell/70">
                {t("contact.form.name")} <span className="text-carreta-red">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-carreta-eggshell/20 bg-white/10 px-3 py-2 text-sm text-carreta-eggshell placeholder-carreta-eggshell/40 outline-none transition-all focus:border-carreta-gold"
                placeholder={t("contact.form.namePlaceholder")}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1 block text-xs font-medium text-carreta-eggshell/70">
                {t("contact.form.email")} <span className="text-carreta-red">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-carreta-eggshell/20 bg-white/10 px-3 py-2 text-sm text-carreta-eggshell placeholder-carreta-eggshell/40 outline-none transition-all focus:border-carreta-gold"
                placeholder={t("contact.form.emailPlaceholder")}
              />
            </div>
          </div>
          <div>
            <label htmlFor="contact-subject" className="mb-1 block text-xs font-medium text-carreta-eggshell/70">
              {t("contact.form.subject")}
            </label>
            <input
              id="contact-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-carreta-eggshell/20 bg-white/10 px-3 py-2 text-sm text-carreta-eggshell placeholder-carreta-eggshell/40 outline-none transition-all focus:border-carreta-gold"
              placeholder={t("contact.form.subjectPlaceholder")}
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-1 block text-xs font-medium text-carreta-eggshell/70">
              {t("contact.form.message")} <span className="text-carreta-red">*</span>
            </label>
            <textarea
              id="contact-message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full rounded-lg border border-carreta-eggshell/20 bg-white/10 px-3 py-2 text-sm text-carreta-eggshell placeholder-carreta-eggshell/40 outline-none transition-all focus:border-carreta-gold resize-none"
              placeholder={t("contact.form.messagePlaceholder")}
            />
          </div>

          {status === "error" && (
            <div className="rounded-lg border border-red-200 bg-red-50/10 px-3 py-2 text-xs text-red-400">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-carreta-red py-2 text-sm font-semibold text-white transition-colors hover:bg-carreta-red/90 disabled:opacity-50"
          >
            {status === "sending" ? (
              <><CarretaWheel size={16} animated /> {t("contact.form.sending")}</>
            ) : (
              t("contact.form.submit")
            )}
          </button>
        </>
      )}
    </form>
  );
}
