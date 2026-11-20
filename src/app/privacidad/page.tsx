import type { Metadata } from "next";
import { siteConfig } from "@/lib/content/site";

const ULTIMA_ACTUALIZACION = "20 de noviembre de 2026";

export const metadata: Metadata = {
  title: "Política de privacidad de ClicNet",
  description:
    "Cómo ClicNet, la plataforma de gestión de la red Clic, recopila, usa, comparte y protege los datos personales, incluidos los mensajes de WhatsApp de las sedes.",
  alternates: { canonical: "/privacidad" },
  openGraph: {
    title: "Política de privacidad de ClicNet",
    description:
      "Cómo ClicNet recopila, usa, comparte y protege los datos personales.",
    url: `${siteConfig.url}/privacidad`,
  },
};

export default function PrivacidadPage() {
  const { nombre, cuit, domicilio, emailPrivacidad } = siteConfig.titular;

  return (
    <section className="bg-ink pt-32 pb-20">
      <div className="container-clic">
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-yellow-deep">
            Legal
          </p>
          <h1
            className="display leading-[0.9]"
            style={{ fontSize: "clamp(40px, 8vw, 88px)" }}
          >
            Política de{" "}
            <span className="italic-serif text-yellow">privacidad</span> de
            ClicNet
          </h1>
          <p className="mt-6 text-sm text-cream/50">
            <strong className="font-semibold text-cream/70">
              Última actualización:
            </strong>{" "}
            {ULTIMA_ACTUALIZACION}
          </p>

          <div className="mt-10 space-y-4 text-base leading-relaxed text-cream/75 [&_strong]:font-semibold [&_strong]:text-cream">
            <p>
              Esta política explica cómo ClicNet, la plataforma de gestión que
              usan los estudios y centros de la red Clic (Clic Fitness, Clic
              Studio Pilates y sedes asociadas), recopila, usa, comparte y
              protege los datos personales, incluidos los mensajes de WhatsApp
              que las sedes gestionan desde la plataforma.
            </p>

            <Titulo>1. Responsable</Titulo>
            <p>
              ClicNet es desarrollada y operada por <strong>{nombre}</strong>,
              CUIT {cuit}, con domicilio en {domicilio}.
            </p>
            <p>
              Contacto para temas de privacidad: <Mail email={emailPrivacidad} />
            </p>
            <p>
              Cada sede o franquicia que usa ClicNet es responsable de los datos
              de sus propios clientes. ClicNet actúa como{" "}
              <strong>encargado del tratamiento</strong>: procesa esos datos por
              cuenta de la sede y solo para prestarle el servicio.
            </p>

            <Titulo>2. Qué datos tratamos</Titulo>
            <p>
              <strong>
                De las sedes y sus usuarios (personal, recepción,
                administración):
              </strong>
            </p>
            <Lista>
              <li>Nombre, email, teléfono y rol dentro de la sede.</li>
              <li>Datos de acceso y registros de uso de la plataforma.</li>
            </Lista>
            <p>
              <strong>
                De los clientes y potenciales clientes de las sedes:
              </strong>
            </p>
            <Lista>
              <li>Datos de contacto: nombre, teléfono, email.</li>
              <li>
                Datos de membresía: plan, asistencias, reservas, pagos y estado
                de cuenta.
              </li>
              <li>
                <strong>Mensajes de WhatsApp</strong> intercambiados con el
                número de WhatsApp Business de la sede: texto, archivos
                multimedia, fecha y hora, estado de entrega y lectura, y el
                nombre de perfil público de WhatsApp.
              </li>
              <li>
                Cuando la sede lo autoriza al conectar su número, el{" "}
                <strong>historial de conversaciones</strong> de hasta 180 días
                previos y la lista de contactos de su cuenta de WhatsApp
                Business.
              </li>
            </Lista>
            <p>
              No tratamos datos sensibles de salud. Si un cliente los comparte
              por mensaje, solo se almacenan como parte de la conversación.
            </p>

            <Titulo>3. Para qué los usamos</Titulo>
            <Lista>
              <li>
                Permitir que cada sede envíe, reciba y responda mensajes de
                WhatsApp desde ClicNet.
              </li>
              <li>
                Asociar las conversaciones con la ficha del cliente o potencial
                cliente correspondiente.
              </li>
              <li>
                Enviar mensajes automáticos de atención (respuestas a consultas
                frecuentes, horarios, precios, reservas, recordatorios)
                configurados por la sede, siempre con posibilidad de derivar a
                una persona.
              </li>
              <li>Gestionar membresías, reservas y cobros.</li>
              <li>
                Generar métricas internas de atención para la sede (tiempos de
                respuesta, consultas atendidas).
              </li>
              <li>
                Mantener la seguridad, prevenir fraudes y cumplir obligaciones
                legales.
              </li>
            </Lista>
            <p>
              No vendemos datos personales ni los usamos para publicidad de
              terceros.
            </p>

            <Titulo>4. Con quién compartimos datos</Titulo>
            <Lista>
              <li>
                <strong>Meta Platforms (WhatsApp Business Platform):</strong>{" "}
                los mensajes se envían y reciben a través de la API oficial de
                WhatsApp, sujeta a las políticas de Meta.
              </li>
              <li>
                <strong>Proveedores de infraestructura:</strong> servidores y
                bases de datos alojados en Railway (puede implicar transferencia
                internacional, principalmente a Estados Unidos).
              </li>
              <li>
                <strong>Proveedores de inteligencia artificial:</strong> cuando
                la sede activa respuestas automáticas, el texto necesario para
                generar la respuesta se procesa con proveedores como Anthropic.
                No se usa para entrenar modelos.
              </li>
              <li>
                <strong>Procesadores de pago:</strong> Mercado Pago, para cobros
                y débitos automáticos.
              </li>
              <li>
                <strong>La sede correspondiente:</strong> cada sede accede solo
                a los datos de sus propios clientes.
              </li>
              <li>
                <strong>Autoridades:</strong> cuando una ley u orden judicial lo
                exija.
              </li>
            </Lista>
            <p>
              Todos los proveedores tratan los datos solo para prestar su
              servicio y con medidas de seguridad adecuadas.
            </p>

            <Titulo>5. Conservación</Titulo>
            <Lista>
              <li>
                Los mensajes y datos de clientes se conservan mientras la sede
                tenga activo el servicio.
              </li>
              <li>
                Si una sede desconecta su número de WhatsApp o deja de usar
                ClicNet, sus conversaciones se eliminan dentro de los{" "}
                <strong>90 días</strong>, salvo que la sede pida exportarlas
                antes o que una obligación legal exija conservarlas.
              </li>
              <li>Los registros de seguridad se conservan hasta 12 meses.</li>
            </Lista>

            <Titulo>6. Seguridad</Titulo>
            <p>
              Usamos conexiones cifradas (HTTPS/TLS), control de acceso por
              usuario y rol, separación de datos por sede y registros de
              actividad. Las credenciales de acceso a WhatsApp se guardan
              cifradas.
            </p>

            <Titulo>7. Tus derechos</Titulo>
            <p>
              Según la Ley 25.326 de Protección de Datos Personales, podés
              solicitar el{" "}
              <strong>acceso, rectificación, actualización o supresión</strong>{" "}
              de tus datos.
            </p>
            <Lista>
              <li>
                Si sos cliente de una sede, podés pedirlo directamente a esa
                sede o escribirnos a <Mail email={emailPrivacidad} /> y lo
                gestionamos con ella.
              </li>
              <li>
                Respondemos dentro de los plazos legales: 10 días corridos para
                acceso y 5 días hábiles para rectificación o supresión.
              </li>
            </Lista>
            <p>
              La{" "}
              <strong>
                Agencia de Acceso a la Información Pública (AAIP)
              </strong>
              , órgano de control de la Ley 25.326, atiende denuncias y reclamos
              por incumplimiento de las normas de protección de datos
              personales.
            </p>

            <Titulo id="eliminacion-de-datos">8. Eliminación de datos</Titulo>
            <p>Para pedir la eliminación de tus datos:</p>
            <ol className="list-decimal space-y-2 pl-5 marker:text-yellow-deep">
              <li>
                Escribí a <Mail email={emailPrivacidad} /> con el asunto
                &quot;Eliminación de datos&quot;.
              </li>
              <li>
                Indicá tu nombre, el número de teléfono con el que te
                comunicaste y la sede.
              </li>
              <li>
                Confirmamos la recepción y eliminamos los datos dentro de los{" "}
                <strong>30 días</strong>, salvo los que debamos conservar por
                obligación legal. Te avisamos cuando esté hecho.
              </li>
            </ol>
            <p>
              Las sedes pueden desconectar su número de WhatsApp en cualquier
              momento desde la app de WhatsApp Business (Configuración › Cuenta
              › Plataforma empresarial) o desde ClicNet. A partir de ese momento
              ClicNet deja de recibir sus mensajes.
            </p>

            <Titulo>9. Cambios en esta política</Titulo>
            <p>
              Si hacemos cambios importantes, lo informaremos en esta página y a
              las sedes por email.
            </p>

            <Titulo>10. Contacto</Titulo>
            <p>
              {nombre} — <Mail email={emailPrivacidad} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Titulo({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="display scroll-mt-28 pt-8 text-2xl leading-tight text-cream md:text-3xl"
    >
      {children}
    </h2>
  );
}

function Lista({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-yellow-deep">
      {children}
    </ul>
  );
}

function Mail({ email }: { email: string }) {
  return (
    <a
      href={`mailto:${email}`}
      className="font-semibold text-cream underline decoration-yellow-deep underline-offset-4 transition-colors hover:text-yellow"
    >
      {email}
    </a>
  );
}
