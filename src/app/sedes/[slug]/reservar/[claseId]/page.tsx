"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ApiError, getClases, getSedesFitness, reservar } from "@/lib/reservas/api";
import type { Clase, Sede } from "@/lib/reservas/types";
import { formatDayLong, formatTime } from "@/lib/reservas/format";

type LoadState =
  | { status: "loading" }
  | { status: "notfound" }
  | { status: "error"; message: string }
  | { status: "ok"; clase: Clase; sede: Sede };

type FormErrors = Partial<
  Record<"nombre" | "apellido" | "email" | "telefono" | "dni", string>
>;

function validate(form: {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
}): FormErrors {
  const errors: FormErrors = {};
  if (!form.nombre.trim()) errors.nombre = "Ingresá tu nombre";
  if (!form.apellido.trim()) errors.apellido = "Ingresá tu apellido";
  if (!form.email.trim()) errors.email = "Ingresá tu email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "Email inválido";
  if (!form.telefono.trim()) errors.telefono = "Ingresá tu teléfono";
  else if (form.telefono.replace(/\D/g, "").length < 8)
    errors.telefono = "Teléfono demasiado corto";
  const dniDigits = form.dni.replace(/\D/g, "");
  if (!form.dni.trim()) errors.dni = "Ingresá tu DNI";
  else if (dniDigits.length < 7 || dniDigits.length > 8)
    errors.dni = "DNI inválido";
  return errors;
}

export default function ReservarPage() {
  const params = useParams<{ slug: string; claseId: string }>();
  const router = useRouter();
  const slug = params.slug;
  const claseId = Number(params.claseId);

  const [load, setLoad] = useState<LoadState>(() =>
    Number.isFinite(claseId) ? { status: "loading" } : { status: "notfound" },
  );
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    dni: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    // claseId inválido ya quedó como "notfound" en el estado inicial.
    if (!Number.isFinite(claseId)) return;
    let cancelled = false;
    (async () => {
      try {
        const sedes = await getSedesFitness();
        const sede = sedes.find((s) => s.slug === slug);
        if (!sede) {
          if (!cancelled) setLoad({ status: "notfound" });
          return;
        }
        const clases = await getClases(sede.id);
        const clase = clases.find((c) => c.id === claseId);
        if (!clase) {
          if (!cancelled) setLoad({ status: "notfound" });
          return;
        }
        if (!cancelled) setLoad({ status: "ok", clase, sede });
      } catch (err) {
        if (!cancelled)
          setLoad({
            status: "error",
            message:
              err instanceof ApiError
                ? err.message
                : "No pudimos cargar los datos de la reserva.",
          });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, claseId]);

  const handleChange =
    (field: keyof typeof form) => (e: FormEvent<HTMLInputElement>) => {
      const value = (e.target as HTMLInputElement).value;
      setForm((f) => ({ ...f, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (load.status !== "ok" || submitting) return;

    const validation = validate(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await reservar({
        claseId: load.clase.id,
        sedeId: load.sede.id,
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim(),
        dni: form.dni.replace(/\D/g, ""),
      });

      const q = new URLSearchParams({
        actividad: res.actividad,
        fecha: res.fecha,
        sede: res.sede,
        direccion: res.direccion,
        whatsapp: res.whatsapp,
      });
      router.push(`/reserva-confirmada?${q.toString()}`);
    } catch (err) {
      setSubmitting(false);
      if (err instanceof ApiError) {
        if (err.status === 409)
          setSubmitError(
            "Ese horario se llenó o ya tenías una reserva. Elegí otro horario.",
          );
        else if (err.status === 404)
          setSubmitError("La clase ya no está disponible. Elegí otro horario.");
        else setSubmitError(err.message);
      } else {
        setSubmitError("No pudimos procesar la reserva. Probá de nuevo.");
      }
    }
  };

  const resumen = useMemo(() => {
    if (load.status !== "ok") return null;
    return {
      actividad: load.clase.actividad.nombre,
      fecha: `${formatDayLong(load.clase.inicio)} · ${formatTime(load.clase.inicio)}`,
      sede: load.sede.nombre,
      instructor: load.clase.instructor,
    };
  }, [load]);

  if (load.status === "loading") {
    return (
      <Shell>
        <p className="text-sm uppercase tracking-[0.2em] text-cream/50">
          Cargando reserva…
        </p>
      </Shell>
    );
  }

  if (load.status === "notfound") {
    return (
      <Shell>
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-yellow-deep">
          Clase no disponible
        </p>
        <h1 className="display text-5xl md:text-6xl">Ese horario ya no existe</h1>
        <p className="mt-4 max-w-md text-cream/70">
          Puede que los cupos se hayan agotado. Elegí otro horario disponible.
        </p>
        <Link
          href={`/sedes/${slug}#clases`}
          className="mt-8 inline-block text-xs uppercase tracking-[0.2em] text-yellow hover:text-white"
        >
          Ver horarios →
        </Link>
      </Shell>
    );
  }

  if (load.status === "error") {
    return (
      <Shell>
        <div className="border-l-2 border-yellow bg-cream/4 p-6">
          <p className="text-cream/80">{load.message}</p>
          <Link
            href={`/sedes/${slug}#clases`}
            className="mt-4 inline-block text-xs uppercase tracking-[0.2em] text-yellow hover:text-white"
          >
            Volver a los horarios →
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <Link
        href={`/sedes/${slug}#clases`}
        className="mb-8 inline-block text-xs uppercase tracking-[0.2em] text-cream/50 hover:text-yellow"
      >
        ← Cambiar horario
      </Link>

      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-yellow-deep">
        Clase de prueba · Gratis
      </p>
      <h1 className="display text-5xl leading-[0.95] md:text-6xl">
        Completá tus datos
      </h1>
      <p className="mt-4 max-w-xl text-cream/70">
        Con esta información reservamos tu lugar y te enviamos la confirmación.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Nombre"
              name="nombre"
              autoComplete="given-name"
              value={form.nombre}
              onChange={handleChange("nombre")}
              error={errors.nombre}
              disabled={submitting}
            />
            <Field
              label="Apellido"
              name="apellido"
              autoComplete="family-name"
              value={form.apellido}
              onChange={handleChange("apellido")}
              error={errors.apellido}
              disabled={submitting}
            />
          </div>
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={handleChange("email")}
            error={errors.email}
            disabled={submitting}
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
            disabled={submitting}
          />
          <Field
            label="DNI"
            name="dni"
            inputMode="numeric"
            placeholder="12345678"
            maxLength={10}
            value={form.dni}
            onChange={handleChange("dni")}
            error={errors.dni}
            disabled={submitting}
          />

          {submitError && (
            <div className="border-l-2 border-yellow bg-cream/4 p-4 text-sm text-cream/80">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-yellow px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-white disabled:opacity-60"
          >
            {submitting ? "Reservando…" : "Reservar clase de prueba"}
          </button>

          <p className="text-xs text-cream/40">
            No creamos ninguna cuenta paga. Solo usamos tus datos para esta
            reserva y para avisarte novedades de tu clase.
          </p>
        </form>

        {resumen && (
          <aside className="h-fit border border-cream/15 bg-cream/4 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-yellow-deep">
              Tu clase de prueba
            </p>
            <h2 className="display mt-3 text-3xl">{resumen.actividad}</h2>
            <p className="mt-1 text-sm text-cream/60">{resumen.sede}</p>

            <dl className="mt-6 space-y-3 border-t border-cream/10 pt-6 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-cream/50">Fecha</dt>
                <dd className="text-right text-cream/90">{resumen.fecha}</dd>
              </div>
              {resumen.instructor && (
                <div className="flex justify-between gap-4">
                  <dt className="text-cream/50">Profe</dt>
                  <dd className="text-right text-cream/90">
                    {resumen.instructor}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-6 flex items-center justify-between border-t border-cream/10 pt-6">
              <span className="text-cream/50">Total</span>
              <span className="display text-3xl text-yellow">Gratis</span>
            </div>
          </aside>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-ink pb-24 pt-32 md:pt-40">
      <div className="container-clic">{children}</div>
    </section>
  );
}

function Field({
  label,
  error,
  ...rest
}: {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-cream/60">
        {label}
      </span>
      <input
        {...rest}
        className={
          "w-full border bg-transparent px-4 py-3 text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-yellow " +
          (error ? "border-red-400/70" : "border-cream/20")
        }
      />
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
