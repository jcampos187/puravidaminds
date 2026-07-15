import type { Locale, TranslationValue } from "./types";

const products: Record<string, Record<Locale, TranslationValue>> = {
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
  "product.facebook": {
    en: "Facebook",
    es: "Facebook",
  },
  "product.email": {
    en: "Email",
    es: "Correo",
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

  // ─── Related Products ────────────────────────────────────────
  "product.related.title": {
    en: "Related Artesanías",
    es: "Artesanías Relacionadas",
  },
  "product.related.subtitle": {
    en: "You might also like these pieces from the same category",
    es: "También te pueden gustar estas piezas de la misma categoría",
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
  "cat.home-decor": {
    en: "Home Decor",
    es: "Decoración para el Hogar",
  },
  "cat.leatherwork": {
    en: "Leatherwork",
    es: "Marroquinería",
  },
  "cat.food-drinks": {
    en: "Food & Drinks",
    es: "Alimentos y Bebidas",
  },
  "cat.natural-care": {
    en: "Natural Care",
    es: "Cuidado Natural",
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
};

export default products;
