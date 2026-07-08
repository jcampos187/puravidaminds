import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import {
  categories,
  users,
  artisanProfiles,
  products,
  productImages,
} from "@/db/schema";

// ─── Sample data ─────────────────────────────────────────────────

const seedCategories = [
  {
    name: "Wood Carvings",
    slug: "wood-carvings",
    description:
      "Intricate hand-carved wooden pieces from Costa Rican hardwoods like cedar, mahogany, and balsa.",
    displayOrder: 1,
  },
  {
    name: "Jewelry & Accessories",
    slug: "jewelry",
    description:
      "Handcrafted adornments made from seeds, stones, leather, silver, and tropical materials.",
    displayOrder: 2,
  },
  {
    name: "Textiles & Weaving",
    slug: "textiles",
    description:
      "Traditional woven goods including hammocks, bags, blankets, and clothing from local fibers.",
    displayOrder: 3,
  },
  {
    name: "Ceramics & Pottery",
    slug: "ceramics",
    description:
      "Earthenware and pottery crafted from Costa Rican clay, featuring traditional and modern designs.",
    displayOrder: 4,
  },
  {
    name: "Paintings & Art",
    slug: "paintings",
    description:
      "Folk art, contemporary paintings, and mixed-media works inspired by Costa Rican landscapes and culture.",
    displayOrder: 5,
  },
  {
    name: "Coffee & Cacao",
    slug: "coffee-cacao",
    description:
      "Premium single-origin Costa Rican coffee and artisan chocolate made from local cacao.",
    displayOrder: 6,
  },
  {
    name: "Home Decor",
    slug: "home-decor",
    description:
      "Handcrafted furniture, decorative items, and furnishings that bring Costa Rican style to your home.",
    displayOrder: 7,
  },
  {
    name: "Leatherwork",
    slug: "leatherwork",
    description:
      "Hand-tooled leather goods including belts, bags, wallets, and traditional accessories.",
    displayOrder: 8,
  },
];

const seedArtisans = [
  {
    clerkId: "user_demo_artisan_1",
    email: "carlos.mata@example.com",
    name: "Carlos Mata",
    role: "artisan" as const,
    profile: {
      businessName: "Taller de Madera Sarchí",
      bio: "Con más de 30 años de experiencia, Carlos Mata es un maestro tallador de Sarchí, conocido por sus detalladas carretas típicas y figuras de balsa. Sus piezas han sido exhibidas en galerías de todo el país.",
      location: "Sarchí, Alajuela",
      phone: "+506 8888-1001",
      whatsapp: "+50688881001",
      instagram: "@tallermaderasarchi",
      facebook: "tallermaderasarchi",
      isVerified: true,
    },
  },
  {
    clerkId: "user_demo_artisan_2",
    email: "maria.quiros@example.com",
    name: "María Quirós",
    role: "artisan" as const,
    profile: {
      businessName: "Arte en Barro",
      bio: "María Quirós heredó el arte de la alfarería de su abuela en Guaitil, la cuna de la cerámica Chorotega. Cada pieza es moldeada a mano y pintada con pigmentos naturales.",
      location: "Guaitil, Guanacaste",
      phone: "+506 8888-2002",
      whatsapp: "+50688882002",
      instagram: "@arteenbarrocr",
      facebook: "arteenbarrocr",
      isVerified: true,
    },
  },
  {
    clerkId: "user_demo_artisan_3",
    email: "juan.vargas@example.com",
    name: "Juan Vargas",
    role: "artisan" as const,
    profile: {
      businessName: "Tejidos Ticos",
      bio: "Juan y su familia mantienen viva la tradición del tejido en telar manual en su taller en San Ramón. Crean hamacas, cobijas y bolsos con algodón nacional y tintes naturales.",
      location: "San Ramón, Alajuela",
      phone: "+506 8888-3003",
      whatsapp: "+50688883003",
      instagram: "@tejidosticos",
      facebook: "tejidosticos",
      isVerified: true,
    },
  },
  {
    clerkId: "user_demo_artisan_4",
    email: "sofia.arias@example.com",
    name: "Sofía Arias",
    role: "artisan" as const,
    profile: {
      businessName: "Joyas de Monteverde",
      bio: "Inspirada por la biodiversidad de Monteverde, Sofía crea joyería artesanal usando semillas nativas, tagua (marfil vegetal), y plata reciclada. Cada pieza cuenta una historia de la naturaleza.",
      location: "Monteverde, Puntarenas",
      phone: "+506 8888-4004",
      whatsapp: "+50688884004",
      instagram: "@joyasdemonteverde",
      facebook: "joyasdemonteverde",
      isVerified: false,
    },
  },
  {
    clerkId: "user_demo_artisan_5",
    email: "pedro.mora@example.com",
    name: "Pedro Mora",
    role: "artisan" as const,
    profile: {
      businessName: "Café de Altura Tres Ríos",
      bio: "Productor de café specialty en Tres Ríos, Pedro cultiva y tuesta su propio café en lotes pequeños. Su finca familiar produce algunos de los mejores granos arábica de Costa Rica.",
      location: "Tres Ríos, Cartago",
      phone: "+506 8888-5005",
      whatsapp: "+50688885005",
      instagram: "@cafetresrios",
      facebook: "cafetresrios",
      isVerified: true,
    },
  },
];

interface ProductSeed {
  artisanIndex: number;
  categorySlug: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  currency: "CRC" | "USD";
  tags: string;
  images: { url: string; alt: string }[];
}

const seedProducts: ProductSeed[] = [
  {
    artisanIndex: 0,
    categorySlug: "wood-carvings",
    title: "Carreta Típica Pintada a Mano",
    slug: "carreta-tipica-pintada",
    description:
      "Carreta típica costarricense en miniatura, tallada y pintada a mano con los vibrantes diseños geométricos tradicionales de Sarchí. Cada carreta es única y representa el símbolo nacional del trabajo rural. Perfecta como decoración o pieza de colección. Medidas: 25 cm de largo x 15 cm de alto. Hecha de cedro y balsa.",
    price: 45000,
    currency: "CRC",
    tags: "carreta,wood,traditional,Sarchí,souvenir",
    images: [
      { url: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80", alt: "Carreta típica colorida vista frontal" },
      { url: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&q=80", alt: "Detalle de pintura geométrica en la carreta" },
      { url: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80", alt: "Carreta típica de perfil (talla en madera)" },
    ],
  },
  {
    artisanIndex: 0,
    categorySlug: "wood-carvings",
    title: "Tucán Tallado en Balsa",
    slug: "tucan-tallado-balsa",
    description:
      "Hermoso tucán tallado a mano en madera de balsa, pintado con colores acrílicos que capturan la esencia de esta icónica ave costarricense. Liviano y perfecto para decoración. Incluye base de presentación. Altura: 30 cm.",
    price: 35000,
    currency: "CRC",
    tags: "tucán,wood carving,balsa,bird,Costa Rica",
    images: [
      { url: "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?w=800&q=80", alt: "Tucán tallado en madera" },
      { url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80", alt: "Vista lateral del tucán de madera" },
    ],
  },
  {
    artisanIndex: 1,
    categorySlug: "ceramics",
    title: "Jarra Chorotega Tradicional",
    slug: "jarra-chorotega-tradicional",
    description:
      "Jarra de barro hecha a mano siguiendo la tradición Chorotega de Guaitil. El barro se extrae localmente, se moldea sin torno y se quema en horno de leña. Los diseños geométricos en negro y crema son pintados con tintes naturales de hojas y cortezas. Capacidad: 1.5 litros. Ideal para servir agua fresca o como pieza decorativa.",
    price: 28000,
    currency: "CRC",
    tags: "ceramic,pottery,Chorotega,Guaitil,traditional",
    images: [
      { url: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80", alt: "Jarra Chorotega de barro" },
      { url: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=800&q=80", alt: "Detalle de los patrones geométricos" },
      { url: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800&q=80", alt: "Vista superior de la jarra" },
    ],
  },
  {
    artisanIndex: 1,
    categorySlug: "ceramics",
    title: "Set de 4 Platos Decorativos",
    slug: "set-platos-decorativos",
    description:
      "Juego de 4 platos decorativos de cerámica artesanal, cada uno con un diseño único inspirado en la fauna costarricense: mono carablanca, perezoso, rana dardo y colibrí. Hechos a mano en Guaitil con barro natural y pintura ecológica. Diámetro: 20 cm cada uno.",
    price: 55000,
    currency: "CRC",
    tags: "ceramics,plates,animales,Costa Rica,decorative",
    images: [
      { url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80", alt: "Set de platos decorativos con animales" },
      { url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80", alt: "Plato con diseño de perezoso" },
    ],
  },
  {
    artisanIndex: 2,
    categorySlug: "textiles",
    title: "Hamaca Doble Tejida a Mano",
    slug: "hamaca-doble-tejida",
    description:
      "Hamaca doble de algodón 100% nacional, tejida en telar manual por Juan y su familia en San Ramón. Suave, resistente y cómoda, perfecta para colgar en interiores o exteriores. Soportada hasta 200 kg. Incluye cuerdas de instalación y bolsa de tela para almacenamiento. Colores: combinación de blanco crudo con franjas rojas y doradas.",
    price: 85000,
    currency: "CRC",
    tags: "hamaca,textile,cotton,handwoven,San Ramón",
    images: [
      { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", alt: "Hamaca doble tejida a mano" },
      { url: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&q=80", alt: "Detalle del tejido de la hamaca" },
      { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80", alt: "Hamaca colgada en jardín tropical" },
    ],
  },
  {
    artisanIndex: 2,
    categorySlug: "textiles",
    title: "Bolso Tejido con Diseño Geométrico",
    slug: "bolso-tejido-geometrico",
    description:
      "Bolso artesanal tejido en telar manual con algodón teñido con tintes naturales. Diseño geométrico inspirado en los patrones tradicionales costarricenses. Forro interior, cierre magnético y correa ajustable de cuero. Perfecto para el día a día. Medidas: 30x25x10 cm.",
    price: 32000,
    currency: "CRC",
    tags: "bolso,handbag,textile,handwoven,geometric",
    images: [
      { url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80", alt: "Bolso tejido geométrico" },
      { url: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&q=80", alt: "Bolso visto desde arriba" },
    ],
  },
  {
    artisanIndex: 3,
    categorySlug: "jewelry",
    title: "Collar de Semillas de Tagua",
    slug: "collar-semillas-tagua",
    description:
      "Elegante collar artesanal elaborado con semillas de tagua (marfil vegetal) talladas a mano en formas geométricas y redondas, combinadas con cuentas de plata reciclada. La tagua es una alternativa sostenible al marfil animal. Cada semilla es única en tono y textura. Largo: 50 cm con extensión ajustable de 5 cm. Cierre de plata.",
    price: 42000,
    currency: "CRC",
    tags: "jewelry,tagua,seed,eco-friendly,handmade",
    images: [
      { url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80", alt: "Collar de tagua y plata" },
      { url: "/images/collar-tagua-2.jpg", alt: "Collar de semillas de tagua - detalle" },
    ],
  },
  {
    artisanIndex: 3,
    categorySlug: "jewelry",
    title: "Aretes de Rana Dardo Dorada",
    slug: "aretes-rana-dardo-dorada",
    description:
      "Aretes artesanales con colgantes de tagua tallada y pintada a mano en forma de rana dardo dorada (Phyllobates terribilis), una de las especies más icónicas de Costa Rica. Montados en ganchos de plata de ley 925. Un homenaje a la increíble biodiversidad del país. Largo aproximado: 4 cm.",
    price: 18000,
    currency: "CRC",
    tags: "earrings,frog,tagua,silver,costa rica",
    images: [
      { url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80", alt: "Aretes de rana dardo" },
    ],
  },
  {
    artisanIndex: 4,
    categorySlug: "coffee-cacao",
    title: "Café Specialty Tres Ríos - 1 lb",
    slug: "cafe-specialty-tres-rios",
    description:
      "Café specialty de altura cultivado en la finca familiar de Pedro en Tres Ríos, Cartago. Variedad Caturra, procesado lavado, tueste medio. Notas de cata: chocolate amargo, naranja y miel de caña. Tostado en lotes pequeños para garantizar frescura. Bolsa de 1 libra (454 g) con válvula desgasificadora.",
    price: 22,
    currency: "USD",
    tags: "coffee,specialty,shade-grown,Cartago,organic",
    images: [
      { url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80", alt: "Bolsa de café Tres Ríos" },
      { url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80", alt: "Granos de café tostado" },
      { url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", alt: "Taza de café listo" },
    ],
  },
  {
    artisanIndex: 4,
    categorySlug: "coffee-cacao",
    title: "Chocolate Artesanal 70% Cacao - 3 Barras",
    slug: "chocolate-artesanal-70",
    description:
      "Tres barras de chocolate artesanal hecho con cacao costarricense de la zona de Turrialba. Contenido de cacao: 70%. El cacao se cultiva en sistemas agroforestales, se fermenta y tuesta artesanalmente. Cada barra tiene un perfil único: una clásica, una con sal de mar y una con jengibre cristalizado. Peso: 80 g cada barra.",
    price: 28,
    currency: "USD",
    tags: "chocolate,cacao,artisan,Turrialba,organic",
    images: [
      { url: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&q=80", alt: "Barras de chocolate artesanal" },
      { url: "https://images.unsplash.com/photo-1542843137-8791a6904d14?w=800&q=80", alt: "Barras de chocolate artesanal oscuro con nueces" },
    ],
  },
];

// ─── Main seed function ──────────────────────────────────────────

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL not set. Make sure .env.local exists with DATABASE_URL.");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  console.log("🌱 Seeding PuraVidaMinds database...\n");

  // ── 1. Categories ──────────────────────────────────────────────
  console.log("━━━ Categories ━━━");
  const categoryMap = new Map<string, string>(); // slug → id
  for (const cat of seedCategories) {
    // Find existing category first to avoid insert conflicts
    const existing = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, cat.slug))
      .limit(1);

    if (existing.length > 0) {
      categoryMap.set(cat.slug, existing[0].id);
      console.log(`  ⏭️  Skipped (exists): ${cat.name}`);
    } else {
      const [inserted] = await db.insert(categories).values(cat).returning({ id: categories.id });
      categoryMap.set(cat.slug, inserted.id);
      console.log(`  ✅ Created: ${cat.name}`);
    }
  }

  // ── 2. Users & Artisan Profiles ────────────────────────────────
  console.log("\n━━━ Artisans ━━━");
  const artisanIds: string[] = [];

  for (const artisan of seedArtisans) {
    // Check if this artisan already exists by clerkId
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, artisan.clerkId))
      .limit(1);

    if (existingUser.length > 0) {
      artisanIds.push(existingUser[0].id);
      console.log(`  ⏭️  Skipped (exists): ${artisan.name}`);
    } else {
      const [user] = await db
        .insert(users)
        .values({
          clerkId: artisan.clerkId,
          email: artisan.email,
          name: artisan.name,
          role: artisan.role,
        })
        .returning({ id: users.id });

      await db.insert(artisanProfiles).values({
        userId: user.id,
        ...artisan.profile,
      });

      artisanIds.push(user.id);
      console.log(`  ✅ Created: ${artisan.name} — ${artisan.profile.businessName}`);
    }
  }

  // ── 3. Products & Product Images ────────────────────────────────
  console.log("\n━━━ Products ─━━");

  for (const product of seedProducts) {
    const artisanId = artisanIds[product.artisanIndex];
    const categoryId = categoryMap.get(product.categorySlug);

    if (!artisanId || !categoryId) {
      console.error(`  ❌ Skipping "${product.title}" — missing artisan or category`);
      continue;
    }

    // Build a unique-ish slug by appending a short random suffix
    const uniqueSlug = `${product.slug}-${Date.now().toString(36)}`;

    try {
      const [insertedProduct] = await db
        .insert(products)
        .values({
          artisanId,
          categoryId,
          title: product.title,
          slug: uniqueSlug,
          description: product.description,
          price: product.price.toString(),
          currency: product.currency,
          tags: product.tags,
          status: "active",
        })
        .returning({ id: products.id });

      // Insert images
      for (let i = 0; i < product.images.length; i++) {
        await db.insert(productImages).values({
          productId: insertedProduct.id,
          url: product.images[i].url,
          altText: product.images[i].alt,
          displayOrder: i,
        });
      }

      console.log(`  ✅ Created: ${product.title} ($${product.price}) — ${product.images.length} images`);
    } catch (err: unknown) {
      console.error(`  ❌ Error creating ${product.title}:`, err);
    }
  }

  console.log(`\n✨ Seeding complete! Added ${seedArtisans.length} artisans and ${seedProducts.length} products.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
