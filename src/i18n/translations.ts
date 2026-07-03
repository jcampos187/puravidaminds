export type Locale = "en" | "es";

type TranslationValue = string | ((...args: string[]) => string);

type Translations = Record<string, Record<string, TranslationValue>>;

export const translations: Translations = {
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

  // ─── Hero ──────────────────────────────────────────────────
  "hero.badge": {
    en: "Authentic Costa Rican Craftsmanship",
    es: "Artesanía Costarricense Auténtica",
  },
  "hero.title.pura": {
    en: "Pura Vida",
    es: "Pura Vida",
  },
  "hero.title.hecho": {
    en: "Hecho a Mano",
    es: "Hecho a Mano",
  },
  "hero.subtitle": {
    en: "Discover the soul of Costa Rica through the hands of its master artisans. From the painted wheels of Sarchí to the weaving looms of the Central Valley — every piece carries a story.",
    es: "Descubre el alma de Costa Rica a través de las manos de sus maestros artesanos. Desde las ruedas pintadas de Sarchí hasta los telares del Valle Central — cada pieza lleva una historia.",
  },
  "hero.cta.explore": {
    en: "Explore Artesanías",
    es: "Explorar Artesanías",
  },
  "hero.cta.sell": {
    en: "Sell Your Crafts",
    es: "Vende tus Artesanías",
  },

  // ─── Categories ────────────────────────────────────────────
  "categories.title": {
    en: "Browse by Category",
    es: "Explorar por Categoría",
  },
  "categories.subtitle": {
    en: "From carved woods to handwoven textiles — find your piece of Costa Rica.",
    es: "Desde maderas talladas hasta textiles tejidos a mano — encuentra tu pieza de Costa Rica.",
  },
  "categories.browse": {
    en: "Browse",
    es: "Explorar",
  },

  // ─── Featured ──────────────────────────────────────────────
  "featured.title": {
    en: "Featured Artesanías",
    es: "Artesanías Destacadas",
  },
  "featured.subtitle": {
    en: "Recently added treasures from our artisan community.",
    es: "Tesoros añadidos recientemente por nuestra comunidad de artesanos.",
  },
  "featured.viewAll": {
    en: "View All →",
    es: "Ver Todo →",
  },

  // ─── Story ─────────────────────────────────────────────────
  "story.title": {
    en: "The Story of Sarchí",
    es: "La Historia de Sarchí",
  },
  "story.paragraph1": {
    en: "For over a century, the painted oxcarts of Sarchí have been rolling symbols of Costa Rican identity — recognized by UNESCO as Intangible Cultural Heritage. Each cart, with its kaleidoscopic mandala wheels and hand-painted geometric patterns, tells a story of family, tradition, and community pride.",
    es: "Por más de un siglo, las carretas pintadas de Sarchí han sido símbolos rodantes de la identidad costarricense — reconocidas por la UNESCO como Patrimonio Cultural Inmaterial. Cada carreta, con sus ruedas de mandala caleidoscópicas y patrones geométricos pintados a mano, cuenta una historia de familia, tradición y orgullo comunitario.",
  },
  "story.paragraph2": {
    en: "Today, that same spirit lives on in every artesanía created by our community of master craftspeople. When you bring home a piece from Pura Vida Artesanías, you're not just buying a product — you're becoming part of a story that's been unfolding for generations.",
    es: "Hoy, ese mismo espíritu vive en cada artesanía creada por nuestra comunidad de maestros artesanos. Cuando llevas a casa una pieza de Pura Vida Artesanías, no solo estás comprando un producto — te estás convirtiendo en parte de una historia que se ha ido desarrollando por generaciones.",
  },
  "story.tagline": {
    en: "The pure life, shared through craft.",
    es: "La vida pura, compartida a través de la artesanía.",
  },

  // ─── CTA ───────────────────────────────────────────────────
  "cta.title": {
    en: "Are you a Costa Rican Artisan?",
    es: "¿Eres un Artesano Costarricense?",
  },
  "cta.subtitle": {
    en: "Share your craft with the world. Create your artisan profile, upload your products, and connect directly with people who appreciate authentic Costa Rican craftsmanship.",
    es: "Comparte tu arte con el mundo. Crea tu perfil de artesano, sube tus productos y conecta directamente con personas que aprecian la artesanía costarricense auténtica.",
  },
  "cta.join": {
    en: "Join as an Artisan",
    es: "Únete como Artesano",
  },
  "cta.browse": {
    en: "Browse Artesanías",
    es: "Explorar Artesanías",
  },

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

  // ─── Products Listing ──────────────────────────────────────
  "products.title": {
    en: "All Artesanías",
    es: "Todas las Artesanías",
  },
  "products.subtitle": {
    en: "Discover authentic Costa Rican handcrafted treasures, direct from the artisans.",
    es: "Descubre tesoros artesanales costarricenses auténticos, directo de los artesanos.",
  },
  "products.empty": {
    en: "No artesanías found",
    es: "No se encontraron artesanías",
  },
  "products.emptySub": {
    en: "Try adjusting your search or browse our artisan community.",
    es: "Intenta ajustar tu búsqueda o explora nuestra comunidad de artesanos.",
  },
  "products.search": {
    en: "Search artesanías...",
    es: "Buscar artesanías...",
  },
  "products.all": {
    en: "All",
    es: "Todas",
  },
  "products.reset": {
    en: "Reset Filter",
    es: "Limpiar Filtro",
  },
  "products.by": {
    en: "by",
    es: "por",
  },
  "products.noResults": {
    en: (q: string) => `No results for "${q}". Try a different search term.`,
    es: (q: string) => `Sin resultados para "${q}". Intenta con otro término de búsqueda.`,
  },

  // ─── Product Detail ────────────────────────────────────────
  "product.contact.title": {
    en: "Contact Artisan",
    es: "Contactar Artesano",
  },
  "product.contact.message": {
    en: "Interested in this piece? Reach out to the artisan directly:",
    es: "¿Interesado en esta pieza? Contacta al artesano directamente:",
  },
  "product.back": {
    en: "← Back to Artesanías",
    es: "← Volver a Artesanías",
  },
  "product.noDescription": {
    en: "No description provided.",
    es: "No se proporcionó descripción.",
  },
  "product.description": {
    en: "Description",
    es: "Descripción",
  },
  "product.whatsapp": {
    en: "WhatsApp",
    es: "WhatsApp",
  },
  "product.instagram": {
    en: "Instagram",
    es: "Instagram",
  },
  "product.status.active": {
    en: "Active",
    es: "Activo",
  },
  "product.status.inactive": {
    en: "Inactive",
    es: "Inactivo",
  },
  "product.status.sold": {
    en: "Sold",
    es: "Vendido",
  },

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

  // ─── Categories Names ──────────────────────────────────────
  "cat.wood-carvings": {
    en: "Wood Carvings",
    es: "Tallados en Madera",
  },
  "cat.jewelry": {
    en: "Jewelry & Accessories",
    es: "Joyas y Accesorios",
  },
  "cat.textiles": {
    en: "Textiles & Weaving",
    es: "Textiles y Tejidos",
  },
  "cat.ceramics": {
    en: "Ceramics & Pottery",
    es: "Cerámica y Alfarería",
  },
  "cat.paintings": {
    en: "Paintings & Art",
    es: "Pinturas y Arte",
  },
  "cat.coffee-cacao": {
    en: "Coffee & Cacao",
    es: "Café y Cacao",
  },

  // ─── Category Descriptions ─────────────────────────────────
  "cat-desc.wood-carvings": {
    en: "Intricate carvings from Costa Rican hardwoods",
    es: "Tallados intrincados en maderas nobles costarricenses",
  },
  "cat-desc.jewelry": {
    en: "Handcrafted adornments from local materials",
    es: "Adornos hechos a mano con materiales locales",
  },
  "cat-desc.textiles": {
    en: "Traditional woven goods and fabrics",
    es: "Tejidos y telas tradicionales",
  },
  "cat-desc.ceramics": {
    en: "Earthenware from Costa Rican clay",
    es: "Alfarería hecha con arcilla costarricense",
  },
  "cat-desc.paintings": {
    en: "Folk art and contemporary Costa Rican paintings",
    es: "Arte folclórico y pinturas costarricenses contemporáneas",
  },
  "cat-desc.coffee-cacao": {
    en: "Premium Costa Rican coffee and chocolate",
    es: "Café y chocolate costarricense premium",
  },

  // ─── Units ─────────────────────────────────────────────────
  "unit.artesania": {
    en: "artesanía",
    es: "artesanía",
  },
  "unit.artesanias_plural": {
    en: "artesanías",
    es: "artesanías",
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

  // Edit/Add titles
  "edit.title": {
    en: "Edit Artesanía",
    es: "Editar Artesanía",
  },
  "add.title": {
    en: "Add New Artesanía",
    es: "Añadir Nueva Artesanía",
  },

  // ArtisanCard
  "artisanCard.artesania": {
    en: (n: string) => `${n} ${n === "1" ? "artesanía" : "artesanías"}`,
    es: (n: string) => `${n} ${n === "1" ? "artesanía" : "artesanías"}`,
  },
  "artisanCard.fallbackName": {
    en: "Artisan",
    es: "Artesano",
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
};
