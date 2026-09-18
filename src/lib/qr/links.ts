/**
 * Registro de links cortos con contador de escaneos.
 *
 * Cada entrada expone `clicfit.ar/q/<slug>` y redirige a `destino`. El slug
 * viaja adentro del QR, así que conviene que sea corto: menos caracteres =
 * menos módulos en el QR = más fácil de leer de lejos o impreso chico.
 *
 * Fuente de verdad en código, igual que el resto del contenido del sitio (ver
 * `src/lib/content/`). Agregar un link es sumar un objeto a esta lista y
 * pushear: Vercel redeploya solo.
 */
export type QrLink = {
  /** Lo que va después de /q/ en la URL. Solo minúsculas, números y guiones. */
  slug: string;
  /** Nombre para el panel de métricas. No lo ve quien escanea. */
  titulo: string;
  /** A dónde se manda al usuario. URL absoluta, con protocolo. */
  destino: string;
};

export const qrLinks: readonly QrLink[] = [
  {
    slug: "gorroswine",
    titulo: "Gorros Wine — Instagram",
    destino: "https://instagram.com/gorroswine",
  },
] as const;

export function getQrLink(slug: string): QrLink | undefined {
  return qrLinks.find((link) => link.slug === slug);
}
