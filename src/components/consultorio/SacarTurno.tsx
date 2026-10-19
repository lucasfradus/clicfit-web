"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, getSedesFitness } from "@/lib/reservas/api";
import { checkout, getHuecos, getServicios } from "@/lib/consultorio/api";
import type {
  HuecoPublico,
  PrestacionPublica,
  ServicioPublico,
} from "@/lib/consultorio/types";
import { diasReservables, partesDia, pesos } from "@/lib/consultorio/format";
import { dayKey, formatDayLong, formatTime } from "@/lib/reservas/format";
import {
  datosVacios,
  limpiar,
  validate,
  type DatosPersonales,
  type FormErrors,
} from "@/lib/reservas/datos";
import { siteConfig } from "@/lib/content/site";
import { waLink } from "@/lib/whatsapp";
import { Field } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; servicios: ServicioPublico[] };

type Paso = "servicio" | "prestacion" | "horario" | "datos" | "confirmar";

const TITULOS: Record<Paso, string> = {
  servicio: "¿Dónde?",
  prestacion: "¿Qué consulta?",
  horario: "¿Cuándo?",
  datos: "Tus datos",
  confirmar: "Confirmar",
};

const claveServicio = (s: ServicioPublico) => `${s.servicioId}-${s.sede.id}`;

function mensajeError(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}

/** "Desde $ 20.000 · seña $ 5.000" (sin seña, sólo el precio). */
function textoPrecio(precio: number, sena: number, desde = false): string {
  const p = `${desde ? "Desde " : ""}${pesos(precio)}`;
  return sena > 0 ? `${p} · seña ${pesos(sena)}` : p;
}

/**
 * Los servicios de consultorio de las sedes de fitness. Si alguna sede tiene
 * además otros (kinesiología, por ejemplo), en esta página van sólo los de
 * nutrición; si ninguno se llama así, se muestran todos.
 */
async function cargarServicios(): Promise<ServicioPublico[]> {
  const [sedes, servicios] = await Promise.all([
    getSedesFitness(),
    getServicios(),
  ]);
  const fitness = new Set(sedes.map((s) => s.id));
  const deFitness = servicios.filter(
    (s) => fitness.has(s.sede.id) && s.prestaciones.length > 0,
  );
  const nutricion = deFitness.filter((s) => /nutri/i.test(s.nombre));
  return nutricion.length > 0 ? nutricion : deFitness;
}

/**
 * Turno de nutrición para no socios: consulta → horario → datos → confirmar y
 * pagar la seña en Mercado Pago. Si hay más de un servicio (varias sedes), antes
 * se elige dónde. El paso sale de lo elegido, como en la web de socios.
 */
export function SacarTurno() {
  const router = useRouter();
  const [load, setLoad] = useState<LoadState>({ status: "loading" });
  const [clave, setClave] = useState<string | null>(null);
  const [prestacionId, setPrestacionId] = useState<number | null>(null);
  const [dia, setDia] = useState<string | null>(null);
  const [hueco, setHueco] = useState<HuecoPublico | null>(null);
  const [form, setForm] = useState<DatosPersonales>(datosVacios);
  const [errors, setErrors] = useState<FormErrors>({});
  const [datosListos, setDatosListos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [esSocio, setEsSocio] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    cargarServicios()
      .then((servicios) => {
        if (!cancelled) setLoad({ status: "ok", servicios });
      })
      .catch((err) => {
        if (!cancelled)
          setLoad({
            status: "error",
            message: mensajeError(err, "No pudimos cargar los turnos."),
          });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const servicios = load.status === "ok" ? load.servicios : [];
  const varios = servicios.length > 1;
  const servicio = varios
    ? servicios.find((s) => claveServicio(s) === clave)
    : servicios[0];
  const prestacion = servicio?.prestaciones.find((p) => p.id === prestacionId);

  const pasos: Paso[] = varios
    ? ["servicio", "prestacion", "horario", "datos", "confirmar"]
    : ["prestacion", "horario", "datos", "confirmar"];
  const paso: Paso = !servicio
    ? "servicio"
    : !prestacion
      ? "prestacion"
      : !hueco
        ? "horario"
        : !datosListos
          ? "datos"
          : "confirmar";
  const numero = pasos.indexOf(paso) + 1;

  // En el celular la lista puede quedar arriba de la pantalla: al cambiar de
  // paso, volver al título.
  const primerRender = useRef(true);
  useEffect(() => {
    if (primerRender.current) {
      primerRender.current = false;
      return;
    }
    const el = ref.current;
    if (el && el.getBoundingClientRect().top < 0)
      el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [paso]);

  function elegirServicio(s: ServicioPublico) {
    setClave(claveServicio(s));
    setPrestacionId(null);
    setDia(null);
    setHueco(null);
  }

  function elegirPrestacion(p: PrestacionPublica) {
    setPrestacionId(p.id);
    setHueco(null);
    setSubmitError(null);
  }

  function elegirHueco(h: HuecoPublico) {
    setHueco(h);
    setSubmitError(null);
  }

  function volver() {
    setSubmitError(null);
    if (paso === "confirmar") setDatosListos(false);
    else if (paso === "datos") setHueco(null);
    else if (paso === "horario") setPrestacionId(null);
    else setClave(null);
  }

  function reiniciar() {
    setClave(null);
    setPrestacionId(null);
    setDia(null);
    setHueco(null);
    setDatosListos(false);
    setSubmitError(null);
  }

  const handleChange =
    (field: keyof DatosPersonales) => (e: FormEvent<HTMLInputElement>) => {
      const value = (e.target as HTMLInputElement).value;
      setForm((f) => ({ ...f, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleDatos = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validate(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setDatosListos(true);
  };

  async function confirmar() {
    if (!prestacion || !hueco || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await checkout({
        prestacionId: prestacion.id,
        franjaId: hueco.franjaId,
        inicio: hueco.inicio,
        ...limpiar(form),
        volverA: `${window.location.origin}/nutricion/turno/gracias`,
      });
      if ("esSocio" in res) {
        setEsSocio(res.mensaje);
        setSubmitting(false);
        return;
      }
      if ("initPoint" in res) {
        window.location.assign(res.initPoint);
        return; // queda "Redirigiendo…" hasta que carga Mercado Pago
      }
      router.push(`/nutricion/turno/gracias?token=${encodeURIComponent(res.token)}`);
    } catch (err) {
      setSubmitting(false);
      if (err instanceof ApiError && err.status === 409) {
        // El horario se ocupó mientras completaba los datos: a elegir otro.
        setDatosListos(false);
        setHueco(null);
        setSubmitError(
          `${err.message || "Ese horario ya no está disponible."} Elegí otro horario.`,
        );
      } else {
        setSubmitError(
          mensajeError(err, "No pudimos iniciar el pago. Probá de nuevo."),
        );
      }
    }
  }

  if (load.status === "loading") {
    return (
      <p className="text-sm uppercase tracking-[0.2em] text-cream/50">
        Cargando turnos…
      </p>
    );
  }

  if (load.status === "error") {
    return (
      <Aviso>
        <p className="text-cream/80">{load.message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 inline-block text-xs uppercase tracking-[0.2em] text-yellow hover:text-white"
        >
          Reintentar →
        </button>
      </Aviso>
    );
  }

  if (servicios.length === 0) {
    return (
      <Aviso>
        <p className="text-cream/80">
          Por ahora no hay turnos de nutrición para sacar online. Escribinos y
          te ayudamos a coordinar uno.
        </p>
        <a
          href={waLink("Hola Clic! Quiero sacar un turno de nutrición.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-xs uppercase tracking-[0.2em] text-yellow hover:text-white"
        >
          Escribinos por WhatsApp →
        </a>
      </Aviso>
    );
  }

  if (esSocio) {
    return (
      <Aviso>
        <p className="text-xs uppercase tracking-[0.2em] text-yellow-deep">
          Ya sos socio
        </p>
        <p className="mt-2 text-cream/80">{esSocio}</p>
        <a
          href={`${siteConfig.clientesUrl}/consultorio`}
          className="mt-6 inline-block bg-yellow px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-white"
        >
          Sacar turno como socio
        </a>
      </Aviso>
    );
  }

  const resumen = [
    servicio && (varios ? `${servicio.nombre} · ${servicio.sede.nombre}` : servicio.sede.nombre),
    prestacion && `${prestacion.nombre} · ${prestacion.duracionMinutos} min`,
    hueco && `${formatDayLong(hueco.inicio)}, ${formatTime(hueco.inicio)} hs`,
  ].filter(Boolean);

  return (
    <div ref={ref} className="scroll-mt-28 max-w-2xl">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.3em] text-yellow-deep">
          Turno de nutrición
        </p>
        <p className="text-xs uppercase tracking-[0.2em] text-cream/50">
          Paso {numero} de {pasos.length}
        </p>
      </div>
      <div className="mt-4 flex gap-1.5" aria-hidden="true">
        {pasos.map((p, i) => (
          <span
            key={p}
            className={cn(
              "h-1 flex-1 transition-colors",
              i < numero ? "bg-yellow" : "bg-cream/15",
            )}
          />
        ))}
      </div>

      <div className="mt-8">
        {numero > 1 && (
          <button
            type="button"
            onClick={volver}
            disabled={submitting}
            className="mb-4 text-xs uppercase tracking-[0.2em] text-cream/50 hover:text-yellow disabled:opacity-50"
          >
            ← Volver
          </button>
        )}
        <h1 className="display text-5xl leading-[0.95] md:text-6xl">
          {TITULOS[paso]}
        </h1>
        {resumen.length > 0 && (
          <p className="mt-4 text-sm text-cream/60">
            {resumen.join(" · ")}
            {numero > 1 && (
              <>
                {" · "}
                <button
                  type="button"
                  onClick={reiniciar}
                  disabled={submitting}
                  className="text-yellow underline-offset-4 hover:underline"
                >
                  cambiar
                </button>
              </>
            )}
          </p>
        )}
      </div>

      {submitError && (
        <div
          role="alert"
          className="mt-8 border-l-2 border-yellow bg-cream/4 p-4 text-sm text-cream/80"
        >
          {submitError}
        </div>
      )}

      <div className="mt-10">
        {paso === "servicio" && (
          <ul className="space-y-3">
            {servicios.map((s) => (
              <li key={claveServicio(s)}>
                <Opcion onClick={() => elegirServicio(s)}>
                  <span className="display block text-2xl">{s.sede.nombre}</span>
                  <span className="mt-1 block text-sm text-cream/60">
                    {s.nombre} · {s.sede.direccion}
                  </span>
                </Opcion>
              </li>
            ))}
          </ul>
        )}

        {paso === "prestacion" && servicio && (
          <ul className="space-y-3">
            {servicio.prestaciones.map((p) => (
              <li key={p.id}>
                <Opcion onClick={() => elegirPrestacion(p)}>
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="display text-2xl">{p.nombre}</span>
                    <span className="shrink-0 text-xs uppercase tracking-[0.2em] text-cream/50">
                      {p.duracionMinutos} min
                    </span>
                  </span>
                  {p.descripcion && (
                    <span className="mt-2 block text-sm leading-relaxed text-cream/70">
                      {p.descripcion}
                    </span>
                  )}
                  <span className="mt-3 block text-sm text-yellow-deep">
                    {textoPrecio(p.precioDesde, p.senaDesde, true)}
                  </span>
                </Opcion>
              </li>
            ))}
          </ul>
        )}

        {paso === "horario" && servicio && prestacion && (
          <ElegirHorario
            sedeId={servicio.sede.id}
            prestacionId={prestacion.id}
            diasAdelante={servicio.diasReservaAnticipada}
            dia={dia}
            onDia={setDia}
            onElegir={elegirHueco}
          />
        )}

        {paso === "datos" && (
          <form onSubmit={handleDatos} noValidate className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Nombre"
                name="nombre"
                autoComplete="given-name"
                value={form.nombre}
                onChange={handleChange("nombre")}
                error={errors.nombre}
              />
              <Field
                label="Apellido"
                name="apellido"
                autoComplete="family-name"
                value={form.apellido}
                onChange={handleChange("apellido")}
                error={errors.apellido}
              />
            </div>
            <Field
              label="DNI"
              name="dni"
              inputMode="numeric"
              placeholder="12345678"
              maxLength={10}
              value={form.dni}
              onChange={handleChange("dni")}
              error={errors.dni}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={handleChange("email")}
              error={errors.email}
            />
            <Field
              label="Teléfono"
              name="telefono"
              type="tel"
              autoComplete="tel"
              placeholder="+54 9 11 …"
              value={form.telefono}
              onChange={handleChange("telefono")}
              error={errors.telefono}
            />
            <button
              type="submit"
              className="w-full bg-yellow px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-white"
            >
              Continuar
            </button>
            <p className="text-xs text-cream/40">
              Usamos tus datos sólo para este turno: te mandamos la confirmación
              por email y la sede te contacta si hace falta.
            </p>
          </form>
        )}

        {paso === "confirmar" && servicio && prestacion && hueco && (
          <Confirmar
            servicio={servicio}
            prestacion={prestacion}
            hueco={hueco}
            datos={form}
            submitting={submitting}
            onConfirmar={confirmar}
          />
        )}
      </div>
    </div>
  );
}

/** Tira de días (hoy … hoy + diasAdelante, en hora argentina) + horarios libres. */
function ElegirHorario({
  sedeId,
  prestacionId,
  diasAdelante,
  dia,
  onDia,
  onElegir,
}: {
  sedeId: number;
  prestacionId: number;
  diasAdelante: number;
  dia: string | null;
  onDia: (ymd: string) => void;
  onElegir: (h: HuecoPublico) => void;
}) {
  const dias = useMemo(
    () => diasReservables(dayKey(new Date().toISOString()), diasAdelante),
    [diasAdelante],
  );
  const elegido = dia && dias.includes(dia) ? dia : dias[0];
  const [huecos, setHuecos] = useState<{
    clave: string;
    lista: HuecoPublico[] | null;
    error?: string;
  } | null>(null);
  const clave = `${sedeId}-${prestacionId}-${elegido}`;

  useEffect(() => {
    let vigente = true;
    getHuecos({ sedeId, prestacionId, fecha: elegido })
      .then((lista) => vigente && setHuecos({ clave, lista }))
      .catch(
        (err) =>
          vigente &&
          setHuecos({
            clave,
            lista: [],
            error: mensajeError(err, "No pudimos cargar los horarios."),
          }),
      );
    return () => {
      vigente = false;
    };
  }, [sedeId, prestacionId, elegido, clave]);

  // Mientras llegan los del día nuevo no se muestran los del anterior.
  const actuales = huecos?.clave === clave ? huecos : null;

  return (
    <div>
      <div
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0"
        role="group"
        aria-label="Día del turno"
      >
        {dias.map((d) => {
          const p = partesDia(d);
          const activo = d === elegido;
          return (
            <button
              key={d}
              type="button"
              onClick={() => onDia(d)}
              aria-pressed={activo}
              aria-label={`${p.dia} ${p.numero} de ${p.mes}`}
              className={cn(
                "flex w-16 shrink-0 flex-col items-center border py-3 transition-colors",
                activo
                  ? "border-yellow bg-yellow text-ink"
                  : "border-cream/20 text-cream hover:border-yellow",
              )}
            >
              <span className="text-[10px] uppercase tracking-[0.2em]">
                {p.dia}
              </span>
              <span className="display mt-1 text-2xl leading-none">
                {p.numero}
              </span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.2em] opacity-60">
                {p.mes}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8" aria-live="polite">
        {actuales === null ? (
          <p className="text-sm uppercase tracking-[0.2em] text-cream/50">
            Buscando horarios…
          </p>
        ) : actuales.error ? (
          <p className="border-l-2 border-yellow bg-cream/4 p-4 text-sm text-cream/80">
            {actuales.error}
          </p>
        ) : actuales.lista?.length === 0 ? (
          <p className="border border-cream/15 bg-cream/4 p-6 text-sm text-cream/70">
            No hay horarios libres este día. Probá con otro.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {actuales.lista?.map((h) => (
              <li key={`${h.franjaId}-${h.inicio}`}>
                <Opcion onClick={() => onElegir(h)}>
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="display text-3xl">
                      {formatTime(h.inicio)}
                    </span>
                    <span className="text-right text-sm text-cream/70">
                      {h.profesional}
                    </span>
                  </span>
                  <span className="mt-2 block text-sm text-yellow-deep">
                    {textoPrecio(h.precio, h.sena)}
                  </span>
                </Opcion>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Confirmar({
  servicio,
  prestacion,
  hueco,
  datos,
  submitting,
  onConfirmar,
}: {
  servicio: ServicioPublico;
  prestacion: PrestacionPublica;
  hueco: HuecoPublico;
  datos: DatosPersonales;
  submitting: boolean;
  onConfirmar: () => void;
}) {
  const conSena = hueco.sena > 0;
  return (
    <div className="space-y-6">
      <div className="border border-cream/15 bg-cream/4 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-yellow-deep">
          {servicio.nombre}
        </p>
        <h2 className="display mt-3 text-3xl">{prestacion.nombre}</h2>

        <dl className="mt-6 space-y-3 border-t border-cream/10 pt-6 text-sm">
          <Fila label="Fecha" value={formatDayLong(hueco.inicio)} />
          <Fila
            label="Horario"
            value={`${formatTime(hueco.inicio)} a ${formatTime(hueco.fin)}`}
          />
          <Fila label="Profesional" value={hueco.profesional} />
          <Fila
            label="Sede"
            value={
              <>
                {servicio.sede.nombre}
                <span className="block text-cream/50">
                  {servicio.sede.direccion}
                </span>
              </>
            }
          />
          <Fila label="A nombre de" value={`${datos.nombre} ${datos.apellido}`} />
        </dl>

        <dl className="mt-6 space-y-3 border-t border-cream/10 pt-6 text-sm">
          <Fila label="Precio de la consulta" value={pesos(hueco.precio)} />
          {conSena && (
            <Fila
              label="Pagás el día de la consulta"
              value={pesos(hueco.precio - hueco.sena)}
            />
          )}
        </dl>

        <div className="mt-6 flex items-center justify-between border-t border-cream/10 pt-6">
          <span className="text-cream/50">
            {conSena ? "Seña ahora" : "Pagás en la sede"}
          </span>
          <span className="display text-3xl text-yellow">
            {pesos(conSena ? hueco.sena : hueco.precio)}
          </span>
        </div>
      </div>

      <div className="border-l-2 border-yellow bg-cream/4 p-6 text-sm leading-relaxed text-cream/70">
        {conSena ? (
          <ul className="space-y-2">
            <li>
              Ahora pagás la seña de {pesos(hueco.sena)} con Mercado Pago y el
              resto ({pesos(hueco.precio - hueco.sena)}) se lo pagás al
              profesional el día de la consulta.
            </li>
            <li>Te guardamos el horario 15 minutos mientras pagás.</li>
            <li>
              La seña no se devuelve: si cancelás, la perdés; si cambiás el
              horario, la conservás.
            </li>
            <li>Para cancelar o cambiar el turno, contactá a la sede.</li>
          </ul>
        ) : (
          <p>
            La consulta se la pagás al profesional el día del turno. Para
            cancelar o cambiar el turno, contactá a la sede.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onConfirmar}
        disabled={submitting}
        className="w-full bg-yellow px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-white disabled:opacity-60"
      >
        {submitting
          ? conSena
            ? "Redirigiendo a Mercado Pago…"
            : "Confirmando…"
          : conSena
            ? `Pagar seña ${pesos(hueco.sena)}`
            : "Confirmar turno"}
      </button>
    </div>
  );
}

function Opcion({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full border border-cream/15 bg-cream/4 p-5 text-left transition-colors hover:border-yellow focus-visible:border-yellow md:p-6"
    >
      {children}
    </button>
  );
}

function Fila({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-cream/50">{label}</dt>
      <dd className="text-right text-cream/90">{value}</dd>
    </div>
  );
}

function Aviso({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-2xl border-l-2 border-yellow bg-cream/4 p-6">
      {children}
      <Link
        href="/nutricion"
        className="mt-6 block text-xs uppercase tracking-[0.2em] text-cream/50 hover:text-yellow"
      >
        ← Volver a Nutrición
      </Link>
    </div>
  );
}
