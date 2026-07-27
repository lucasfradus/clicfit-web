import type { Clase, ReservaResponse, ReservarPayload, Sede } from "./types";

// Backend de reservas (Clicnet). Client-side: el rate-limit de la API es por IP,
// así que las llamadas salen del browser del usuario, no de un proxy del server.
// Override con NEXT_PUBLIC_RESERVAS_API_URL; default al backend de producción.
const BASE_URL =
  process.env.NEXT_PUBLIC_RESERVAS_API_URL ?? "https://app.clicpilates.com";

// Sólo sedes de fitness (Sede.plantillaRutina = "GIMNASIO"), que además relaja el
// requisito de cuenta MercadoPago porque la clase de prueba es gratis.
const TIPO = "GIMNASIO";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor.", 0);
  }

  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
      else if (body?.message) message = body.message;
    } catch {
      /* noop */
    }
    throw new ApiError(message, res.status);
  }

  return res.json() as Promise<T>;
}

// Los Decimal de Prisma llegan como string en JSON. Normalizamos a number | null.
function toNumber(v: unknown): number | null {
  if (v == null) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function normalizeSede(raw: Sede & { precioPrueba: unknown; fotos?: unknown }): Sede {
  return {
    ...raw,
    precioPrueba: toNumber(raw.precioPrueba),
    fotos: Array.isArray(raw.fotos)
      ? raw.fotos.filter((f): f is string => typeof f === "string" && f !== "")
      : [],
  };
}

export async function getSedesFitness(): Promise<Sede[]> {
  const raw = await request<Array<Sede & { precioPrueba: unknown; fotos?: unknown }>>(
    `/api/public/sedes?tipo=${TIPO}`,
  );
  return raw.map(normalizeSede);
}

export function getClases(sedeId: number): Promise<Clase[]> {
  return request<Clase[]>(`/api/public/sedes/${sedeId}/clases?tipo=${TIPO}`);
}

export function reservar(payload: ReservarPayload): Promise<ReservaResponse> {
  return request<ReservaResponse>("/api/public/reservar", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
