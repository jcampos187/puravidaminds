"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";
import { UploadButton } from "@/lib/uploadthing";
import CarretaWheel from "@/components/CarretaWheel";
import { useTranslations } from "@/i18n/useTranslations";

interface ProfileFormProps {
  initialData?: {
    businessName: string | null;
    bio: string | null;
    location: string | null;
    phone: string | null;
    whatsapp: string | null;
    website: string | null;
    instagram: string | null;
    facebook: string | null;
    coverImageUrl: string | null;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const { signOut } = useClerk();
  const { t } = useTranslations();
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    initialData?.coverImageUrl || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const form = new FormData(e.currentTarget);
    const data = {
      businessName: form.get("businessName") as string,
      bio: form.get("bio") as string,
      location: form.get("location") as string,
      phone: form.get("phone") as string,
      whatsapp: form.get("whatsapp") as string,
      website: form.get("website") as string,
      instagram: form.get("instagram") as string,
      facebook: form.get("facebook") as string,
      coverImageUrl,
    };

    try {
      const res = await fetch("/api/artisan-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t("profileForm.error.save"));
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("profileForm.error.generic"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-xl border-2 border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border-2 border-green-200 bg-green-50 px-6 py-4 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400">
          {t("profileForm.success")}
        </div>
      )}

      {/* Cover Image */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">
          {t("profileForm.cover.label")}
        </label>
        <div className="rounded-xl border-2 border-dashed border-carreta-red/20 bg-white p-6 dark:bg-[#22223A]">
          <UploadButton
            endpoint="artisanCover"
            onClientUploadComplete={(res) => {
              if (res?.[0]) setCoverImageUrl(res[0].url);
            }}
            onUploadError={(err) => setError(err.message)}
            appearance={{
              button:
                "carreta-btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold",
              allowedContent:
                "mt-2 text-xs text-[#1A1A2E]/50 dark:text-carreta-eggshell/50",
            }}
          />

          {coverImageUrl && (
            <div className="relative mt-4 h-40">
              <Image
                src={coverImageUrl}
                alt={t("accessibility.coverPreview")}
                fill
                sizes="100vw"
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Business Name */}
      <div>
        <label
          htmlFor="businessName"
          className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell"
        >
          {t("profileForm.businessName.label")}
        </label>
        <input
          id="businessName"
          name="businessName"
          type="text"
          defaultValue={initialData?.businessName || ""}
          placeholder={t("profileForm.businessName.placeholder")}
          className="w-full rounded-xl border-2 border-carreta-red/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-red dark:bg-[#22223A] dark:text-carreta-eggshell"
        />
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor="location"
          className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell"
        >
          {t("profileForm.location.label")}
        </label>
        <input
          id="location"
          name="location"
          type="text"
          defaultValue={initialData?.location || ""}
          placeholder={t("profileForm.location.placeholder")}
          className="w-full rounded-xl border-2 border-carreta-red/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-red dark:bg-[#22223A] dark:text-carreta-eggshell"
        />
      </div>

      {/* Bio (required) */}
      <div>
        <label
          htmlFor="bio"
          className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell"
        >
          {t("profileForm.bio.label")} *
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          required
          defaultValue={initialData?.bio || ""}
          placeholder={t("profileForm.bio.placeholder")}
          className="w-full rounded-xl border-2 border-carreta-red/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-red dark:bg-[#22223A] dark:text-carreta-eggshell"
        />
      </div>

      {/* Contact Info Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell"
          >
            {t("profileForm.phone.label")} *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            defaultValue={initialData?.phone || ""}
            placeholder="+506 8888 8888"
            className="w-full rounded-xl border-2 border-carreta-red/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-red dark:bg-[#22223A] dark:text-carreta-eggshell"
          />
        </div>

        <div>
          <label
            htmlFor="whatsapp"
            className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell"
          >
            {t("profileForm.whatsapp.label")} *
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            required
            defaultValue={initialData?.whatsapp || ""}
            placeholder="+506 8888 9999"
            className="w-full rounded-xl border-2 border-carreta-red/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-red dark:bg-[#22223A] dark:text-carreta-eggshell"
          />
        </div>

        <div>
          <label
            htmlFor="website"
            className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell"
          >
            {t("profileForm.website.label")}
          </label>
          <input
            id="website"
            name="website"
            type="url"
            defaultValue={initialData?.website || ""}
            placeholder="https://myartesanias.com"
            className="w-full rounded-xl border-2 border-carreta-red/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-red dark:bg-[#22223A] dark:text-carreta-eggshell"
          />
        </div>

        <div>
          <label
            htmlFor="instagram"
            className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell"
          >
            {t("profileForm.instagram.label")}
          </label>
          <input
            id="instagram"
            name="instagram"
            type="text"
            defaultValue={initialData?.instagram || ""}
            placeholder="e.g. @misartesanias"
            className="w-full rounded-xl border-2 border-carreta-red/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-red dark:bg-[#22223A] dark:text-carreta-eggshell"
          />
        </div>

        <div>
          <label
            htmlFor="facebook"
            className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell"
          >
            {t("profileForm.facebook.label")}
          </label>
          <input
            id="facebook"
            name="facebook"
            type="url"
            defaultValue={initialData?.facebook || ""}
            placeholder="https://facebook.com/misartesanias"
            className="w-full rounded-xl border-2 border-carreta-red/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-red dark:bg-[#22223A] dark:text-carreta-eggshell"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="carreta-btn inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold disabled:opacity-50"
        >
          {isSubmitting ? t("profileForm.submit.saving") : t("profileForm.submit.save")}
          {!isSubmitting && <CarretaWheel size={18} variant="outline" />}
        </button>
        <Link
          href="/dashboard"
          className="text-sm text-[#1A1A2E]/60 hover:text-carreta-red dark:text-carreta-eggshell/60 dark:hover:text-carreta-gold"
        >
          {t("profileForm.cancel")}
        </Link>
      </div>

      {/* ── Danger Zone: Delete Account ── */}
      <hr className="my-10 border-carreta-red/20" />
      <DeleteAccountSection signOut={signOut} />
    </form>
  );
}

function DeleteAccountSection({ signOut }: { signOut: () => Promise<void> }) {
  const { t } = useTranslations();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/account/delete", { method: "POST" });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete account");
      }

      setDeleted(true);
      // Sign out after a brief delay so the user sees the success message
      setTimeout(() => signOut(), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsDeleting(false);
    }
  }

  if (deleted) {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950/30">
        <p className="text-sm font-medium text-green-700 dark:text-green-400">
          {t("account.delete.success")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-6 dark:border-red-900 dark:bg-red-950/20">
      <h3 className="text-sm font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
        {t("account.delete.title")}
      </h3>
      <p className="mb-4 mt-2 text-sm text-red-700/70 dark:text-red-400/70">
        {t("account.delete.description")}
      </p>

      {!showConfirm ? (
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="rounded-full border-2 border-red-400 px-6 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          {t("account.delete.button")}
        </button>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">
            {t("account.delete.confirm")}
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={t("account.delete.placeholder")}
            className="w-full rounded-xl border-2 border-red-300 bg-white px-5 py-3 text-sm text-[#1A1A2E] outline-none transition-all focus:border-red-500 dark:bg-[#22223A] dark:text-carreta-eggshell"
          />
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={confirmText !== "DELETE" || isDeleting}
              onClick={handleDelete}
              className="rounded-full bg-red-600 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting
                ? t("account.delete.deleting")
                : t("account.delete.confirmButton")}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowConfirm(false);
                setConfirmText("");
                setError(null);
              }}
              className="text-sm text-[#1A1A2E]/60 hover:text-carreta-red dark:text-carreta-eggshell/60 dark:hover:text-carreta-gold"
            >
              {t("account.delete.cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
