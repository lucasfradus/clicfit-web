/**
 * Backend de produccion: Upstash Redis por su API REST.
 *
 * Se habla con `fetch` pelado a proposito — el SDK `@upstash/redis` no aporta
 * nada acá y el repo pide no sumar dependencias sin consultar.
 *
 * Hoy no se usa: mientras no esten las variables de entorno, `store.ts` elige el
 * backend de archivo. Configurarlas es todo lo que hace falta para pasar a este,
 * sin tocar una linea de codigo.
 */
import { MAX_RECIENTES, type Escaneo, type Estadisticas } from "./tipos";

/** Upstash no debería demorar, y si demora no vale la pena esperarlo. */
const TIMEOUT_MS = 2_000;

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export function configurado(): boolean {
  return Boolean(UPSTASH_URL && UPSTASH_TOKEN);
}

const claves = (slug: string) => ({
  total: `qr:${slug}:total`,
  humanos: `qr:${slug}:humanos`,
  visitantes: `qr:${slug}:visitantes`,
  recientes: `qr:${slug}:recientes`,
});

type Comando = (string | number)[];

/** Manda varios comandos en un solo round-trip. Devuelve los resultados en orden. */
async function pipeline(comandos: Comando[]): Promise<unknown[]> {
  const res = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comandos),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Upstash respondió ${res.status}: ${await res.text()}`);
  }

  const cuerpo = (await res.json()) as { result?: unknown; error?: string }[];
  const conError = cuerpo.find((r) => r.error);
  if (conError) throw new Error(`Upstash: ${conError.error}`);

  return cuerpo.map((r) => r.result);
}

export async function registrarEscaneo(slug: string, escaneo: Escaneo): Promise<void> {
  const k = claves(slug);

  const comandos: Comando[] = [
    ["INCR", k.total],
    ["LPUSH", k.recientes, JSON.stringify(escaneo)],
    ["LTRIM", k.recientes, 0, MAX_RECIENTES - 1],
  ];
  // Los bots suman al total (para poder verlos) pero no ensucian el número real.
  if (!escaneo.bot) {
    comandos.push(["INCR", k.humanos], ["SADD", k.visitantes, escaneo.visitante]);
  }

  await pipeline(comandos);
}

export async function leerEstadisticas(slug: string): Promise<Estadisticas> {
  const k = claves(slug);

  const [total, humanos, unicos, recientes] = await pipeline([
    ["GET", k.total],
    ["GET", k.humanos],
    ["SCARD", k.visitantes],
    ["LRANGE", k.recientes, 0, MAX_RECIENTES - 1],
  ]);

  return {
    total: aEntero(total),
    humanos: aEntero(humanos),
    unicos: aEntero(unicos),
    recientes: aEscaneos(recientes),
    backend: "upstash",
    origen: "Upstash Redis",
  };
}

function aEntero(valor: unknown): number {
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
}

function aEscaneos(valor: unknown): Escaneo[] {
  if (!Array.isArray(valor)) return [];
  return valor.flatMap((item) => {
    if (typeof item !== "string") return [];
    try {
      return [JSON.parse(item) as Escaneo];
    } catch {
      return [];
    }
  });
}
