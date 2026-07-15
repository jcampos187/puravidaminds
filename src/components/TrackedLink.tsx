"use client";

import type { ReactNode, MouseEvent } from "react";

interface TrackedLinkProps {
  href: string;
  eventType: "whatsapp_click" | "facebook_click" | "instagram_click" | "website_click" | "phone_click";
  artisanId?: string | null;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
}

/**
 * Wraps an <a> tag with click tracking via sendBeacon.
 * Tracking is fire-and-forget — it never blocks navigation.
 */
export default function TrackedLink({
  href,
  eventType,
  artisanId,
  children,
  className,
  target,
  rel,
  "aria-label": ariaLabel,
}: TrackedLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Don't track if it's a modified click (middle click, ctrl+click etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    try {
      const payload = {
        eventType,
        target: href,
        pageUrl: window.location.pathname,
        artisanId: artisanId || null,
      };
      navigator.sendBeacon("/api/analytics/click", JSON.stringify(payload));
    } catch {
      // Fail silently
    }
  };

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={className}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
