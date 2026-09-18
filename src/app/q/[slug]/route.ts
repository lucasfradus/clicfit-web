import { after, NextResponse } from "next/server";

import { getQrLink } from "@/lib/qr/links";
import { construirEscaneo } from "@/lib/qr/request";
import { registrarEscaneo } from "@/lib/qr/store";

/**
 * Link corto con contador: `clicfit.ar/q/<slug>` → destino real.
 *
 * Por qué un route handler y no una página que redirige por JS: acá el browser
 * recibe un 302 y se va al destino en el mismo viaje, sin pintar nada. Una
 * página intermedia obliga a bajar HTML, ejecutar JS y recién ahí navegar —
 * medio segundo de pantalla en blanco que el usuario ve.
 *
 * El conteo va adentro de `after()`: corre después de que la respuesta salió,
 * así que el escaneo no paga la latencia de escribir en Redis.
 */

// El contador tiene que ver todos los escaneos: sin esto Next podría cachear la
// respuesta y los hits siguientes nunca llegarían al servidor.
export const dynamic = "force-dynamic";

/**
 * 302 y no 301 a propósito. Un 301 queda cacheado en el browser: el segundo
 * escaneo del mismo teléfono iría directo a Instagram sin pasar por acá y el
 * contador se quedaría clavado.
 */
const REDIRECT_INIT = {
  status: 302,
  headers: { "Cache-Control": "no-store, max-age=0" },
} as const;

export async function GET(request: Request, ctx: RouteContext<"/q/[slug]">) {
  const { slug } = await ctx.params;
  const link = getQrLink(slug);

  if (!link) {
    return new NextResponse("Link no encontrado", {
      status: 404,
      headers: REDIRECT_INIT.headers,
    });
  }

  // Se clonan los headers porque `request` no sobrevive al final del handler.
  const headers = new Headers(request.headers);
  after(async () => {
    await registrarEscaneo(slug, await construirEscaneo(headers));
  });

  return NextResponse.redirect(link.destino, REDIRECT_INIT);
}

/**
 * Sin este handler Next resuelve el HEAD corriendo el GET, y cada preview de
 * WhatsApp o Slack que sondea el link sumaría un escaneo de más. Redirige igual,
 * pero no cuenta.
 */
export async function HEAD(_request: Request, ctx: RouteContext<"/q/[slug]">) {
  const { slug } = await ctx.params;
  const link = getQrLink(slug);

  if (!link) {
    return new NextResponse(null, { status: 404, headers: REDIRECT_INIT.headers });
  }

  return NextResponse.redirect(link.destino, REDIRECT_INIT);
}
