import { request } from "@/lib/reservas/api";
import type {
  CheckoutPayload,
  CheckoutResponse,
  HuecoPublico,
  ServicioPublico,
  TurnoEstado,
} from "./types";

// Consultorio (nutrición) para no socios. Mismo backend y mismo criterio que la
// clase de prueba: las llamadas salen del browser. Las respuestas vienen como
// `{ data }` (los errores, `{ error }`, ya los convierte `request` en ApiError).

async function data<T>(path: string, init?: RequestInit): Promise<T> {
  const body = await request<{ data: T }>(`/api/public/consultorio${path}`, init);
  return body.data;
}

export function getServicios(sedeId?: number): Promise<ServicioPublico[]> {
  return data(`/servicios${sedeId ? `?sedeId=${sedeId}` : ""}`);
}

export function getHuecos(params: {
  sedeId: number;
  prestacionId: number;
  /** YYYY-MM-DD de Argentina. */
  fecha: string;
}): Promise<HuecoPublico[]> {
  const q = new URLSearchParams({
    sedeId: String(params.sedeId),
    prestacionId: String(params.prestacionId),
    fecha: params.fecha,
  });
  return data(`/huecos?${q.toString()}`);
}

export function checkout(payload: CheckoutPayload): Promise<CheckoutResponse> {
  return data("/checkout", { method: "POST", body: JSON.stringify(payload) });
}

export function getEstado(token: string): Promise<TurnoEstado> {
  return data(`/estado/${encodeURIComponent(token)}`);
}
