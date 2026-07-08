import Link from "next/link";
import CarretaWheel from "./CarretaWheel";
import ContactForm from "./ContactForm";
import { getTranslations } from "@/i18n/getTranslations";

export default async function Footer() {
  const contactForm = <ContactForm />;
  const { t } = await getTranslations();

  const categoryLinks = [
    { key: "wood-carvings", slug: "wood-carvings" },
    { key: "jewelry", slug: "jewelry" },
    { key: "textiles", slug: "textiles" },
    { key: "ceramics", slug: "ceramics" },
    { key: "paintings", slug: "paintings" },
    { key: "coffee-cacao", slug: "coffee-cacao" },
  ];

  return (
    <footer className="relative mt-auto border-t-2 border-carreta-red/20 bg-[#1A1A2E] text-carreta-eggshell">
      {/* Decorative top border */}
      <div className="carreta-divider" />

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <CarretaWheel size={32} variant="outline" />
              <span className="flex flex-col">
                <span className="text-lg font-bold leading-tight tracking-tight">
                  <span className="carreta-gradient-text">Pura Vida</span>{" "}
                  <span>Minds</span>
                </span>
                <span className="text-[11px] font-medium leading-tight tracking-wider text-carreta-turquoise">
                  ARTESANÍAS
                </span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-carreta-eggshell/70">
              {t("site.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-carreta-gold">
              {t("footer.explore")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-carreta-eggshell/70 transition-colors hover:text-carreta-gold"
                >
                  {t("footer.browse")}
                </Link>
              </li>
              <li>
                <Link
                  href="/artisans"
                  className="text-sm text-carreta-eggshell/70 transition-colors hover:text-carreta-gold"
                >
                  {t("footer.meetArtisans")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-carreta-eggshell/70 transition-colors hover:text-carreta-gold"
                >
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-carreta-eggshell/70 transition-colors hover:text-carreta-gold"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-carreta-gold">
              {t("footer.categories")}
            </h3>
            <ul className="space-y-3">
              {categoryLinks.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="text-sm text-carreta-eggshell/70 transition-colors hover:text-carreta-gold"
                  >
                    {t(`cat.${cat.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-carreta-gold">
              {t("footer.connect")}
            </h3>
            <p className="mb-3 text-xs text-carreta-eggshell/60">{t("contact.form.footerHint")}</p>
            <div className="rounded-xl border border-carreta-eggshell/10 bg-white/5 p-3">
              {contactForm}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-carreta-eggshell/10 pt-8 text-center">
          <p className="text-sm text-carreta-eggshell/50">
            © {new Date().getFullYear()} Pura Vida Artesanías.{" "}
            {t("site.footer.copyright")}{" "}
            <span className="text-carreta-gold">Pura Vida</span> 🇨🇷
          </p>
        </div>
      </div>
    </footer>
  );
}
