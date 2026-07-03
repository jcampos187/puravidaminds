import type { Locale, TranslationValue } from "./types";

const dashboard: Record<string, Record<Locale, TranslationValue>> = {
  // ─── Dashboard ─────────────────────────────────────────────
  "dashboard.title": {
    en: "My Dashboard",
    es: "Mi Panel",
  },
  "dashboard.welcome": {
    en: (name: string) => `Welcome back, ${name}!`,
    es: (name: string) => `¡Bienvenido de nuevo, ${name}!`,
  },
  "dashboard.subtitle.artisan": {
    en: "Manage your artisan profile and artesanías.",
    es: "Gestiona tu perfil de artesano y tus artesanías.",
  },
  "dashboard.subtitle.customer": {
    en: "Set up your artisan profile to start selling.",
    es: "Configura tu perfil de artesano para empezar a vender.",
  },
  "dashboard.stats.products": {
    en: "Products",
    es: "Productos",
  },
  "dashboard.stats.views": {
    en: "Profile Views",
    es: "Vistas de Perfil",
  },
  "dashboard.stats.inquiries": {
    en: "Inquiries",
    es: "Consultas",
  },
  "dashboard.stats.month": {
    en: "this month",
    es: "este mes",
  },
  "dashboard.quickActions": {
    en: "Quick Actions",
    es: "Acciones Rápidas",
  },
  "dashboard.addProduct": {
    en: "Add New Product",
    es: "Añadir Producto",
  },
  "dashboard.editProfile": {
    en: "Edit Profile",
    es: "Editar Perfil",
  },
  "dashboard.viewProducts": {
    en: "View My Products",
    es: "Ver Mis Productos",
  },
  "dashboard.recent": {
    en: "Recent Activity",
    es: "Actividad Reciente",
  },
  "dashboard.recent.empty": {
    en: "No recent activity. Start by adding your first product!",
    es: "Sin actividad reciente. ¡Empieza añadiendo tu primer producto!",
  },
  "dashboard.becomeArtisan": {
    en: "Become an Artisan",
    es: "Conviértete en Artesano",
  },
  "dashboard.becomeArtisan.sub": {
    en: "Set up your artisan profile to share your creations with the world.",
    es: "Configura tu perfil de artesano para compartir tus creaciones con el mundo.",
  },
  "dashboard.profile": {
    en: "Artisan Profile",
    es: "Perfil de Artesano",
  },
  "dashboard.profile.sub": {
    en: "Set up your artisan profile to start selling on Pura Vida Artesanías.",
    es: "Configura tu perfil de artesano para empezar a vender en Pura Vida Artesanías.",
  },
  "dashboard.stats.reviews": {
    en: "Reviews",
    es: "Reseñas",
  },

  // My Products page
  "dashboard.myProducts": {
    en: "My Artesanías",
    es: "Mis Artesanías",
  },
  "dashboard.myProducts.count": {
    en: (n: string) => `${n} product${n === "1" ? "" : "s"} listed`,
    es: (n: string) => `${n} producto${n === "1" ? "" : "s"} listados`,
  },
  "dashboard.noProducts": {
    en: "No products yet",
    es: "Aún no hay productos",
  },
  "dashboard.noProducts.sub": {
    en: "Start by adding your first artesanía.",
    es: "Empieza añadiendo tu primera artesanía.",
  },
  "dashboard.addFirstProduct": {
    en: "Add Your First Product",
    es: "Añade tu Primer Producto",
  },
  "dashboard.products.back": {
    en: "← Back to Dashboard",
    es: "← Volver al Panel",
  },
  "dashboard.table.product": {
    en: "Product",
    es: "Producto",
  },
  "dashboard.table.category": {
    en: "Category",
    es: "Categoría",
  },
  "dashboard.table.price": {
    en: "Price",
    es: "Precio",
  },
  "dashboard.table.status": {
    en: "Status",
    es: "Estado",
  },
  "dashboard.table.actions": {
    en: "Actions",
    es: "Acciones",
  },
  "dashboard.table.edit": {
    en: "Edit",
    es: "Editar",
  },

  // Edit/Add titles
  "edit.title": {
    en: "Edit Artesanía",
    es: "Editar Artesanía",
  },
  "add.title": {
    en: "Add New Artesanía",
    es: "Añadir Nueva Artesanía",
  },

  // ─── Product Form ──────────────────────────────────────────
  "productForm.title": {
    en: "New Artesanía",
    es: "Nueva Artesanía",
  },
  "productForm.editTitle": {
    en: "Edit Artesanía",
    es: "Editar Artesanía",
  },
  "productForm.sub": {
    en: "Share your creation with the world.",
    es: "Comparte tu creación con el mundo.",
  },
  "productForm.save": {
    en: "Save Artesanía",
    es: "Guardar Artesanía",
  },
  "productForm.cancel": {
    en: "Cancel",
    es: "Cancelar",
  },
  "productForm.loading": {
    en: "Saving...",
    es: "Guardando...",
  },
  "productForm.title.label": {
    en: "Product Title *",
    es: "Título del Producto *",
  },
  "productForm.title.placeholder": {
    en: "e.g. Hand-painted Carreta Miniature",
    es: "ej. Carreta Miniatura Pintada a Mano",
  },
  "productForm.desc.label": {
    en: "Description *",
    es: "Descripción *",
  },
  "productForm.desc.placeholder": {
    en: "Describe your artesanía — materials, dimensions, story behind it...",
    es: "Describe tu artesanía — materiales, dimensiones, historia...",
  },
  "productForm.price.label": {
    en: "Price (optional)",
    es: "Precio (opcional)",
  },
  "productForm.price.placeholder": {
    en: "e.g. 25000",
    es: "ej. 25000",
  },
  "productForm.currency.label": {
    en: "Currency",
    es: "Moneda",
  },
  "productForm.category.label": {
    en: "Category",
    es: "Categoría",
  },
  "productForm.category.placeholder": {
    en: "Select a category",
    es: "Selecciona una categoría",
  },
  "productForm.tags.label": {
    en: "Tags (comma-separated)",
    es: "Etiquetas (separadas por comas)",
  },
  "productForm.tags.placeholder": {
    en: "e.g. handpainted, wood, traditional, sarchi",
    es: "ej. pintadoamano, madera, tradicional, sarchi",
  },
  "productForm.status.label": {
    en: "Status",
    es: "Estado",
  },
  "productForm.status.active": {
    en: "Active — Visible on site",
    es: "Activo — Visible en el sitio",
  },
  "productForm.status.inactive": {
    en: "Inactive — Hidden from site",
    es: "Inactivo — Oculto del sitio",
  },
  "productForm.images.label": {
    en: "Product Images",
    es: "Imágenes del Producto",
  },
  "productForm.submit.publish": {
    en: "Publish Artesanía",
    es: "Publicar Artesanía",
  },
  "productForm.submit.update": {
    en: "Update Artesanía",
    es: "Actualizar Artesanía",
  },
  "productForm.error.save": {
    en: "Failed to save product",
    es: "Error al guardar el producto",
  },
  "productForm.error.generic": {
    en: "Something went wrong",
    es: "Algo salió mal",
  },

  // Profile Form
  "profileForm.cover.label": {
    en: "Cover Image",
    es: "Imagen de Portada",
  },
  "profileForm.businessName.label": {
    en: "Business Name",
    es: "Nombre del Negocio",
  },
  "profileForm.businessName.placeholder": {
    en: "e.g. Artesanías de Sarchí",
    es: "ej. Artesanías de Sarchí",
  },
  "profileForm.location.label": {
    en: "Location",
    es: "Ubicación",
  },
  "profileForm.location.placeholder": {
    en: "e.g. Sarchí, Alajuela",
    es: "ej. Sarchí, Alajuela",
  },
  "profileForm.bio.label": {
    en: "Bio",
    es: "Biografía",
  },
  "profileForm.bio.placeholder": {
    en: "Tell your story — your background, craft, traditions, and inspiration...",
    es: "Cuenta tu historia — tus orígenes, arte, tradiciones e inspiración...",
  },
  "profileForm.phone.label": {
    en: "Phone Number",
    es: "Teléfono",
  },
  "profileForm.whatsapp.label": {
    en: "WhatsApp Number",
    es: "Número de WhatsApp",
  },
  "profileForm.website.label": {
    en: "Website",
    es: "Sitio Web",
  },
  "profileForm.instagram.label": {
    en: "Instagram Handle",
    es: "Usuario de Instagram",
  },
  "profileForm.facebook.label": {
    en: "Facebook URL",
    es: "URL de Facebook",
  },
  "profileForm.submit.save": {
    en: "Save Profile",
    es: "Guardar Perfil",
  },
  "profileForm.submit.saving": {
    en: "Saving...",
    es: "Guardando...",
  },
  "profileForm.success": {
    en: "Profile saved successfully! 🎉",
    es: "¡Perfil guardado exitosamente! 🎉",
  },
  "profileForm.error.save": {
    en: "Failed to save profile",
    es: "Error al guardar el perfil",
  },
  "profileForm.error.generic": {
    en: "Something went wrong",
    es: "Algo salió mal",
  },
  "profileForm.cancel": {
    en: "Cancel",
    es: "Cancelar",
  },
};

export default dashboard;
