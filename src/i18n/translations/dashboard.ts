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
  // ─── Account Deletion ────────────────────────────────────────
  "account.delete.title": {
    en: "Danger Zone",
    es: "Zona de Peligro",
  },
  "account.delete.description": {
    en: "Once you delete your account, there is no going back. Please be certain.",
    es: "Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate.",
  },
  "account.delete.button": {
    en: "Delete Account",
    es: "Eliminar Cuenta",
  },
  "account.delete.confirm": {
    en: "Type DELETE to confirm:",
    es: "Escribe DELETE para confirmar:",
  },
  "account.delete.placeholder": {
    en: "Type DELETE to confirm",
    es: "Escribe DELETE para confirmar",
  },
  "account.delete.confirmButton": {
    en: "Permanently Delete",
    es: "Eliminar Permanentemente",
  },
  "account.delete.deleting": {
    en: "Deleting...",
    es: "Eliminando...",
  },
  "account.delete.cancel": {
    en: "Cancel",
    es: "Cancelar",
  },
  "account.delete.success": {
    en: "Your account has been deleted. You will be signed out momentarily.",
    es: "Tu cuenta ha sido eliminada. Serás redirigido en un momento.",
  },
  "dashboard.profile": {
    en: "Artisan Profile",
    es: "Perfil de Artesano",
  },
  "dashboard.profile.sub": {
    en: "Set up your artisan profile to start selling on Pura Vida Artesanías.",
    es: "Configura tu perfil de artesano para empezar a vender en Pura Vida Artesanías.",
  },
  "dashboard.profile.setup": {
    en: "Fill in your details below — it only takes a minute!",
    es: "Completa tus datos a continuación — ¡solo te tomará un minuto!",
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
  "dashboard.table.delete": {
    en: "Delete",
    es: "Eliminar",
  },
  "dashboard.delete.title": {
    en: "Delete Product",
    es: "Eliminar Producto",
  },
  "dashboard.delete.confirm": {
    en: (title: string) => `Are you sure you want to delete "${title}"? This action cannot be undone.`,
    es: (title: string) => `¿Estás seguro de que deseas eliminar "${title}"? Esta acción no se puede deshacer.`,
  },
  "dashboard.delete.button": {
    en: "Delete",
    es: "Eliminar",
  },
  "dashboard.delete.cancel": {
    en: "Cancel",
    es: "Cancelar",
  },
  "dashboard.delete.deleting": {
    en: "Deleting...",
    es: "Eliminando...",
  },
  "dashboard.delete.success": {
    en: "Product deleted successfully",
    es: "Producto eliminado exitosamente",
  },
  "dashboard.delete.error": {
    en: "Failed to delete product",
    es: "Error al eliminar el producto",
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

  // ─── Admin ───────────────────────────────────────────────────
  "admin.title": {
    en: "Admin Dashboard",
    es: "Panel de Administración",
  },
  "admin.subtitle": {
    en: "Review and manage artisans and products.",
    es: "Revisa y gestiona artesanos y productos.",
  },
  "admin.nav.pending": {
    en: "Pending Reviews",
    es: "Revisiones Pendientes",
  },
  "admin.nav.artisans": {
    en: "Artisan Approvals",
    es: "Aprobaciones de Artesanos",
  },
  "admin.nav.products": {
    en: "Product Approvals",
    es: "Aprobaciones de Productos",
  },
  "admin.nav.analytics": {
    en: "Analytics",
    es: "Analíticas",
  },
  "admin.pendingArtisans": {
    en: "Pending Artisan Applications",
    es: "Solicitudes de Artesanos Pendientes",
  },
  "admin.pendingProducts": {
    en: "Pending Product Reviews",
    es: "Revisiones de Productos Pendientes",
  },
  "admin.noPendingArtisans": {
    en: "No pending artisan applications.",
    es: "No hay solicitudes de artesanos pendientes.",
  },
  "admin.noPendingProducts": {
    en: "No pending product reviews.",
    es: "No hay revisiones de productos pendientes.",
  },
  "admin.approve": {
    en: "Approve",
    es: "Aprobar",
  },
  "admin.decline": {
    en: "Decline",
    es: "Rechazar",
  },
  "admin.approved": {
    en: "Approved",
    es: "Aprobado",
  },
  "admin.declined": {
    en: "Declined",
    es: "Rechazado",
  },
  "admin.approveArtisan": {
    en: "Approve Artisan",
    es: "Aprobar Artesano",
  },
  "admin.declineArtisan": {
    en: "Decline Artisan",
    es: "Rechazar Artesano",
  },
  "admin.approveProduct": {
    en: "Approve Product",
    es: "Aprobar Producto",
  },
  "admin.declineProduct": {
    en: "Decline Product",
    es: "Rechazar Producto",
  },
  "admin.backToDashboard": {
    en: "← Back to Admin Dashboard",
    es: "← Volver al Panel de Admin",
  },
  "admin.goToDashboard": {
    en: "Go to Admin Dashboard",
    es: "Ir al Panel de Admin",
  },
  "admin.table.artisan": {
    en: "Artisan",
    es: "Artesano",
  },
  "admin.table.email": {
    en: "Email",
    es: "Correo",
  },
  "admin.table.business": {
    en: "Business",
    es: "Negocio",
  },
  "admin.table.submitted": {
    en: "Submitted",
    es: "Enviado",
  },
  "admin.table.status": {
    en: "Status",
    es: "Estado",
  },
  "admin.table.product": {
    en: "Product",
    es: "Producto",
  },
  "admin.table.artisanName": {
    en: "Artisan",
    es: "Artesano",
  },
  "admin.review": {
    en: "Review",
    es: "Revisar",
  },
  "product.status.pending": {
    en: "Pending",
    es: "Pendiente",
  },
};

export default dashboard;
