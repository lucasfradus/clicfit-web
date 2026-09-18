/**
 * Elige dónde se guardan los escaneos y expone la única API que usa el resto
 * del código.
 *
 * Hoy escribe un JSON en disco, que alcanza para probar el QR sin montar nada.
 * Con `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` seteadas pasa a
 * Redis solo, sin cambios de código: ver `docs/qr.md`.
 */
import * as archivo from "./store-archivo";
import * as upstash from "./store-upstash";

export { MAX_RECIENTES, type Escaneo, type Estadisticas } from "./tipos";

import type { Escaneo, Estadisticas } from "./tipos";

const backend = upstash.configurado() ? upstash : archivo;

/**
 * Suma un escaneo. Se llama desde `after()`, ya con la redirección mandada, así
 * que nunca suma latencia a quien escanea. Por lo mismo no puede tirar: si el
 * backend falla, se loguea y listo — perder un escaneo es mejor que romper el
 * request.
 */
export async function registrarEscaneo(slug: string, escaneo: Escaneo): Promise<void> {
  try {
    await backend.registrarEscaneo(slug, escaneo);
  } catch (error) {
    console.error(`[qr] no se pudo registrar el escaneo de "${slug}"`, error);
  }
}

/** Lee las métricas para el panel. */
export function leerEstadisticas(slug: string): Promise<Estadisticas> {
  return backend.leerEstadisticas(slug);
}
