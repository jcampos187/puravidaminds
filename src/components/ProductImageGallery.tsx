"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

const ZOOM_STEP = 0.75;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

export default function ProductImageGallery({
  images,
  productTitle,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
    setZoom(1);
    setDragOffset({ x: 0, y: 0 });
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoom(1);
    setDragOffset({ x: 0, y: 0 });
  }, [images.length]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setZoom(1);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setZoom(1);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => {
      const next = Math.max(prev - ZOOM_STEP, MIN_ZOOM);
      if (next === MIN_ZOOM) setDragOffset({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  // Gallery arrow-key navigation (always active)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) return; // modal has its own handler

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
  }, [isModalOpen, goToNext, goToPrev]);

  // Modal keyboard shortcuts (only when open)
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        zoomIn();
      } else if (e.key === "-") {
        e.preventDefault();
        zoomOut();
      } else if (e.key === "0") {
        e.preventDefault();
        resetZoom();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, closeModal, goToNext, goToPrev, zoomIn, zoomOut, resetZoom]);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Drag handlers for panning when zoomed
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
  }, [zoom, dragOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Refs for touch handlers (avoid stale closures reading state)
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const dragOffsetRef = useRef(dragOffset);
  dragOffsetRef.current = dragOffset;
  const dragStartRef = useRef(dragStart);
  dragStartRef.current = dragStart;
  const isDraggingRef = useRef(isDragging);
  isDraggingRef.current = isDragging;
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const touchSwipedRef = useRef(false);
  const pinchRef = useRef({ initialDist: 0, initialZoom: 1, active: false });

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }, [zoomIn, zoomOut]);

  // ── Touch handlers (swipe + pinch) ──────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Two-finger pinch — record initial distance and zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = {
        initialDist: Math.sqrt(dx * dx + dy * dy),
        initialZoom: zoomRef.current,
        active: true,
      };
      touchSwipedRef.current = true; // block swipe
      return;
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
      touchSwipedRef.current = false;

      if (zoomRef.current > 1) {
        // Zoomed in — start panning
        setIsDragging(true);
        isDraggingRef.current = true;
        setDragStart({
          x: touch.clientX - dragOffsetRef.current.x,
          y: touch.clientY - dragOffsetRef.current.y,
        });
      }
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (pinchRef.current.active && e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const scale = dist / pinchRef.current.initialDist;
      const newZoom = Math.min(
        Math.max(pinchRef.current.initialZoom * scale, MIN_ZOOM),
        MAX_ZOOM,
      );
      setZoom(newZoom);
      return;
    }

    if (zoomRef.current <= 1 && e.touches.length === 1) {
      // Not zoomed — track horizontal swipe distance
      e.preventDefault();
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      if (Math.abs(dx) > 10) {
        touchSwipedRef.current = true;
      }
      return;
    }

    if (zoomRef.current > 1 && isDraggingRef.current && e.touches.length === 1) {
      // Zoomed in — pan with one finger
      e.preventDefault();
      const touch = e.touches[0];
      setDragOffset({
        x: touch.clientX - dragStartRef.current.x,
        y: touch.clientY - dragStartRef.current.y,
      });
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    pinchRef.current.active = false;

    if (zoomRef.current <= 1 && e.changedTouches.length === 1 && touchSwipedRef.current) {
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const elapsed = Date.now() - touchStartRef.current.time;
      const velocity = Math.abs(dx) / Math.max(elapsed, 1);

      // Navigate if the swipe is fast enough or far enough
      const isHorizontal = Math.abs(dx) > Math.abs(dy) * 1.5;
      const isFarEnough = Math.abs(dx) > 50;
      const isFastEnough = velocity > 0.3 && Math.abs(dx) > 20;

      if (isHorizontal && (isFarEnough || isFastEnough)) {
        if (dx > 0) {
          goToPrev();
        } else {
          goToNext();
        }
      }
    }

    if (zoomRef.current > 1) {
      setIsDragging(false);
    }

    touchSwipedRef.current = false;
  }, [goToNext, goToPrev]);

  // Prevent native touch scrolling/zooming on the image area
  const touchContainerStyle: React.CSSProperties = {
    touchAction: "none",
  };

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border-2 border-carreta-red/20 bg-carreta-eggshell/50">
        <CarretaWheel size={120} variant="outline" className="opacity-30" />
      </div>
    );
  }

  return (
    <>
      {/* ─── Gallery ─────────────────────────────────────── */}
      <div>
        {/* Main image — clickable */}
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-carreta-red/20 bg-carreta-eggshell/50 cursor-zoom-in group"
          onClick={openModal}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(); } }}
          aria-label={`${productTitle} — click to enlarge`}
        >
          <Image
            src={images[selectedIndex].url}
            alt={images[selectedIndex].altText || `${productTitle} image ${selectedIndex + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-4 transition-opacity duration-300"
          />

          {/* Hover hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="rounded-full bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <svg className="mr-1.5 inline-block h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              Click to enlarge
            </span>
          </div>

          {/* Left/Right nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#1A1A2E] shadow-md opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm dark:bg-[#1A1A2E]/80 dark:text-carreta-eggshell"
                aria-label="Previous image"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
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
                onClick={() => { setSelectedIndex(i); setZoom(1); setDragOffset({ x: 0, y: 0 }); }}
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

      {/* ─── Lightbox Modal ──────────────────────────────── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={`${productTitle} image lightbox`}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Zoom controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 rounded-full bg-white/10 px-4 py-2.5 backdrop-blur-md">
            <button
              onClick={(e) => { e.stopPropagation(); zoomOut(); }}
              disabled={zoom <= MIN_ZOOM}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Zoom out"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
            </button>

            <span className="min-w-[3rem] text-center text-xs font-medium text-white/80 tabular-nums">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={(e) => { e.stopPropagation(); zoomIn(); }}
              disabled={zoom >= MAX_ZOOM}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Zoom in"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>

            <div className="mx-1 h-5 w-px bg-white/20" />

            <button
              onClick={(e) => { e.stopPropagation(); resetZoom(); }}
              disabled={zoom <= MIN_ZOOM}
              className="flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Reset zoom"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              1:1
            </button>
          </div>

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all opacity-60 hover:opacity-100 backdrop-blur-sm"
                aria-label="Previous image"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all opacity-60 hover:opacity-100 backdrop-blur-sm"
                aria-label="Next image"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image counter in modal */}
          {images.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          )}

          {/* Image container */}
          <div
            className="relative flex h-full w-full items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={imageRef}
              className={`relative h-full w-full select-none ${
                zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""
              }`}
              style={{
                transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                transition: isDragging ? "none" : "transform 0.2s ease-out",
                ...touchContainerStyle,
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="relative h-full w-full"
                style={{
                  transform: `scale(${zoom})`,
                  transition: isDragging ? "none" : "transform 0.25s ease-out",
                }}
              >
                <Image
                  src={images[selectedIndex].url}
                  alt={images[selectedIndex].altText || `${productTitle} image ${selectedIndex + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain p-4 md:p-8"
                  priority
                  quality={90}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
