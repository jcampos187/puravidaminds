import type { Locale, TranslationValue } from "./types";

const common: Record<string, Record<Locale, TranslationValue>> = {
  // ─── Common ────────────────────────────────────────────────
  "site.name": {
    en: "Pura Vida Artesanías",
    es: "Pura Vida Artesanías",
  },
  "site.tagline": {
    en: "Authentic Costa Rican Handcrafts",
    es: "Artesanías Costarricenses Auténticas",
  },
  "site.description": {
    en: "Connecting the world with authentic Costa Rican craftsmanship. Every piece tells a story rooted in tradition, culture, and the Pura Vida spirit.",
    es: "Conectando el mundo con la artesanía costarricense auténtica. Cada pieza cuenta una historia arraigada en la tradición, la cultura y el espíritu Pura Vida.",
  },
  "site.footer.copyright": {
    en: "All rights reserved. Celebrating Costa Rican craftsmanship.",
    es: "Todos los derechos reservados. Celebrando la artesanía costarricense.",
  },

  // ─── Language ──────────────────────────────────────────────
  "language.switch": {
    en: "Español",
    es: "English",
  },
  "language.switchLabel": {
    en: "Switch to Spanish",
    es: "Cambiar a Inglés",
  },

  // ─── Nav ───────────────────────────────────────────────────
  "nav.home": {
    en: "Home",
    es: "Inicio",
  },
  "nav.browse": {
    en: "Browse Artesanías",
    es: "Explorar Artesanías",
  },
  "nav.artisans": {
    en: "Artisans",
    es: "Artesanos",
  },
  "nav.dashboard": {
    en: "My Dashboard",
    es: "Mi Panel",
  },
  "nav.signIn": {
    en: "Sign In",
    es: "Iniciar Sesión",
  },
  "nav.signOut": {
    en: "Sign Out",
    es: "Cerrar Sesión",
  },
  "nav.signUp": {
    en: "Join as Artisan",
    es: "Únete como Artesano",
  },
  "nav.joinAsArtisan": {
    en: "Join as an Artisan",
    es: "Únete como Artesano",
  },

  // ─── Footer ────────────────────────────────────────────────
  "footer.explore": {
    en: "Explore",
    es: "Explorar",
  },
  "footer.browse": {
    en: "Browse All Artesanías",
    es: "Ver Todas las Artesanías",
  },
  "footer.meetArtisans": {
    en: "Meet the Artisans",
    es: "Conoce a los Artesanos",
  },
  "footer.categories": {
    en: "Categories",
    es: "Categorías",
  },
  "footer.connect": {
    en: "Connect",
    es: "Conectar",
  },
  "footer.madeIn": {
    en: "Hecho en Costa Rica",
    es: "Hecho en Costa Rica",
  },
  "footer.terms": {
    en: "Terms & Conditions",
    es: "Términos y Condiciones",
  },
  "footer.privacy": {
    en: "Privacy Policy",
    es: "Política de Privacidad",
  },

  // ─── Accessibility ──────────────────────────────────────────
  "accessibility.carretaWheel": {
    en: "Carreta wheel",
    es: "Rueda de carreta",
  },
  "accessibility.coverPreview": {
    en: "Cover preview",
    es: "Vista previa de portada",
  },

  // ─── Mobile Menu ────────────────────────────────────────────
  "mobileMenu.open": {
    en: "Open menu",
    es: "Abrir menú",
  },
  "mobileMenu.close": {
    en: "Close menu",
    es: "Cerrar menú",
  },
  "mobileMenu.browseSub": {
    en: "Explore all artesanías",
    es: "Explorar todas las artesanías",
  },
  "mobileMenu.artisansSub": {
    en: "Meet our artisans",
    es: "Conoce a nuestros artesanos",
  },

  // ─── Theme ──────────────────────────────────────────────────
  "theme.light": {
    en: "Light Mode",
    es: "Modo Claro",
  },
  "theme.dark": {
    en: "Dark Mode",
    es: "Modo Oscuro",
  },
  "theme.switchToDark": {
    en: "Switch to dark mode",
    es: "Cambiar a modo oscuro",
  },
  "theme.switchToLight": {
    en: "Switch to light mode",
    es: "Cambiar a modo claro",
  },

  // ─── Contact Form ─────────────────────────────────────────
  "contact.form.name": {
    en: "Name",
    es: "Nombre",
  },
  "contact.form.namePlaceholder": {
    en: "Your name",
    es: "Tu nombre",
  },
  "contact.form.email": {
    en: "Email",
    es: "Correo",
  },
  "contact.form.emailPlaceholder": {
    en: "your@email.com",
    es: "tu@correo.com",
  },
  "contact.form.subject": {
    en: "Subject",
    es: "Asunto",
  },
  "contact.form.subjectPlaceholder": {
    en: "What is this about?",
    es: "¿Sobre qué trata?",
  },
  "contact.form.message": {
    en: "Message",
    es: "Mensaje",
  },
  "contact.form.messagePlaceholder": {
    en: "Tell us more...",
    es: "Cuéntanos más...",
  },
  "contact.form.submit": {
    en: "Send Message",
    es: "Enviar Mensaje",
  },
  "contact.form.sending": {
    en: "Sending...",
    es: "Enviando...",
  },
  "contact.form.success": {
    en: "✅ Message sent! We'll get back to you soon.",
    es: "✅ ¡Mensaje enviado! Te responderemos pronto.",
  },
  "contact.form.error": {
    en: "Something went wrong. Please try again.",
    es: "Algo salió mal. Por favor intenta de nuevo.",
  },
  "contact.form.footerHint": {
    en: "Send us a message — we'd love to hear from you:",
    es: "Envíanos un mensaje — nos encantaría saber de ti:",
  },
};

export default common;
