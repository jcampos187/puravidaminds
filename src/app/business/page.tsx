import type { Metadata } from "next";
import Link from "next/link";
import CarretaWheel from "@/components/CarretaWheel";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Pura Vida Minds — Digital Craft & Innovation",
  description:
    "We craft digital experiences rooted in Costa Rican creativity. From artisan marketplaces to custom web applications, we bring the Pura Vida spirit to technology.",
  keywords: [
    "Costa Rica",
    "web development",
    "digital agency",
    "Pura Vida",
    "artisan marketplace",
    "software",
  ],
};

export default function BusinessPage() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1A2E] via-[#22223A] to-[#1A1A2E] px-6 py-24 text-carreta-eggshell sm:py-32">
        {/* Decorative carreta wheel */}
        <div className="absolute -right-24 -top-24 opacity-[0.04]">
          <svg width="500" height="500" viewBox="0 0 120 120" fill="none" stroke="#FFD700" strokeWidth="2">
            <circle cx="60" cy="60" r="50" />
            <line x1="60" y1="12" x2="60" y2="108" />
            <line x1="12" y1="60" x2="108" y2="60" />
            <circle cx="60" cy="60" r="8" fill="#FFD700" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-8 flex justify-center">
            <CarretaWheel size={64} variant="outline" />
          </div>

          <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-carreta-red via-carreta-gold to-carreta-orange bg-clip-text text-transparent">
              Pura Vida
            </span>
            <br />
            <span>Minds</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-carreta-eggshell/80 sm:text-xl">
            Digital craft & innovation from the heart of Costa Rica.
            We build meaningful web experiences that connect people,
            culture, and technology — always with a Pura Vida spirit.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#projects"
              className="carreta-btn inline-flex h-14 items-center gap-2 rounded-full px-10 text-base font-semibold shadow-xl shadow-carreta-red/25"
            >
              <CarretaWheel size={20} variant="outline" />
              Our Projects
            </a>
            <a
              href="#contact"
              className="inline-flex h-14 items-center rounded-full border-2 border-carreta-eggshell/30 px-10 text-base font-semibold text-carreta-eggshell transition-all hover:border-carreta-gold/50 hover:text-carreta-gold"
            >
              Get in Touch
            </a>
          </div>
        </div>

        <div className="carreta-divider" />
      </section>

      {/* ─── About ─────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 dark:bg-[#22223A]">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-block rounded-full bg-carreta-blue/10 px-4 py-1.5 text-xs font-semibold text-carreta-blue">
            About Us
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell sm:text-4xl">
            Where Tradition Meets Technology
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
            Pura Vida Minds is a Costa Rican digital studio dedicated to
            crafting web applications that celebrate our culture and connect
            communities. We believe technology should feel warm, human, and
            authentic — just like the Pura Vida lifestyle.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: "🎨",
                title: "Craft-Driven",
                desc: "Every project is hand-crafted with attention to detail, inspired by the rich artisan traditions of Costa Rica.",
              },
              {
                icon: "🌿",
                title: "Sustainable",
                desc: "We build for the long term — clean code, thoughtful architecture, and minimal environmental impact.",
              },
              {
                icon: "🤝",
                title: "Community First",
                desc: "We connect people through technology, empowering local artisans and small businesses to reach the world.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border-2 border-carreta-gold/10 bg-gradient-to-br from-carreta-gold/5 to-carreta-orange/5 p-8 text-center transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <span className="text-4xl">{item.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Projects ──────────────────────────────────────── */}
      <section id="projects" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-carreta-red/10 px-4 py-1.5 text-xs font-semibold text-carreta-red">
              Our Work
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell sm:text-4xl">
              Featured Projects
            </h2>
          </div>

          {/* Project Card */}
          <div className="mt-12 overflow-hidden rounded-2xl border-2 border-carreta-red/20 bg-white shadow-xl dark:bg-[#22223A] lg:flex">
            <div className="flex items-center justify-center bg-gradient-to-br from-carreta-red/10 via-carreta-gold/10 to-carreta-blue/10 p-12 lg:w-1/2">
              <div className="text-center">
                <CarretaWheel size={80} variant="outline" className="mx-auto" />
                <p className="mt-4 text-3xl font-bold text-carreta-red">
                  Pura Vida
                </p>
                <p className="text-xl font-bold text-carreta-blue">
                  Artesanías
                </p>
              </div>
            </div>
            <div className="p-8 lg:w-1/2">
              <span className="inline-block rounded-full bg-carreta-gold/10 px-3 py-1 text-xs font-medium text-carreta-orange">
                Marketplace
              </span>
              <h3 className="mt-3 text-2xl font-bold text-[#1A1A2E] dark:text-carreta-eggshell">
                Pura Vida Artesanías
              </h3>
              <p className="mt-4 leading-relaxed text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
                An online marketplace connecting Costa Rican artisans directly
                with customers worldwide. Browse authentic handcrafted products,
                learn about the artisans behind each piece, and connect through
                WhatsApp, Instagram, and more. Built with Next.js, featuring
                bilingual support, dark mode, and an immersive image gallery.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Next.js", "PostgreSQL", "Clerk Auth", "UploadThing", "Tailwind CSS"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-carreta-blue/10 px-3 py-1 text-xs font-medium text-carreta-blue"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
              <Link
                href="https://puravidamindsart.com"
                className="carreta-btn mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
              >
                <CarretaWheel size={16} variant="outline" />
                Visit the App →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Services ───────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 dark:bg-[#22223A]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-carreta-turquoise/10 px-4 py-1.5 text-xs font-semibold text-carreta-turquoise">
              What We Do
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell sm:text-4xl">
              Services
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "🌐",
                title: "Web Development",
                desc: "Custom web applications built with modern frameworks like Next.js, React, and Node.js.",
              },
              {
                icon: "🎨",
                title: "UI/UX Design",
                desc: "Beautiful, intuitive interfaces that feel authentic and connect with your audience.",
              },
              {
                icon: "🛒",
                title: "E-Commerce",
                desc: "Online marketplaces and storefronts that make it easy to sell and showcase products.",
              },
              {
                icon: "📱",
                title: "Responsive Design",
                desc: "Sites that work beautifully on every device — desktop, tablet, and mobile.",
              },
              {
                icon: "🔐",
                title: "Auth & Security",
                desc: "Secure authentication, user management, and data protection for your web applications.",
              },
              {
                icon: "🚀",
                title: "Deployment & DevOps",
                desc: "From development to production — we handle hosting, CI/CD, and domain configuration.",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="carreta-card rounded-xl bg-carreta-cream/50 p-6 dark:bg-[#1A1A2E]/50"
              >
                <span className="text-3xl">{service.icon}</span>
                <h3 className="mt-3 font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contact ────────────────────────────────────────── */}
      <section id="contact" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Info */}
            <div>
              <span className="inline-block rounded-full bg-carreta-orange/10 px-4 py-1.5 text-xs font-semibold text-carreta-orange">
                Get in Touch
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell sm:text-4xl">
                Let&apos;s Build Something
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
                Have a project in mind? Want to collaborate? We&apos;d love to
                hear from you. Reach out and let&apos;s create something
                meaningful together.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-carreta-blue/10 text-carreta-blue">
                    ✉️
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">
                      Email
                    </p>
                    <a
                      href="mailto:hello@puravidaminds.com"
                      className="text-sm text-carreta-blue hover:text-carreta-red transition-colors"
                    >
                      hello@puravidaminds.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-carreta-gold/10 text-carreta-orange">
                    📍
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">
                      Location
                    </p>
                    <p className="text-sm text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
                      Costa Rica
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-carreta-fuchsia/10 text-carreta-fuchsia">
                    📸
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">
                      Social
                    </p>
                    <p className="text-sm text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
                      @puravidaminds
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl border-2 border-carreta-gold/20 bg-gradient-to-br from-carreta-gold/5 to-carreta-orange/5 p-8">
              <h3 className="text-xl font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
                Send us a message
              </h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer className="border-t-2 border-carreta-red/10 bg-[#1A1A2E] px-6 py-12 text-carreta-eggshell">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <CarretaWheel size={32} variant="outline" />
              <div>
                <p className="text-lg font-bold">
                  <span className="carreta-gradient-text">Pura Vida</span> Minds
                </p>
                <p className="text-xs text-carreta-eggshell/60">
                  Digital Craft & Innovation · Costa Rica
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-carreta-eggshell/60 transition-colors hover:text-carreta-gold"
              >
                Marketplace
              </Link>
              <a
                href="#projects"
                className="text-sm text-carreta-eggshell/60 transition-colors hover:text-carreta-gold"
              >
                Projects
              </a>
              <a
                href="#contact"
                className="text-sm text-carreta-eggshell/60 transition-colors hover:text-carreta-gold"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-carreta-eggshell/10 pt-8 text-center">
            <p className="text-sm text-carreta-eggshell/50">
              &copy; {new Date().getFullYear()} Pura Vida Minds. All rights
              reserved. Hecho en Costa Rica 🇨🇷
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
