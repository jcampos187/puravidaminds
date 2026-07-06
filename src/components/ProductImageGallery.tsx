"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import CarretaWheel from "./CarretaWheel";

interface ProductImage {
  url: string;
  altText: string | null;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productTitle: string;
}

export default function ProductImageGallery({
  images,
  productTitle,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border-2 border-carreta-red/20 bg-carreta-eggshell/50">
        <CarretaWheel size={120} variant="outline" className="opacity-30" />
      </div>
    );
  }

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-carreta-red/20 bg-carreta-eggshell/50">
        <Image
          src={images[selectedIndex].url}
          alt={images[selectedIndex].altText || `${productTitle} image ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-4 transition-opacity duration-300"
        />

        {/* Left/Right nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#1A1A2E] shadow-md opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm dark:bg-[#1A1A2E]/80 dark:text-carreta-eggshell"
              aria-label="Previous image"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#1A1A2E] shadow-md opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm dark:bg-[#1A1A2E]/80 dark:text-carreta-eggshell"
              aria-label="Next image"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail gallery */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={img.url}
              onClick={() => setSelectedIndex(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                i === selectedIndex
                  ? "border-carreta-red ring-2 ring-carreta-red/30"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText || `${productTitle} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <p className="mt-3 text-center text-xs text-[#1A1A2E]/50 dark:text-carreta-eggshell/50">
          {selectedIndex + 1} / {images.length}
        </p>
      )}
    </div>
  );
}
