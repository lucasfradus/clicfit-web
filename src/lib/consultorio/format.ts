// Días del consultorio como YYYY-MM-DD de Argentina, que es lo que recibe el
// backend. La aritmética va en UTC para no depender de la zona del navegador.

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export function sumarDias(ymd: string, dias: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + dias)).toISOString().slice(0, 10);
}

/** Desde hoy hasta hoy + `dias`, inclusive. */
export function diasReservables(hoy: string, dias: number): string[] {
  return Array.from({ length: dias + 1 }, (_, i) => sumarDias(hoy, i));
}

export function partesDia(ymd: string): { dia: string; numero: number; mes: string } {
  const [y, m, d] = ymd.split("-").map(Number);
  const fecha = new Date(Date.UTC(y, m - 1, d));
  return { dia: DIAS[fecha.getUTCDay()], numero: d, mes: MESES[m - 1] };
}

const pesosFmt = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

/** "$ 12.000" */
export function pesos(n: number): string {
  return pesosFmt.format(n);
}
