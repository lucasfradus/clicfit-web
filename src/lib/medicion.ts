import { sendGAEvent } from "@next/third-parties/google";
import contacts from "@/contacts.json";

/**
 * Medición de conversiones (GA4, y por importación desde GA4, Google Ads).
 *
 * Los eventos se marcan como "eventos clave" en GA4 y se importan a Ads; por eso
 * los nombres son contrato con la consola: no renombrarlos sin avisar.
 *
 * - `generate_lead`      reserva de clase de prueba confirmada (la conversión principal)
 * - `contacto_whatsapp`  click a un WhatsApp de sede o general
 * - `lead_franquicia`    click al WhatsApp de franquicias (no es un socio: va aparte)
 */

export type EventoMedicion =
  | "generate_lead"
  | "contacto_whatsapp"
  | "lead_franquicia";

export function medir(
  evento: EventoMedicion,
  params: Record<string, string | number | undefined> = {},
): void {
  if (!process.env.NEXT_PUBLIC_GA_ID || typeof window === "undefined") return;
  sendGAEvent("event", evento, params);
}

/** Qué evento corresponde a un link de WhatsApp y de qué sede es. */
export function clasificarWhatsApp(
  href: string,
  pathname: string,
): { evento: EventoMedicion; sede: string } | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.hostname !== "wa.me" && url.hostname !== "api.whatsapp.com") return null;

  const telefono =
    url.pathname.replace(/\D/g, "") || (url.searchParams.get("phone") ?? "");
  if (telefono === contacts.franquicias.whatsapp) {
    return { evento: "lead_franquicia", sede: "franquicias" };
  }

  // En la página de una sede el slug de la URL manda: las sedes que llegan del
  // backend sin número propio comparten el de otra.
  const enSede = pathname.match(/^\/sedes\/([^/]+)/)?.[1];
  const porTelefono = Object.entries(contacts.sedes).find(
    ([, c]) => c.whatsapp === telefono,
  )?.[0];
  return { evento: "contacto_whatsapp", sede: enSede ?? porTelefono ?? "general" };
}

// ── Atribución de Google Ads ────────────────────────────────────────────────
// El gclid llega en la URL del primer click del anuncio y se pierde al navegar.
// Se guarda 90 días (la ventana de conversión máxima de Ads) para mandarlo con la
// reserva: con eso Clicnet puede devolverle a Google qué prueba terminó en socio.

const CLAVE_GCLID = "clic_gclid";
const VENTANA_MS = 90 * 24 * 60 * 60 * 1000;
const PARAMS_CLICK_ID = ["gclid", "gbraid", "wbraid"] as const;

type ClickId = { gclid?: string; gbraid?: string; wbraid?: string };
type ClickIdGuardado = {
  valor: string;
  param: (typeof PARAMS_CLICK_ID)[number];
  ts: number;
};

export function capturarGclid(search: string): void {
  const params = new URLSearchParams(search);
  for (const param of PARAMS_CLICK_ID) {
    const valor = params.get(param);
    if (!valor) continue;
    try {
      const dato: ClickIdGuardado = { valor, param, ts: Date.now() };
      localStorage.setItem(CLAVE_GCLID, JSON.stringify(dato));
    } catch {
      /* storage bloqueado: sin atribución offline, GA4 igual mide */
    }
    return;
  }
}

/** El click id de Google Ads vigente, si hay uno. */
export function leerGclid(): ClickId {
  try {
    const crudo = localStorage.getItem(CLAVE_GCLID);
    if (!crudo) return {};
    const dato = JSON.parse(crudo) as ClickIdGuardado;
    if (Date.now() - dato.ts > VENTANA_MS) {
      localStorage.removeItem(CLAVE_GCLID);
      return {};
    }
    return { [dato.param]: dato.valor };
  } catch {
    return {};
  }
}
