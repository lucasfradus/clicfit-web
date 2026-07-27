const TZ = "America/Argentina/Buenos_Aires";

export function formatDayLong(iso: string): string {
  // "Viernes 18 de abril"
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("es-AR", {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);
  return parts.charAt(0).toUpperCase() + parts.slice(1);
}

export function formatTime(iso: string): string {
  // "18:30"
  const d = new Date(iso);
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

/**
 * Clave para agrupar clases por día en el huso de Buenos Aires, así una clase de
 * las 23:00 no salta al día siguiente.
 */
export function dayKey(iso: string): string {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value ?? "";
  const m = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  return `${y}-${m}-${day}`;
}
