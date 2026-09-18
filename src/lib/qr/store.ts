/**
 * Persistencia de los escaneos de QR.
 *
 * Backend real: Upstash Redis por su API REST. Se habla con `fetch` pelado a
 * propósito — el SDK `@upstash/redis` no aporta nada acá y el repo pide no sumar
 * dependencias sin consultar.
 *
 * Si no están las variables de entorno, cae a un contador en memoria del
 * proceso. Eso sirve para `next dev` y para que un deploy sin configurar no
 * rompa la redirección, pero NO cuenta de verdad en producción: Vercel levanta y
 * apaga instancias todo el tiempo, así que cada una arranca en cero. El panel
 * avisa cuando está en ese modo.
 */

/** Un escaneo. Sin IP ni nada que identifique a una persona (ver `visitante`). */
export type Escaneo = {
  /** Epoch en ms. */
  ts: number;
  pais: string | null;
  ciudad: string | null;
  ua: string;
  referer: string | null;
  /** true si el user-agent parece un crawler y no una persona con una cámara. */
  bot: boolean;
  /**
   * Hash corto de IP + user-agent + día. Permite contar visitantes distintos sin
   * guardar la IP, y se rota solo cada 24hs porque el día entra al hash.
   */
  visitante: string;
};

export type Estadisticas = {
  /** Todos los hits, bots incluidos. */
  total: number;
  /** Hits que no parecen crawler. Es el número que importa. */
  humanos: number;
  /** Visitantes distintos (aproximado: se rota por día). */
  unicos: number;
  /** Los últimos escaneos, del más nuevo al más viejo. */
  recientes: Escaneo[];
  backend: "upstash" | "memoria";
};

/** Cuántos escaneos guarda el detalle. El total no tiene tope. */
const MAX_RECIENTES = 100;

/** Upstash no debería demorar, y si demora no vale la pena esperarlo. */
const TIMEOUT_MS = 2_000;

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function hayUpstash(): boolean {
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

// ─────────────────────────────────────────
// Fallback en memoria
// ─────────────────────────────────────────

type EnMemoria = {
  total: number;
  humanos: number;
  visitantes: Set<string>;
  recientes: Escaneo[];
};

const memoria = new Map<string, EnMemoria>();

function bucket(slug: string): EnMemoria {
  let actual = memoria.get(slug);
  if (!actual) {
    actual = { total: 0, humanos: 0, visitantes: new Set(), recientes: [] };
    memoria.set(slug, actual);
  }
  return actual;
}

// ─────────────────────────────────────────
// API pública
// ─────────────────────────────────────────

/**
 * Suma un escaneo. Se llama desde `after()`, ya con la redirección mandada, así
 * que nunca suma latencia a quien escanea. Por lo mismo no puede tirar: si
 * Upstash falla, se loguea y listo — perder un escaneo es mejor que romper el
 * request.
 */
export async function registrarEscaneo(slug: string, escaneo: Escaneo): Promise<void> {
  const k = claves(slug);

  if (!hayUpstash()) {
    const b = bucket(slug);
    b.total += 1;
    if (!escaneo.bot) {
      b.humanos += 1;
      b.visitantes.add(escaneo.visitante);
    }
    b.recientes.unshift(escaneo);
    b.recientes.length = Math.min(b.recientes.length, MAX_RECIENTES);
    return;
  }

  const comandos: Comando[] = [
    ["INCR", k.total],
    ["LPUSH", k.recientes, JSON.stringify(escaneo)],
    ["LTRIM", k.recientes, 0, MAX_RECIENTES - 1],
  ];
  // Los bots suman al total (para poder verlos) pero no ensucian el número real.
  if (!escaneo.bot) {
    comandos.push(["INCR", k.humanos], ["SADD", k.visitantes, escaneo.visitante]);
  }

  try {
    await pipeline(comandos);
  } catch (error) {
    console.error(`[qr] no se pudo registrar el escaneo de "${slug}"`, error);
  }
}

/** Lee las métricas para el panel. Un solo round-trip. */
export async function leerEstadisticas(slug: string): Promise<Estadisticas> {
  const k = claves(slug);

  if (!hayUpstash()) {
    const b = bucket(slug);
    return {
      total: b.total,
      humanos: b.humanos,
      unicos: b.visitantes.size,
      recientes: b.recientes,
      backend: "memoria",
    };
  }

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
