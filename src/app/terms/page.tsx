import type { Metadata } from "next";
import Link from "next/link";
import CarretaWheel from "@/components/CarretaWheel";
import { getTranslations } from "@/i18n/getTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getTranslations();

  if (locale === "es") {
    return {
      title: "Términos y Condiciones | Pura Vida Artesanías",
      description:
        "Términos y condiciones para el uso de la plataforma Pura Vida Artesanías, un sitio web que exhibe artesanos costarricenses y sus productos artesanales.",
    };
  }

  return {
    title: "Terms & Conditions | Pura Vida Artesanías",
    description:
      "Terms and conditions for using the Pura Vida Artesanías website showcasing Costa Rican artisans and their handcrafted products.",
  };
}

export default async function TermsPage() {
  const { locale } = await getTranslations();

  if (locale === "es") {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10 flex items-center gap-4">
          <CarretaWheel size={36} variant="outline" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell">
          Términos y Condiciones
        </h1>
            <p className="mt-1 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
          Última actualización: Julio 2026
        </p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none dark:prose-invert space-y-6 text-[#1A1A2E]/80 dark:text-carreta-eggshell/80">
          <div className="rounded-xl border-2 border-carreta-gold/20 bg-carreta-gold/5 p-4 text-sm">
            <strong>⚠️ Aviso Legal:</strong> Este documento es una plantilla de términos y condiciones. Te recomendamos consultar con un abogado para asegurarte de que cumple con todas las leyes aplicables a tu negocio, especialmente las leyes de comercio electrónico y protección de datos de Costa Rica (Ley 8968).
          </div>

          <Section title="1. Aceptación de los Términos">
            <p>Al acceder o utilizar la plataforma Pura Vida Artesanías (el &quot;Sitio&quot;), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al Sitio ni utilizar nuestros servicios.</p>
            <p>La plataforma opera como un sitio web que exhibe artesanos costarricenses y sus productos artesanales. Pura Vida Artesanías brinda un espacio para que los artesanos compartan su trabajo y los visitantes conozcan la artesanía costarricense auténtica.</p>
          </Section>

          <Section title="2. Registro de Cuenta">
            <p>Para utilizar ciertas funciones del Sitio, debe registrarse y crear una cuenta. Usted es responsable de mantener la confidencialidad de su contraseña y de todas las actividades que ocurran bajo su cuenta.</p>
            <p>Al registrarse, declara que:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Tiene al menos 18 años de edad</li>
              <li>La información proporcionada es veraz, precisa y completa</li>
              <li>No está sujeto a sanciones económicas ni listas de restricción comercial</li>
              <li>Actualizará su información cuando sea necesario para mantenerla precisa</li>
            </ul>
          </Section>

          <Section title="3. Responsabilidades del Artesano (Vendedor)">
            <p>Los artesanos que publican productos en la plataforma aceptan que:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Autenticidad:</strong> Todos los productos listados son artesanías auténticas creadas por el artesano o su taller. No se permite la reventa de productos fabricados industrialmente.</li>
              <li><strong>Precisión:</strong> Las descripciones, fotos, precios y disponibilidad de los productos son precisos y no engañosos.</li>
              <li><strong>Legalidad:</strong> Los productos cumplen con todas las leyes y regulaciones aplicables de Costa Rica, incluyendo leyes de comercio, aduanas, y restricciones de exportación de ciertos materiales (maderas, semillas, especies protegidas).</li>
              <li><strong>Responsabilidad:</strong> El artesano es el único responsable por la calidad, seguridad, entrega y cualquier defecto de sus productos.</li>
              <li><strong>Precios:</strong> Los precios se muestran en la moneda seleccionada. El artesano es responsable de determinar y pagar los impuestos aplicables a sus ventas.</li>
            </ul>
          </Section>

          <Section title="4. Responsabilidades del Comprador">
            <p>Los compradores aceptan que:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Proporcionarán información de pago precisa y autorizada</li>
              <li>Son responsables de los aranceles aduaneros, impuestos de importación y otros cargos aplicables en su país</li>
              <li>Las imágenes de los productos son representativas; los productos hechos a mano pueden tener variaciones naturales</li>
              <li>Han leído y entendido la descripción del producto antes de realizar una compra</li>
            </ul>
          </Section>

          <Section title="5. Limitación de Responsabilidad">
            <p><strong>Pura Vida Artesanías NO será responsable por:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Daños directos, indirectos, incidentales, especiales o consecuentes que surjan del uso o la imposibilidad de usar la plataforma</li>
              <li>La calidad, seguridad, legalidad o entrega de los productos listados por artesanos</li>
              <li>Disputas entre compradores y vendedores, incluyendo pero no limitado a problemas de pago, entrega, devoluciones o reembolsos</li>
              <li>Pérdida de datos, ingresos, ganancias o oportunidades de negocio</li>
              <li>Contenido publicado por usuarios que sea difamatorio, ofensivo o ilegal</li>
              <li>Interrupciones del servicio, errores técnicos, virus o ataques cibernéticos</li>
              <li>Actos de terceros, incluyendo procesadores de pago, servicios de envío y proveedores de hosting</li>
            </ul>
            <p>En ningún caso la responsabilidad total de Pura Vida Artesanías excederá el monto total pagado por el usuario en los 12 meses anteriores al reclamo.</p>
          </Section>

          <Section title="6. Exención de Garantías">
            <p>La plataforma se proporciona &quot;tal cual&quot; y &quot;según disponibilidad&quot;, sin garantías de ningún tipo, ya sean expresas o implícitas, incluyendo pero no limitado a garantías de comerciabilidad, idoneidad para un propósito particular y no infracción.</p>
            <p>No garantizamos que:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>La plataforma sea ininterrumpida, oportuna, segura o libre de errores</li>
              <li>Los productos listados cumplan con las regulaciones de su país</li>
              <li>Los artesanos cumplirán con los pedidos realizados</li>
            </ul>
          </Section>

          <Section title="7. Propiedad Intelectual">
            <p><strong>Del Sitio:</strong> Todo el contenido de la plataforma, incluyendo logos, diseños, texto, gráficos y el nombre &quot;Pura Vida Artesanías&quot;, es propiedad de Pura Vida Minds y está protegido por leyes de propiedad intelectual.</p>
            <p><strong>De los Artesanos:</strong> Los artesanos retienen todos los derechos de propiedad intelectual sobre sus productos, fotos y descripciones. Al publicar en la plataforma, otorgan a Pura Vida Artesanías una licencia no exclusiva para mostrar y promocionar sus productos en el Sitio y redes sociales asociadas.</p>
          </Section>

          <Section title="8. Privacidad y Datos">
            <p>El manejo de datos personales se rige por nuestra Política de Privacidad. Al usar la plataforma, usted acepta la recopilación y uso de su información según dicha política.</p>
            <p>No vendemos datos personales de usuarios a terceros. La información de contacto se comparte entre compradores y vendedores únicamente para facilitar las transacciones y la comunicación directa sobre productos.</p>
          </Section>

          <Section title="9. Terminación">
            <p>Nos reservamos el derecho de suspender o terminar cuentas que:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Violen estos términos y condiciones</li>
              <li>Publiquen productos falsos, ilegales o engañosos</li>
              <li>Tengan actividad fraudulenta o sospechosa</li>
              <li>Reciban múltiples quejas de compradores</li>
              <li>Infrinjan derechos de propiedad intelectual de terceros</li>
            </ul>
          </Section>

          <Section title="10. Ley Aplicable y Jurisdicción">
            <p>Estos términos se rigen por las leyes de la República de Costa Rica. Cualquier disputa relacionada con estos términos será resuelta en los tribunales de San José, Costa Rica.</p>
          </Section>

          <Section title="11. Cambios a los Términos">
            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el Sitio. El uso continuado de la plataforma después de los cambios constituye la aceptación de los nuevos términos.</p>
          </Section>

          <Section title="12. Contacto">
            <p>Para preguntas sobre estos términos, contáctenos a través del formulario de contacto en el Sitio o por correo electrónico.</p>
          </Section>

          <div className="mt-8 pt-6 border-t border-carreta-red/10">
            <Link href="/" className="text-sm text-carreta-red hover:text-carreta-orange transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // English version
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-10 flex items-center gap-4">
        <CarretaWheel size={36} variant="outline" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell">
          Terms and Conditions
        </h1>
          <p className="mt-1 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
          Last updated: July 2026
        </p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none dark:prose-invert space-y-6 text-[#1A1A2E]/80 dark:text-carreta-eggshell/80">
        <div className="rounded-xl border-2 border-carreta-gold/20 bg-carreta-gold/5 p-4 text-sm">
          <strong>⚠️ Legal Notice:</strong> This document is a template. We recommend consulting with an attorney to ensure it complies with all applicable laws for your business, particularly e-commerce and data protection laws.
        </div>

        <Section title="1. Acceptance of Terms">
          <p>By accessing or using the Pura Vida Artesanías platform (the &quot;Site&quot;), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not access the Site or use our services.</p>
          <p>The platform operates as a website showcasing Costa Rican artisans and their handcrafted products. Pura Vida Artesanías provides a space for artisans to share their work and for visitors to learn about authentic Costa Rican craftsmanship.</p>
        </Section>

        <Section title="2. Account Registration">
          <p>To use certain features of the Site, you must register and create an account. You are responsible for maintaining the confidentiality of your password and for all activities that occur under your account.</p>
          <p>By registering, you represent that:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>You are at least 18 years of age</li>
            <li>The information provided is truthful, accurate, and complete</li>
            <li>You are not subject to economic sanctions or trade restriction lists</li>
            <li>You will update your information as needed to keep it accurate</li>
          </ul>
        </Section>

        <Section title="3. Artisan (Seller) Responsibilities">
          <p>Artisans listing products on the platform agree that:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Authenticity:</strong> All listed products are authentic handcrafts created by the artisan or their workshop. Reselling industrially manufactured products is not permitted.</li>
            <li><strong>Accuracy:</strong> Product descriptions, photos, prices, and availability are accurate and not misleading.</li>
            <li><strong>Legality:</strong> Products comply with all applicable laws of Costa Rica, including trade, customs, and export restrictions on certain materials (woods, seeds, protected species).</li>
            <li><strong>Responsibility:</strong> The artisan is solely responsible for the quality, safety, delivery, and any defects of their products.</li>
            <li><strong>Pricing:</strong> Prices are displayed in the selected currency. The artisan is responsible for determining and paying applicable taxes on their sales.</li>
          </ul>
        </Section>

        <Section title="4. Buyer Responsibilities">
          <p>Buyers agree that:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>They will provide accurate and authorized payment information</li>
            <li>They are responsible for customs duties, import taxes, and other applicable charges in their country</li>
            <li>Product images are representative; handmade products may have natural variations</li>
            <li>They have read and understood the product description before making a purchase</li>
          </ul>
        </Section>

        <Section title="5. Limitation of Liability">
          <p><strong>Pura Vida Artesanías will NOT be liable for:</strong></p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Direct, indirect, incidental, special, or consequential damages arising from the use or inability to use the platform</li>
            <li>The quality, safety, legality, or delivery of products listed by artisans</li>
            <li>Disputes between buyers and sellers, including but not limited to payment, delivery, returns, or refund issues</li>
            <li>Loss of data, revenue, profits, or business opportunities</li>
            <li>Content posted by users that is defamatory, offensive, or illegal</li>
            <li>Service interruptions, technical errors, viruses, or cyber attacks</li>
            <li>Acts of third parties, including payment processors, shipping services, and hosting providers</li>
          </ul>
          <p>In no event shall the total liability of Pura Vida Artesanías exceed the total amount paid by the user in the 12 months preceding the claim.</p>
        </Section>

        <Section title="6. Disclaimer of Warranties">            <p>The platform is provided &quot;as is&quot; and &quot;as available,&quot; without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
          <p>We do not guarantee that:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>The platform will be uninterrupted, timely, secure, or error-free</li>              <li>Listed products comply with your country&apos;s regulations</li>
            <li>Artisans will fulfill placed orders</li>
          </ul>
        </Section>

        <Section title="7. Intellectual Property">            <p><strong>Site Content:</strong> All content on the platform, including logos, designs, text, graphics, and the &quot;Pura Vida Artesanías&quot; name, is owned by Pura Vida Minds and protected by intellectual property laws.</p>
          <p><strong>Artisan Content:</strong> Artisans retain all intellectual property rights to their products, photos, and descriptions. By listing on the platform, they grant Pura Vida Artesanías a non-exclusive license to display and promote their products on the Site and associated social media.</p>
        </Section>

        <Section title="8. Privacy and Data">
          <p>The handling of personal data is governed by our Privacy Policy. By using the platform, you consent to the collection and use of your information as described therein.</p>
          <p>We do not sell user personal data to third parties. Contact information is shared between buyers and sellers solely to facilitate transactions and direct communication about products.</p>
        </Section>

        <Section title="9. Termination">
          <p>We reserve the right to suspend or terminate accounts that:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Violate these terms and conditions</li>
            <li>List fake, illegal, or misleading products</li>
            <li>Engage in fraudulent or suspicious activity</li>
            <li>Receive multiple buyer complaints</li>
            <li>Infringe upon third-party intellectual property rights</li>
          </ul>
        </Section>

        <Section title="10. Governing Law and Jurisdiction">
          <p>These terms are governed by the laws of the Republic of Costa Rica. Any disputes relating to these terms shall be resolved in the courts of San José, Costa Rica.</p>
        </Section>

        <Section title="11. Changes to Terms">
          <p>We reserve the right to modify these terms at any time. Changes will take effect immediately upon posting on the Site. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
        </Section>

        <Section title="12. Contact">
          <p>For questions about these terms, contact us through the Site&apos;s contact form or by email.</p>
        </Section>

        <div className="mt-8 pt-6 border-t border-carreta-red/10">
          <Link href="/" className="text-sm text-carreta-red hover:text-carreta-orange transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-[#1A1A2E] dark:text-carreta-eggshell mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
