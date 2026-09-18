/**
 * Traduce un request entrante al `Escaneo` que se guarda.
 *
 * Nada de esto corre en el camino crítico: se usa adentro de `after()`, con la
 * redirección ya mandada.
 */
import type { Escaneo } from "./store";

/**
 * User-agents que no son una persona apuntando la cámara.
 *
 * Importa para el número real: apenas el link circula por WhatsApp o se indexa,
 * los previewers lo piden solos e inflan el contador. No se descartan, se
 * marcan: el panel muestra el total y el de humanos por separado.
 *
 * Ojo con "Instagram" a secas: ese user-agent es el navegador embebido de la
 * app, o sea una persona de verdad. El crawler de Meta es `facebookexternalhit`.
 */
const PATRON_BOT =
  /bot\b|crawl|spider|slurp|facebookexternalhit|facebot|whatsapp\/|telegrambot|twitterbot|discordbot|slackbot|embedly|redditbot|applebot|ahrefs|semrush|bingpreview|preview|curl\/|wget|python-requests|go-http-client|headlesschrome|lighthouse|pingdom|uptimerobot/i;

export function esBot(userAgent: string): boolean {
  if (!userAgent.trim()) return true;
  return PATRON_BOT.test(userAgent);
}

/** Día en horario argentino, formato YYYY-MM-DD. Rota el hash de visitante. */
function diaLocal(fecha: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(fecha);
}

/**
 * Identificador efímero de visitante.
 *
 * La IP entra al hash pero no se guarda en ningún lado, y el día forma parte de
 * la entrada, así que el mismo teléfono da un id distinto mañana. Alcanza para
 * "cuántas personas distintas escanearon" sin quedarse con un dato personal.
 */
async function hashVisitante(ip: string, userAgent: string, fecha: Date): Promise<string> {
  const salt = process.env.QR_HASH_SALT ?? "clicfit-qr";
  const entrada = `${salt}|${ip}|${userAgent}|${diaLocal(fecha)}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(entrada));
  return Array.from(new Uint8Array(digest))
    .slice(0, 6)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function primeraIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "desconocida";
}

/** Vercel manda la ciudad URL-encodeada ("Buenos%20Aires"). */
function headerGeo(headers: Headers, nombre: string): string | null {
  const valor = headers.get(nombre);
  if (!valor) return null;
  try {
    return decodeURIComponent(valor);
  } catch {
    return valor;
  }
}

export async function construirEscaneo(headers: Headers, ahora = new Date()): Promise<Escaneo> {
  const ua = headers.get("user-agent") ?? "";
  return {
    ts: ahora.getTime(),
    pais: headerGeo(headers, "x-vercel-ip-country"),
    ciudad: headerGeo(headers, "x-vercel-ip-city"),
    ua,
    referer: headers.get("referer"),
    bot: esBot(ua),
    visitante: await hashVisitante(primeraIp(headers), ua, ahora),
  };
}
