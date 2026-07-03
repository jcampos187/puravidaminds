import type { Locale, TranslationValue } from "./types";

const auth: Record<string, Record<Locale, TranslationValue>> = {
  // ─── Auth ──────────────────────────────────────────────────
  "auth.signIn.title": {
    en: "Welcome Back",
    es: "Bienvenido de Nuevo",
  },
  "auth.signIn.sub": {
    en: "Sign in to manage your artesanías and connect with buyers.",
    es: "Inicia sesión para gestionar tus artesanías y conectar con compradores.",
  },
  "auth.signUp.title": {
    en: "Join Pura Vida Artesanías",
    es: "Únete a Pura Vida Artesanías",
  },
  "auth.signUp.sub": {
    en: "Create an account to start selling your authentic Costa Rican crafts.",
    es: "Crea una cuenta para empezar a vender tus artesanías costarricenses auténticas.",
  },
  "auth.signUp.artisan": {
    en: "Create your artisan profile and share your work with the world.",
    es: "Crea tu perfil de artesano y comparte tu trabajo con el mundo.",
  },
};

export default auth;
