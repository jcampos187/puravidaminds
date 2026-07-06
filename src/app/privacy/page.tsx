import type { Metadata } from "next";
import Link from "next/link";
import CarretaWheel from "@/components/CarretaWheel";
import { getTranslations } from "@/i18n/getTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getTranslations();

  if (locale === "es") {
    return {
      title: "Política de Privacidad | Pura Vida Artesanías",
      description:
        "Política de privacidad de Pura Vida Artesanías. Conozca cómo recopilamos, usamos y protegemos sus datos personales según la Ley 8968 de Costa Rica.",
    };
  }

  return {
    title: "Privacy Policy | Pura Vida Artesanías",
    description:
      "Privacy policy for Pura Vida Artesanías. Learn how we collect, use, and protect your personal data in accordance with Costa Rica's Law 8968.",
  };
}

export default async function PrivacyPage() {
  const { locale } = await getTranslations();

  if (locale === "es") {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10 flex items-center gap-4">
          <CarretaWheel size={36} variant="outline" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell">
              Política de Privacidad
            </h1>
            <p className="mt-1 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
              Última actualización: Julio 2026
            </p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none dark:prose-invert space-y-6 text-[#1A1A2E]/80 dark:text-carreta-eggshell/80">
          <div className="rounded-xl border-2 border-carreta-gold/20 bg-carreta-gold/5 p-4 text-sm">
            <strong>⚠️ Aviso Legal:</strong> Este documento es una plantilla de
            política de privacidad. Te recomendamos consultar con un abogado para
            asegurarte de que cumple con todas las leyes aplicables a tu negocio,
            especialmente la Ley de Protección de la Persona frente al Tratamiento
            de sus Datos Personales de Costa Rica (Ley 8968).
          </div>

          <Section title="1. Introducción">
            <p>
              En Pura Vida Artesanías ("nosotros", "nuestro", "la Plataforma"),
              nos tomamos muy en serio la privacidad de nuestros usuarios. Esta
              Política de Privacidad explica cómo recopilamos, usamos,
              compartimos y protegemos su información personal cuando utiliza
              nuestro sitio web y servicios.
            </p>
            <p>
              Al utilizar la Plataforma, usted acepta las prácticas descritas en
              esta política. Si no está de acuerdo con alguna parte, no utilice
              nuestros servicios.
            </p>
          </Section>

          <Section title="2. Información que Recopilamos">
            <p className="font-medium">Información que nos proporciona directamente:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Datos de cuenta:</strong> nombre completo, correo electrónico, contraseña (almacenada de forma segura por Clerk)</li>
              <li><strong>Perfil de artesano:</strong> nombre del negocio, número de teléfono, WhatsApp, sitio web, enlaces a Instagram y Facebook, ubicación, biografía, foto de portada</li>
              <li><strong>Productos:</strong> fotos, descripciones, precios, categorías, etiquetas</li>
              <li><strong>Mensajes:</strong> cuando utiliza el formulario de contacto, recopilamos su nombre, correo electrónico, número de teléfono (opcional) y el contenido del mensaje</li>
            </ul>

            <p className="mt-4 font-medium">Información recopilada automáticamente:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Datos de uso:</strong> páginas visitadas, tiempo de navegación, interacciones con la plataforma</li>
              <li><strong>Datos del dispositivo:</strong> tipo de navegador, sistema operativo, dirección IP, preferencia de idioma y tema (claro/oscuro)</li>
              <li><strong>Cookies:</strong> utilizamos cookies para mantener su sesión, recordar su preferencia de idioma y tema</li>
            </ul>
          </Section>

          <Section title="3. Cómo Usamos su Información">
            <p>Utilizamos su información para:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Operar, mantener y mejorar la plataforma</li>
              <li>Crear y administrar su cuenta de usuario</li>
              <li>Permitir que los artesanos publiquen y gestionen sus productos</li>
              <li>Facilitar la comunicación entre compradores y artesanos a través del formulario de contacto</li>
              <li>Enviar correos electrónicos relacionados con consultas de productos</li>
              <li>Personalizar su experiencia (idioma, tema oscuro/claro)</li>
              <li>Cumplir con obligaciones legales y regulatorias</li>
              <li>Detectar y prevenir actividades fraudulentas o abusivas</li>
            </ul>
          </Section>

          <Section title="4. Servicios de Terceros">
            <p>
              Utilizamos los siguientes servicios de terceros para operar la
              plataforma. Cada uno tiene su propia política de privacidad y
              maneja sus datos de acuerdo con sus términos:
            </p>

            <div className="mt-4 space-y-4">
              <ThirdPartyService
                name="Clerk"
                purpose="Autenticación y gestión de cuentas de usuario (registro, inicio de sesión, gestión de sesiones)"
                privacyUrl="https://clerk.com/privacy"
                data="Nombre, correo electrónico, contraseña (hash), ID de usuario, metadatos de sesión"
              />
              <ThirdPartyService
                name="Neon (PostgreSQL)"
                purpose="Base de datos principal — almacena perfiles de artesanos, productos, imágenes y configuraciones"
                privacyUrl="https://neon.tech/privacy-policy"
                data="Todos los datos de perfil, productos y configuraciones de la plataforma"
              />
              <ThirdPartyService
                name="UploadThing"
                purpose="Almacenamiento y gestión de imágenes subidas (fotos de productos, portadas de perfil)"
                privacyUrl="https://uploadthing.com/privacy"
                data="Imágenes subidas por los usuarios"
              />
              <ThirdPartyService
                name="Resend"
                purpose="Envío de correos electrónicos — utilizado para el formulario de contacto entre compradores y artesanos"
                privacyUrl="https://resend.com/privacy"
                data="Nombre del remitente, correo electrónico, contenido del mensaje"
              />
              <ThirdPartyService
                name="Vercel"
                purpose="Alojamiento e infraestructura del sitio web"
                privacyUrl="https://vercel.com/legal/privacy-policy"
                data="Direcciones IP, logs del servidor, datos de rendimiento"
              />
            </div>
          </Section>

          <Section title="5. Cookies y Tecnologías Similares">
            <p>Utilizamos las siguientes cookies y tecnologías de almacenamiento local:</p>
            <div className="overflow-x-auto rounded-lg border border-carreta-gold/20">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-carreta-gold/10">
                    <th className="px-4 py-2 text-left font-medium">Cookie</th>
                    <th className="px-4 py-2 text-left font-medium">Propósito</th>
                    <th className="px-4 py-2 text-left font-medium">Duración</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-carreta-gold/10">
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">__session</td>
                    <td className="px-4 py-2">Sesión de autenticación (Clerk)</td>
                    <td className="px-4 py-2">Sesión / Persistente</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">locale</td>
                    <td className="px-4 py-2">Preferencia de idioma (es/en)</td>
                    <td className="px-4 py-2">1 año</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">theme</td>
                    <td className="px-4 py-2">Preferencia de tema (claro/oscuro)</td>
                    <td className="px-4 py-2">1 año</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs">
              Puede controlar las cookies desde la configuración de su navegador.
              La desactivación de cookies puede afectar la funcionalidad de la plataforma.
            </p>
          </Section>

          <Section title="6. Sus Derechos (Ley 8968 de Costa Rica)">
            <p>
              De acuerdo con la Ley de Protección de la Persona frente al
              Tratamiento de sus Datos Personales de Costa Rica (Ley 8968),
              usted tiene los siguientes derechos sobre su información personal:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Acceso:</strong> Solicitar una copia de todos los datos
                personales que tenemos sobre usted.
              </li>
              <li>
                <strong>Rectificación:</strong> Solicitar la corrección de datos
                inexactos o desactualizados.
              </li>
              <li>
                <strong>Cancelación:</strong> Solicitar la eliminación de sus
                datos personales cuando ya no sean necesarios para los fines
                para los cuales fueron recopilados.
              </li>
              <li>
                <strong>Oposición:</strong> Oponerse al tratamiento de sus datos
                para fines específicos.
              </li>
              <li>
                <strong>Revocación del consentimiento:</strong> Revocar su
                consentimiento para el tratamiento de sus datos en cualquier
                momento, sin afectar la legalidad del tratamiento previo.
              </li>
            </ul>
            <p className="mt-3">
              Para ejercer cualquiera de estos derechos, contáctenos a través de
              los canales indicados en la sección de Contacto. Responderemos a
              su solicitud dentro de los 15 días hábiles siguientes a su
              recepción, según lo establecido por la Ley 8968.
            </p>
          </Section>

          <Section title="7. Retención de Datos">
            <p>
              Conservamos su información personal solo durante el tiempo
              necesario para cumplir con los fines descritos en esta política,
              a menos que la ley exija o permita un período de retención más
              largo.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Datos de cuenta:</strong> mientras su cuenta esté activa</li>
              <li><strong>Productos e imágenes:</strong> mientras el producto esté publicado</li>
              <li><strong>Mensajes de contacto:</strong> 2 años después del envío</li>
              <li><strong>Cookies:</strong> según la duración especificada en la tabla de cookies</li>
            </ul>
            <p className="mt-2">
              Cuando los datos ya no sean necesarios, los eliminaremos de forma
              segura o los anonimizaremos.
            </p>
          </Section>

          <Section title="8. Seguridad de los Datos">
            <p>
              Implementamos medidas de seguridad técnicas y organizativas
              adecuadas para proteger su información personal, incluyendo:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Cifrado HTTPS en todas las comunicaciones</li>
              <li>Contraseñas almacenadas con hash (a través de Clerk)</li>
              <li>Acceso restringido a la base de datos</li>
              <li>Autenticación requerida para acceder al panel de administración</li>
              <li>Monitoreo regular de seguridad</li>
            </ul>
            <p className="mt-2">
              Sin embargo, ningún método de transmisión o almacenamiento
              electrónico es 100% seguro. No podemos garantizar la seguridad
              absoluta de su información.
            </p>
          </Section>

          <Section title="9. Transferencia Internacional de Datos">
            <p>
              Sus datos pueden ser transferidos y procesados en servidores
              ubicados fuera de Costa Rica, incluyendo Estados Unidos (donde se
              alojan nuestros servicios de Clerk, Neon, UploadThing, Resend y
              Vercel). Al utilizar la plataforma, usted consiente a esta
              transferencia internacional de datos.
            </p>
            <p>
              Nos aseguramos de que dichas transferencias cumplan con las leyes
              aplicables de protección de datos y que los destinatarios
              mantengan niveles adecuados de protección.
            </p>
          </Section>

          <Section title="10. Compartir Información con Terceros">
            <p><strong>No vendemos sus datos personales a terceros.</strong></p>
            <p>Podemos compartir su información en las siguientes circunstancias:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Entre compradores y artesanos:</strong> cuando un comprador
                utiliza el formulario de contacto, compartimos su nombre y correo
                electrónico con el artesano para facilitar la comunicación.
              </li>
              <li>
                <strong>Proveedores de servicios:</strong> compartimos datos con
                los servicios de terceros necesarios para operar la plataforma
                (Clerk, Neon, UploadThing, Resend, Vercel), según lo descrito
                en la Sección 4.
              </li>
              <li>
                <strong>Obligaciones legales:</strong> cuando la ley lo requiera,
                podemos divulgar su información para cumplir con procesos legales
                o solicitudes gubernamentales.
              </li>
              <li>
                <strong>Protección de derechos:</strong> cuando sea necesario para
                proteger nuestros derechos, propiedad o seguridad, o los de
                nuestros usuarios o el público.
              </li>
            </ul>
          </Section>

          <Section title="11. Privacidad de Menores">
            <p>
              La plataforma no está dirigida a menores de 18 años. No recopilamos
              intencionalmente información personal de menores. Si descubrimos
              que hemos recopilado datos de un menor sin consentimiento parental,
              eliminaremos dicha información de inmediato.
            </p>
          </Section>

          <Section title="12. Cambios a esta Política">
            <p>
              Podemos actualizar esta Política de Privacidad periódicamente. Le
              notificaremos sobre cambios significativos a través de un aviso en
              la plataforma o por correo electrónico. El uso continuado de la
              plataforma después de los cambios constituye la aceptación de la
              política actualizada.
            </p>
          </Section>

          <Section title="13. Contacto">
            <p>
              Si tiene preguntas, inquietudes o desea ejercer sus derechos según
              la Ley 8968, puede contactarnos a través de:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Formulario de contacto en el Sitio</li>
              <li>Correo electrónico: hola@puravidaartesania.com</li>
            </ul>
            <p className="mt-2 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
              Responderemos a su solicitud dentro de los 15 días hábiles
              siguientes, según lo establecido por la Ley 8968 de Costa Rica.
            </p>
          </Section>

          <div className="mt-8 pt-6 border-t border-carreta-red/10">
            <Link
              href="/"
              className="text-sm text-carreta-red hover:text-carreta-orange transition-colors"
            >
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
            Privacy Policy
          </h1>
          <p className="mt-1 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
            Last updated: July 2026
          </p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none dark:prose-invert space-y-6 text-[#1A1A2E]/80 dark:text-carreta-eggshell/80">
        <div className="rounded-xl border-2 border-carreta-gold/20 bg-carreta-gold/5 p-4 text-sm">
          <strong>⚠️ Legal Notice:</strong> This document is a template. We recommend
          consulting with an attorney to ensure it complies with all applicable laws
          for your business, particularly data protection laws.
        </div>

        <Section title="1. Introduction">
          <p>
            At Pura Vida Artesanías ("we," "our," "the Platform"), we take your
            privacy seriously. This Privacy Policy explains how we collect, use,
            share, and protect your personal information when you use our website
            and services.
          </p>
          <p>
            By using the Platform, you agree to the practices described in this
            policy. If you do not agree with any part, please do not use our services.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p className="font-medium">Information you provide directly:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Account data:</strong> full name, email address, password (securely stored by Clerk)</li>
            <li><strong>Artisan profile:</strong> business name, phone number, WhatsApp, website, Instagram and Facebook links, location, biography, cover photo</li>
            <li><strong>Products:</strong> photos, descriptions, prices, categories, tags</li>
            <li><strong>Messages:</strong> when using the contact form, we collect your name, email, phone number (optional), and message content</li>
          </ul>

          <p className="mt-4 font-medium">Information collected automatically:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Usage data:</strong> pages visited, browsing time, interactions with the platform</li>
            <li><strong>Device data:</strong> browser type, operating system, IP address, language and theme preference (light/dark)</li>
            <li><strong>Cookies:</strong> we use cookies to maintain your session, remember your language and theme preference</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Operate, maintain, and improve the platform</li>
            <li>Create and manage your user account</li>
            <li>Enable artisans to list and manage their products</li>
            <li>Facilitate communication between buyers and artisans via the contact form</li>
            <li>Send emails related to product inquiries</li>
            <li>Personalize your experience (language, dark/light theme)</li>
            <li>Comply with legal and regulatory obligations</li>
            <li>Detect and prevent fraudulent or abusive activity</li>
          </ul>
        </Section>

        <Section title="4. Third-Party Services">
          <p>
            We use the following third-party services to operate the platform.
            Each has its own privacy policy and handles your data according to
            their terms:
          </p>

          <div className="mt-4 space-y-4">
            <ThirdPartyService
              name="Clerk"
              purpose="Authentication and user account management (sign-up, sign-in, session management)"
              privacyUrl="https://clerk.com/privacy"
              data="Name, email, password (hash), user ID, session metadata"
            />
            <ThirdPartyService
              name="Neon (PostgreSQL)"
              purpose="Primary database — stores artisan profiles, products, images, and settings"
              privacyUrl="https://neon.tech/privacy-policy"
              data="All profile data, product data, and platform settings"
            />
            <ThirdPartyService
              name="UploadThing"
              purpose="Image upload and storage (product photos, profile covers)"
              privacyUrl="https://uploadthing.com/privacy"
              data="Images uploaded by users"
            />
            <ThirdPartyService
              name="Resend"
              purpose="Email delivery — used for the contact form between buyers and artisans"
              privacyUrl="https://resend.com/privacy"
              data="Sender name, email address, message content"
            />
            <ThirdPartyService
              name="Vercel"
              purpose="Website hosting and infrastructure"
              privacyUrl="https://vercel.com/legal/privacy-policy"
              data="IP addresses, server logs, performance data"
            />
          </div>
        </Section>

        <Section title="5. Cookies and Similar Technologies">
          <p>We use the following cookies and local storage technologies:</p>
          <div className="overflow-x-auto rounded-lg border border-carreta-gold/20">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-carreta-gold/10">
                  <th className="px-4 py-2 text-left font-medium">Cookie</th>
                  <th className="px-4 py-2 text-left font-medium">Purpose</th>
                  <th className="px-4 py-2 text-left font-medium">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-carreta-gold/10">
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">__session</td>
                  <td className="px-4 py-2">Authentication session (Clerk)</td>
                  <td className="px-4 py-2">Session / Persistent</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">locale</td>
                  <td className="px-4 py-2">Language preference (es/en)</td>
                  <td className="px-4 py-2">1 year</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">theme</td>
                  <td className="px-4 py-2">Theme preference (light/dark)</td>
                  <td className="px-4 py-2">1 year</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs">
            You can control cookies from your browser settings. Disabling cookies
            may affect platform functionality.
          </p>
        </Section>

        <Section title="6. Your Rights (Costa Rica Law 8968)">
          <p>
            In accordance with Costa Rica's Law for the Protection of Individuals
            regarding the Processing of their Personal Data (Law 8968), you have
            the following rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Access:</strong> Request a copy of all personal data we hold
              about you.
            </li>
            <li>
              <strong>Rectification:</strong> Request correction of inaccurate or
              outdated data.
            </li>
            <li>
              <strong>Cancellation:</strong> Request deletion of your personal data
              when it is no longer necessary for the purposes for which it was
              collected.
            </li>
            <li>
              <strong>Opposition:</strong> Object to the processing of your data
              for specific purposes.
            </li>
            <li>
              <strong>Revocation of consent:</strong> Withdraw your consent to data
              processing at any time, without affecting the lawfulness of prior
              processing.
            </li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact us through the channels
            listed in the Contact section. We will respond to your request within
            15 business days as established by Law 8968.
          </p>
        </Section>

        <Section title="7. Data Retention">
          <p>
            We retain your personal information only as long as necessary to
            fulfill the purposes described in this policy, unless a longer
            retention period is required or permitted by law.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Account data:</strong> while your account is active</li>
            <li><strong>Products and images:</strong> while the product is listed</li>
            <li><strong>Contact messages:</strong> 2 years after submission</li>
            <li><strong>Cookies:</strong> as specified in the cookies table</li>
          </ul>
          <p className="mt-2">
            When data is no longer needed, we will securely delete or anonymize it.
          </p>
        </Section>

        <Section title="8. Data Security">
          <p>
            We implement appropriate technical and organizational security
            measures to protect your personal information, including:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>HTTPS encryption for all communications</li>
            <li>Hashed password storage (via Clerk)</li>
            <li>Restricted database access</li>
            <li>Authentication required for dashboard access</li>
            <li>Regular security monitoring</li>
          </ul>
          <p className="mt-2">
            However, no method of electronic transmission or storage is 100%
            secure. We cannot guarantee absolute security of your information.
          </p>
        </Section>

        <Section title="9. International Data Transfer">
          <p>
            Your data may be transferred and processed on servers located outside
            of Costa Rica, including the United States (where our third-party
            services Clerk, Neon, UploadThing, Resend, and Vercel are hosted). By
            using the platform, you consent to this international data transfer.
          </p>
          <p>
            We ensure such transfers comply with applicable data protection laws
            and that recipients maintain adequate protection levels.
          </p>
        </Section>

        <Section title="10. Sharing Information with Third Parties">
          <p><strong>We do not sell your personal data to third parties.</strong></p>
          <p>We may share your information in the following circumstances:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Between buyers and artisans:</strong> when a buyer uses the
              contact form, we share their name and email with the artisan to
              facilitate communication.
            </li>
            <li>
              <strong>Service providers:</strong> we share data with the
              third-party services necessary to operate the platform (Clerk, Neon,
              UploadThing, Resend, Vercel) as described in Section 4.
            </li>
            <li>
              <strong>Legal obligations:</strong> when required by law, we may
              disclose your information to comply with legal processes or
              government requests.
            </li>
            <li>
              <strong>Protection of rights:</strong> when necessary to protect
              our rights, property, or safety, or those of our users or the public.
            </li>
          </ul>
        </Section>

        <Section title="11. Children's Privacy">
          <p>
            The platform is not directed at individuals under 18. We do not
            knowingly collect personal information from minors. If we discover
            that we have collected data from a minor without parental consent,
            we will delete that information immediately.
          </p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p>
            We may update this Privacy Policy periodically. We will notify you of
            significant changes through a notice on the platform or by email.
            Continued use of the platform after changes constitutes acceptance
            of the updated policy.
          </p>
        </Section>

        <Section title="13. Contact">
          <p>
            If you have questions, concerns, or wish to exercise your rights under
            Law 8968, you can contact us through:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Contact form on the Site</li>
            <li>Email: hola@puravidaartesania.com</li>
          </ul>
          <p className="mt-2 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
            We will respond to your request within 15 business days as established
            by Costa Rica Law 8968.
          </p>
        </Section>

        <div className="mt-8 pt-6 border-t border-carreta-red/10">
          <Link
            href="/"
            className="text-sm text-carreta-red hover:text-carreta-orange transition-colors"
          >
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
      <h2 className="text-xl font-semibold text-[#1A1A2E] dark:text-carreta-eggshell mb-3">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function ThirdPartyService({
  name,
  purpose,
  privacyUrl,
  data,
}: {
  name: string;
  purpose: string;
  privacyUrl: string;
  data: string;
}) {
  return (
    <div className="rounded-lg border border-carreta-blue/20 bg-carreta-blue/5 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-carreta-blue">{name}</h3>
        <a
          href={privacyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-carreta-blue/70 hover:text-carreta-blue underline underline-offset-2"
        >
          Privacy Policy →
        </a>
      </div>
      <p className="mt-1 text-sm text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
        <strong>Purpose:</strong> {purpose}
      </p>
      <p className="mt-0.5 text-xs text-[#1A1A2E]/50 dark:text-carreta-eggshell/50">
        <strong>Data shared:</strong> {data}
      </p>
    </div>
  );
}
