"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/i18n/useTranslations";

interface DeleteProductButtonProps {
  productId: string;
  productTitle: string;
}

export default function DeleteProductButton({
  productId,
  productTitle,
}: DeleteProductButtonProps) {
  const router = useRouter();
  const { t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = useCallback(() => {
    setIsOpen(true);
    setError(null);
  }, []);

  const closeModal = useCallback(() => {
    if (!isDeleting) {
      setIsOpen(false);
      setError(null);
    }
  }, [isDeleting]);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t("dashboard.delete.error"));
      }

      setIsOpen(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("dashboard.delete.error"),
      );
      setIsDeleting(false);
    }
  }, [productId, router, t]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  return (
    <>
      {/* Delete button */}
      <button
        type="button"
        onClick={openModal}
        className="text-sm font-medium text-carreta-red/70 transition-colors hover:text-carreta-red"
      >
        {t("dashboard.table.delete")}
      </button>

      {/* Confirmation modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={t("dashboard.delete.title")}
        >
          <div
            className="mx-4 w-full max-w-md rounded-2xl border-2 border-carreta-red/20 bg-white p-6 shadow-2xl dark:bg-[#22223A]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-carreta-red/10">
              <svg
                className="h-7 w-7 text-carreta-red"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>

            {/* Title */}
            <h3 className="mt-4 text-center text-lg font-bold text-[#1A1A2E] dark:text-carreta-eggshell">
              {t("dashboard.delete.title")}
            </h3>

            {/* Confirmation text */}
            <p className="mt-3 text-center text-sm leading-relaxed text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
              {t("dashboard.delete.confirm", productTitle)}
            </p>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={isDeleting}
                className="flex-1 rounded-full border-2 border-[#1A1A2E]/20 px-5 py-2.5 text-sm font-medium text-[#1A1A2E]/70 transition-all hover:bg-[#1A1A2E]/5 disabled:opacity-50 dark:border-carreta-eggshell/20 dark:text-carreta-eggshell/70 dark:hover:bg-carreta-eggshell/5"
              >
                {t("dashboard.delete.cancel")}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                autoFocus
                className="carreta-btn flex-1 rounded-full bg-carreta-red px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-carreta-red/90 disabled:opacity-50"
              >
                {isDeleting
                  ? t("dashboard.delete.deleting")
                  : t("dashboard.delete.button")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
