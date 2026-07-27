"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatDayLong, formatTime } from "@/lib/reservas/format";

/** Fecha en formato UTC compacto para iCalendar: YYYYMMDDTHHMMSSZ. */
function toIcsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function downloadIcs(opts: {
  actividad: string;
  fecha: string;
  sede: string;
  direccion: string;
}): void {
  const start = new Date(opts.fecha);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const location = opts.direccion ? `${opts.sede}, ${opts.direccion}` : opts.sede;
  const uid = `${start.getTime()}@clicfit`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CLIC FIT//Reservas//ES",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsUtc(start)}`,
    `DTSTART:${toIcsUtc(start)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${opts.actividad} - CLIC FIT`,
    `LOCATION:${location}`,
    "DESCRIPTION:Clase de prueba en CLIC FIT",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const a = document.createElement("a");
  a.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
  a.download = "clase-prueba-clicfit.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function Confirmada() {
  const params = useSearchParams();
  const actividad = params.get("actividad") ?? "";
  const fecha = params.get("fecha") ?? "";
  const sede = params.get("sede") ?? "";
  const direccion = params.get("direccion") ?? "";
  const whatsapp = params.get("whatsapp") ?? "";

  const fechaDate = fecha ? new Date(fecha) : null;
  const fechaValida = fechaDate != null && !Number.isNaN(fechaDate.getTime());
  const hayDetalle = Boolean(actividad) && fechaValida;

  return (
    <section className="min-h-screen bg-ink pb-24 pt-32 md:pt-40">
      <div className="container-clic max-w-2xl">
        <div className="flex size-16 items-center justify-center rounded-full bg-yellow text-ink">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden="true">
            <path
              d="M20 6 9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="display mt-8 text-5xl leading-[0.95] md:text-6xl">
          ¡Reserva
          <br />
          <span className="italic-serif text-yellow">confirmada</span>!
        </h1>
        <p className="mt-4 text-lg text-cream/70">
          Tu clase de prueba está agendada. Te enviamos un email con los
          detalles.
        </p>

        {hayDetalle && (
          <div className="mt-10 border border-cream/15 bg-cream/4 p-8">
            <p className="display text-3xl">{actividad}</p>
            <p className="mt-1 text-cream/70">
              {formatDayLong(fecha)} a las {formatTime(fecha)} hs
            </p>
            {sede && (
              <p className="mt-4 text-sm text-cream/80">
                <span className="text-cream/50">Sede · </span>
                {sede}
                {direccion && (
                  <span className="block text-cream/50">{direccion}</span>
                )}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => downloadIcs({ actividad, fecha, sede, direccion })}
                className="border border-cream/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:border-yellow hover:text-yellow"
              >
                Agregar al calendario
              </button>
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-yellow px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-white"
                >
                  WhatsApp de la sede
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 border-l-2 border-yellow bg-cream/4 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-yellow-deep">
            ¿Es tu primera vez?
          </p>
          <p className="mt-2 text-sm text-cream/70">
            Llegá 10 minutos antes de tu clase. Traé ropa cómoda para entrenar y
            tu botella de agua. El resto lo ponemos nosotros.
          </p>
        </div>

        <Link
          href="/"
          className="mt-10 inline-block text-xs uppercase tracking-[0.2em] text-cream/50 hover:text-yellow"
        >
          ← Volver al inicio
        </Link>
      </div>
    </section>
  );
}

export default function ReservaConfirmadaPage() {
  return (
    <Suspense
      fallback={
        <section className="min-h-screen bg-ink pt-40">
          <div className="container-clic">
            <p className="text-sm uppercase tracking-[0.2em] text-cream/50">
              Cargando…
            </p>
          </div>
        </section>
      }
    >
      <Confirmada />
    </Suspense>
  );
}
