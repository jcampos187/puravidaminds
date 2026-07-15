import type { Locale, TranslationValue } from "./types";

const artisans: Record<string, Record<Locale, TranslationValue>> = {
  // ─── Artisans Listing ──────────────────────────────────────
  "artisans.title": {
    en: "Our Artisans",
    es: "Nuestros Artesanos",
  },
  "artisans.subtitle": {
    en: "Meet the master craftspeople behind every piece. Each artisan brings generations of tradition, skill, and Costa Rican pride to their work.",
    es: "Conoce a los maestros artesanos detrás de cada pieza. Cada artesano aporta generaciones de tradición, habilidad y orgullo costarricense a su trabajo.",
  },
  "artisans.empty": {
    en: "No artisans yet",
    es: "Aún no hay artesanos",
  },
  "artisans.emptySub": {
    en: "Be the first to join our community of Costa Rican craftspeople.",
    es: "Sé el primero en unirte a nuestra comunidad de artesanos costarricenses.",
  },
  "artisans.count": {
    en: (n: string) => `Showing ${n} ${n === "1" ? "artisan" : "artisans"}`,
    es: (n: string) => `Mostrando ${n} ${n === "1" ? "artesano" : "artesanos"}`,
  },

  // ─── Artisan Profile ───────────────────────────────────────
  "artisan.noProducts": {
    en: "No products listed yet.",
    es: "Aún no hay productos listados.",
  },
  "artisan.contact": {
    en: "Contact",
    es: "Contacto",
  },
  "artisan.verified": {
    en: "✓ Verified Artisan",
    es: "✓ Artesano Verificado",
  },
  "artisan.artesanias": {
    en: "Artesanías",
    es: "Artesanías",
  },
  "artisan.whatsapp": {
    en: "WhatsApp",
    es: "WhatsApp",
  },
  "artisan.facebook": {
    en: "Facebook",
    es: "Facebook",
  },
  "artisan.email": {
    en: "Email",
    es: "Correo",
  },

  // ─── ArtisanCard ──────────────────────────────────────────
  "artisanCard.artesania": {
    en: (n: string) => `${n} ${n === "1" ? "artesanía" : "artesanías"}`,
    es: (n: string) => `${n} ${n === "1" ? "artesanía" : "artesanías"}`,
  },
  "artisanCard.fallbackName": {
    en: "Artisan",
    es: "Artesano",
  },
};

export default artisans;
