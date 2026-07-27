"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ApiError, getClases, getSedesFitness } from "@/lib/reservas/api";
import type { Clase } from "@/lib/reservas/types";
import { dayKey, formatDayLong, formatTime } from "@/lib/reservas/format";
import { waLinkSede } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "unavailable" } // la sede todavía no tiene reserva online configurada
  | { status: "ok"; sedeId: number; clases: Clase[] };

export function SedeClases({
  slug,
  sedeName,
  whatsappNumber,
}: {
  slug: string;
  sedeName: string;
  whatsappNumber: string;
}) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [reload, setReload] = useState(0);
  const [actividadId, setActividadId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSedesFitness()
      .then(async (sedes) => {
        const sede = sedes.find((s) => s.slug === slug);
        if (!sede) {
          if (!cancelled) setState({ status: "unavailable" });
          return;
        }
        const clases = await getClases(sede.id);
        if (!cancelled) setState({ status: "ok", sedeId: sede.id, clases });
      })
      .catch((err) => {
        if (!cancelled)
          setState({
            status: "error",
            message:
              err instanceof ApiError
                ? err.message
                : "No pudimos cargar las clases.",
          });
      });
    return () => {
      cancelled = true;
    };
  }, [slug, reload]);

  const retry = () => {
    setState({ status: "loading" });
    setActividadId(null);
    setReload((n) => n + 1);
  };

  const clases = useMemo(
    () => (state.status === "ok" ? state.clases : []),
    [state],
  );

  // Actividades presentes, con conteo, para las pills de filtro.
  const actividades = useMemo(() => {
    const map = new Map<
      number,
      { id: number; nombre: string; color: string; count: number }
    >();
    for (const c of clases) {
      const existing = map.get(c.actividad.id);
      if (existing) existing.count += 1;
      else
        map.set(c.actividad.id, {
          id: c.actividad.id,
          nombre: c.actividad.nombreCorto || c.actividad.nombre,
          color: c.actividad.color,
          count: 1,
        });
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [clases]);

  const grouped = useMemo(() => {
    const filtered =
      actividadId == null
        ? clases
        : clases.filter((c) => c.actividad.id === actividadId);
    const groups = new Map<string, Clase[]>();
    for (const c of filtered) {
      const key = dayKey(c.inicio);
      const arr = groups.get(key) ?? [];
      arr.push(c);
      groups.set(key, arr);
    }
    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, list]) => ({
        key,
        label: formatDayLong(list[0].inicio),
        clases: list.sort((a, b) => a.inicio.localeCompare(b.inicio)),
      }));
  }, [clases, actividadId]);

  const waHref = waLinkSede(sedeName, whatsappNumber);

  return (
    <section id="clases" className="py-24 md:py-32">
      <div className="container-clic">
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-yellow-deep">
          Clase de prueba · Gratis
        </p>
        <h2 className="display mb-6 text-5xl leading-[0.95] md:text-7xl">
          Reservá tu
          <br />
          <span className="italic-serif text-yellow">primera clase</span>.
        </h2>
        <p className="mb-16 max-w-xl text-lg text-cream/70">
          Elegí un horario de los próximos días y completá tus datos. Sin cargo,
          sin tarjeta. Te esperamos para que pruebes entrenar con nosotros.
        </p>

        {state.status === "loading" && (
          <p className="text-sm uppercase tracking-[0.2em] text-cream/50">
            Cargando horarios…
          </p>
        )}

        {(state.status === "unavailable" ||
          (state.status === "ok" && clases.length === 0)) && (
          <Fallback
            waHref={waHref}
            title={
              state.status === "unavailable"
                ? "Reservá por WhatsApp"
                : "No hay horarios disponibles ahora"
            }
            text={
              state.status === "unavailable"
                ? "Todavía estamos habilitando la reserva online en esta sede. Escribinos y coordinamos tu clase de prueba gratis."
                : "Los cupos de los próximos días ya están tomados. Escribinos por WhatsApp y te avisamos del próximo horario."
            }
          />
        )}

        {state.status === "error" && (
          <div className="border-l-2 border-yellow bg-cream/4 p-6">
            <p className="text-cream/80">{state.message}</p>
            <button
              type="button"
              onClick={retry}
              className="mt-4 text-xs uppercase tracking-[0.2em] text-yellow hover:text-white"
            >
              Reintentar
            </button>
          </div>
        )}

        {state.status === "ok" && clases.length > 0 && (
          <>
            {actividades.length > 1 && (
              <div className="mb-10 flex flex-wrap gap-2">
                <FilterPill
                  active={actividadId === null}
                  onClick={() => setActividadId(null)}
                  label="Todas"
                  count={clases.length}
                />
                {actividades.map((a) => (
                  <FilterPill
                    key={a.id}
                    active={actividadId === a.id}
                    onClick={() => setActividadId(a.id)}
                    label={a.nombre}
                    count={a.count}
                    color={a.color}
                  />
                ))}
              </div>
            )}

            <div className="space-y-10">
              {grouped.map((group) => (
                <div key={group.key}>
                  <p className="mb-4 text-xs uppercase tracking-[0.2em] text-yellow">
                    {group.label}
                  </p>
                  <div className="divide-y divide-cream/10 border-y border-cream/10">
                    {group.clases.map((clase) => (
                      <Link
                        key={clase.id}
                        href={`/sedes/${slug}/reservar/${clase.id}`}
                        className="group flex items-center justify-between gap-4 py-5 transition-colors hover:bg-cream/5"
                      >
                        <div className="flex items-center gap-4">
                          <span className="display text-2xl md:text-3xl">
                            {formatTime(clase.inicio)}
                          </span>
                          <span
                            className="size-2 shrink-0 rounded-full"
                            style={{ background: clase.actividad.color || "#fbfa3f" }}
                            aria-hidden="true"
                          />
                          <div>
                            <div className="text-sm text-cream/90">
                              {clase.actividad.nombre}
                            </div>
                            {clase.instructor && (
                              <div className="text-xs uppercase tracking-[0.15em] text-cream/50">
                                {clase.instructor}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-xs uppercase tracking-[0.2em] text-yellow transition-transform group-hover:translate-x-1">
                          Reservar →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  count,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex items-center gap-2 border px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors " +
        (active
          ? "border-yellow bg-yellow text-ink"
          : "border-cream/20 text-cream/70 hover:border-yellow/60")
      }
    >
      {color && (
        <span
          className="size-2 rounded-full"
          style={{ background: color }}
          aria-hidden="true"
        />
      )}
      <span>{label}</span>
      <span className={active ? "text-ink/60" : "text-cream/40"}>{count}</span>
    </button>
  );
}

function Fallback({
  waHref,
  title,
  text,
}: {
  waHref: string;
  title: string;
  text: string;
}) {
  return (
    <div className="border border-cream/15 bg-cream/4 p-8 md:p-10">
      <p className="display text-2xl md:text-3xl">{title}</p>
      <p className="mt-3 max-w-lg text-sm text-cream/70">{text}</p>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center justify-center gap-3 bg-yellow px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-white"
      >
        <WhatsAppIcon className="size-5" />
        Escribinos por WhatsApp
      </a>
    </div>
  );
}
