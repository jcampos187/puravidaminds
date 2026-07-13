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

  // ─── Sign-Up Form ──────────────────────────────────────────
  "auth.signUp.error": {
    en: "Something went wrong",
    es: "Algo salió mal",
  },
  "auth.signUp.account": {
    en: "Account",
    es: "Cuenta",
  },
  "auth.signUp.fullName": {
    en: "Full Name",
    es: "Nombre Completo",
  },
  "auth.signUp.fullNamePlaceholder": {
    en: "Your name",
    es: "Tu nombre",
  },
  "auth.signUp.email": {
    en: "Email",
    es: "Correo Electrónico",
  },
  "auth.signUp.emailPlaceholder": {
    en: "your@email.com",
    es: "tu@correo.com",
  },
  "auth.signUp.password": {
    en: "Password",
    es: "Contraseña",
  },
  "auth.signUp.passwordPlaceholder": {
    en: "At least 8 characters",
    es: "Al menos 8 caracteres",
  },
  "auth.signUp.confirmPassword": {
    en: "Confirm Password",
    es: "Confirmar Contraseña",
  },
  "auth.signUp.confirmPasswordPlaceholder": {
    en: "Repeat your password",
    es: "Repite tu contraseña",
  },
  "auth.signUp.passwordMismatch": {
    en: "Passwords do not match",
    es: "Las contraseñas no coinciden",
  },
  "auth.signUp.passwordStrength": {
    en: "Password must contain:",
    es: "La contraseña debe contener:",
  },
  "auth.signUp.passwordMinLength": {
    en: "At least 8 characters",
    es: "Al menos 8 caracteres",
  },
  "auth.signUp.passwordUpper": {
    en: "One uppercase letter",
    es: "Una letra mayúscula",
  },
  "auth.signUp.passwordLower": {
    en: "One lowercase letter",
    es: "Una letra minúscula",
  },
  "auth.signUp.passwordNumber": {
    en: "One number",
    es: "Un número",
  },
  "auth.signUp.passwordSpecial": {
    en: "One special character",
    es: "Un carácter especial",
  },
  "auth.signUp.showPassword": {
    en: "Show password",
    es: "Mostrar contraseña",
  },
  "auth.signUp.hidePassword": {
    en: "Hide password",
    es: "Ocultar contraseña",
  },
  "auth.signUp.serverValidationError": {
    en: "Server validation unavailable. Please try again.",
    es: "Validación del servidor no disponible. Intenta de nuevo.",
  },
  "auth.signUp.serverValidationFailed": {
    en: "Password is not strong enough. Please check the requirements.",
    es: "La contraseña no es lo suficientemente segura. Revisa los requisitos.",
  },
  "auth.signUp.timeout": {
    en: "The request timed out. Please check your internet connection and try again.",
    es: "La solicitud tardó demasiado. Verifica tu conexión a internet e inténtalo de nuevo.",
  },
  "auth.signUp.emailSendFailed": {
    en: "Failed to send verification email. Please check your email address and try again.",
    es: "No se pudo enviar el correo de verificación. Verifica tu dirección de correo e inténtalo de nuevo.",
  },
  "auth.signUp.artisanProfile": {
    en: "Artisan Profile",
    es: "Perfil de Artesano",
  },
  "auth.signUp.artisanProfileHint": {
    en: "Required fields so customers can learn about you and contact you.",
    es: "Campos obligatorios para que los clientes te conozcan y te contacten.",
  },
  "auth.signUp.businessName": {
    en: "Business Name",
    es: "Nombre del Negocio",
  },
  "auth.signUp.businessNamePlaceholder": {
    en: "e.g. Artesanías de Sarchí",
    es: "ej. Artesanías de Sarchí",
  },
  "auth.signUp.phone": {
    en: "Phone",
    es: "Teléfono",
  },
  "auth.signUp.phonePlaceholder": {
    en: "+506 8888 8888",
    es: "+506 8888 8888",
  },
  "auth.signUp.whatsapp": {
    en: "WhatsApp",
    es: "WhatsApp",
  },
  "auth.signUp.whatsappPlaceholder": {
    en: "+506 8888 9999",
    es: "+506 8888 9999",
  },
  "auth.signUp.website": {
    en: "Website",
    es: "Sitio Web",
  },
  "auth.signUp.websitePlaceholder": {
    en: "https://myartesanias.com",
    es: "https://miartesania.com",
  },
  "auth.signUp.instagram": {
    en: "Instagram",
    es: "Instagram",
  },
  "auth.signUp.instagramPlaceholder": {
    en: "@misartesanias",
    es: "@misartesanias",
  },
  "auth.signUp.facebook": {
    en: "Facebook",
    es: "Facebook",
  },
  "auth.signUp.facebookPlaceholder": {
    en: "https://facebook.com/...",
    es: "https://facebook.com/...",
  },
  "auth.signUp.bio": {
    en: "Bio",
    es: "Biografía",
  },
  "auth.signUp.bioPlaceholder": {
    en: "Tell us about yourself and your craft...",
    es: "Cuéntanos sobre ti y tu arte...",
  },
  "auth.signUp.submit": {
    en: "Create Account & Join",
    es: "Crear Cuenta y Unirse",
  },
  "auth.signUp.submitting": {
    en: "Creating account...",
    es: "Creando cuenta...",
  },
  "auth.signUp.terms": {
    en: "By signing up, you agree to our Terms and Privacy Policy.",
    es: "Al registrarte, aceptas nuestros Términos y Política de Privacidad.",
  },
  "auth.signUp.acceptTerms": {
    en: "I have read and accept the",
    es: "He leído y acepto los",
  },
  "auth.signUp.termsLink": {
    en: "Terms & Conditions",
    es: "Términos y Condiciones",
  },
  "auth.signUp.privacyLink": {
    en: "Privacy Policy",
    es: "Política de Privacidad",
  },
  "auth.signUp.and": {
    en: "and the",
    es: "y la",
  },

  // ─── Verification ──────────────────────────────────────────
  "auth.verify.title": {
    en: "Verification Code",
    es: "Código de Verificación",
  },
  "auth.verify.sent": {
    en: (email: string) => `We sent a verification code to ${email}`,
    es: (email: string) => `Enviamos un código de verificación a ${email}`,
  },
  "auth.verify.placeholder": {
    en: "Enter the 6-digit code",
    es: "Ingresa el código de 6 dígitos",
  },
  "auth.verify.submit": {
    en: "Verify & Complete",
    es: "Verificar y Completar",
  },
  "auth.verify.submitting": {
    en: "Verifying...",
    es: "Verificando...",
  },
  "auth.verify.back": {
    en: "← Back to sign-up",
    es: "← Volver al registro",
  },

  // ─── Complete ──────────────────────────────────────────────
  "auth.complete.title": {
    en: "Welcome to Pura Vida Minds!",
    es: "¡Bienvenido a Pura Vida Minds!",
  },
  "auth.complete.redirect": {
    en: "Redirecting to your dashboard...",
    es: "Redirigiendo a tu panel...",
  },
};

export default auth;
