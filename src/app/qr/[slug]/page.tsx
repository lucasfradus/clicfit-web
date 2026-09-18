import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getQrLink } from "@/lib/qr/links";
import { leerEstadisticas, type Escaneo } from "@/lib/qr/store";
import { siteConfig } from "@/lib/content/site";

/** Panel interno: siempre al dia, nunca cacheado, nunca indexado. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Escaneos QR",
  robots: { index: false, follow: false },
};

const fechaHora = new Intl.DateTimeFormat("es-AR", {
  timeZone: "America/Argentina/Buenos_Aires",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

/** Etiqueta legible del dispositivo. El user-agent crudo queda en el title. */
function dispositivo(ua: string): string {
  if (/iPhone/i.test(ua)) return "iPhone";
  if (/iPad/i.test(ua)) return "iPad";
  if (/Android/i.test(ua)) return "Android";
  if (/Macintosh/i.test(ua)) return "Mac";
  if (/Windows/i.test(ua)) return "Windows";
  return ua ? "Otro" : "—";
}

/** De donde venia el hit. Sin referer es lo esperable en un escaneo de camara. */
function origen(escaneo: Escaneo): string {
  if (!escaneo.referer) return "Escaneo directo";
  try {
    return new URL(escaneo.referer).hostname;
  } catch {
    return escaneo.referer;
  }
}

function Metrica({ valor, etiqueta, detalle }: { valor: number; etiqueta: string; detalle: string }) {
  return (
    <div className="border border-cream/15 bg-cream/4 p-6">
      <p className="display text-5xl text-yellow md:text-6xl">{valor.toLocaleString("es-AR")}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cream">{etiqueta}</p>
      <p className="mt-1 text-xs text-cream/50">{detalle}</p>
    </div>
  );
}

export default async function PanelQrPage({ params, searchParams }: PageProps<"/qr/[slug]">) {
  const { slug } = await params;
  const link = getQrLink(slug);
  if (!link) notFound();

  // El panel muestra datos de trafico, asi que va detras de un token. Si la
  // variable no esta configurada en produccion, no se abre: preferimos un 404 a
  // dejarlo publico por olvido. En `next dev` entra libre.
  const tokenEsperado = process.env.QR_PANEL_TOKEN;
  const { token } = await searchParams;
  const enDesarrollo = process.env.NODE_ENV !== "production";
  if (!enDesarrollo && (!tokenEsperado || token !== tokenEsperado)) notFound();

  const stats = await leerEstadisticas(slug);
  const urlCorta = `${siteConfig.url}/q/${slug}`;
  const bots = stats.total - stats.humanos;

  return (
    <section className="min-h-screen bg-ink pb-24 pt-32 md:pt-40">
      <div className="container-clic max-w-4xl">
        <p className="text-xs uppercase tracking-[0.2em] text-yellow-deep">Escaneos de QR</p>
        <h1 className="display mt-3 text-5xl leading-[0.95] md:text-6xl">{link.titulo}</h1>

        <div className="mt-6 space-y-1 text-sm">
          <p className="text-cream/70">
            <span className="text-cream/40">QR apunta a · </span>
            <span className="text-cream">{urlCorta}</span>
          </p>
          <p className="text-cream/70">
            <span className="text-cream/40">Redirige a · </span>
            <a
              href={link.destino}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream underline decoration-cream/30 underline-offset-4 hover:text-yellow"
            >
              {link.destino}
            </a>
          </p>
        </div>

        {stats.backend === "memoria" && (
          <div className="mt-8 border-l-2 border-yellow bg-cream/4 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-yellow-deep">
              Contador sin persistencia
            </p>
            <p className="mt-2 text-sm text-cream/70">
              Faltan <code className="text-cream">UPSTASH_REDIS_REST_URL</code> y{" "}
              <code className="text-cream">UPSTASH_REDIS_REST_TOKEN</code>. La redirección funciona
              igual, pero el contador vive en la memoria del proceso que atendió el escaneo: se
              pierde en cada deploy y ni siquiera se ve acá si esta página la atiende otra
              instancia. Los números de abajo no sirven hasta configurar Upstash.
            </p>
          </div>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Metrica valor={stats.humanos} etiqueta="Escaneos" detalle="Descontando crawlers" />
          <Metrica valor={stats.unicos} etiqueta="Personas" detalle="Distintas, por día" />
          <Metrica valor={bots} etiqueta="Bots" detalle="Previews y buscadores" />
        </div>

        <h2 className="display mt-16 text-2xl">
          Últimos <span className="italic-serif text-yellow">escaneos</span>
        </h2>
        <p className="mt-2 text-xs text-cream/50">
          Se guardan los 100 más recientes. El total de arriba no tiene tope.
        </p>

        {stats.recientes.length === 0 ? (
          <p className="mt-8 border border-cream/15 bg-cream/4 p-6 text-sm text-cream/60">
            Todavía no escaneó nadie. Probá el QR con el teléfono y recargá esta página.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-cream/20 text-left text-xs uppercase tracking-[0.2em] text-cream/50">
                  <th className="py-3 pr-4 font-normal">Cuándo</th>
                  <th className="py-3 pr-4 font-normal">Dónde</th>
                  <th className="py-3 pr-4 font-normal">Dispositivo</th>
                  <th className="py-3 font-normal">Origen</th>
                </tr>
              </thead>
              <tbody>
                {stats.recientes.map((escaneo, i) => (
                  <tr
                    key={`${escaneo.ts}-${i}`}
                    className={`border-b border-cream/10 ${escaneo.bot ? "text-cream/35" : "text-cream/80"}`}
                  >
                    <td className="py-3 pr-4 whitespace-nowrap">{fechaHora.format(escaneo.ts)}</td>
                    <td className="py-3 pr-4">
                      {[escaneo.ciudad, escaneo.pais].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="py-3 pr-4" title={escaneo.ua}>
                      {dispositivo(escaneo.ua)}
                      {escaneo.bot && (
                        <span className="ml-2 border border-cream/25 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
                          bot
                        </span>
                      )}
                    </td>
                    <td className="py-3">{origen(escaneo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
