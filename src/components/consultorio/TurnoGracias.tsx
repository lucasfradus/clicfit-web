"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";
import { getEstado } from "@/lib/consultorio/api";
import type { TurnoEstado } from "@/lib/consultorio/types";
import { pesos } from "@/lib/consultorio/format";
import { formatDayLong, formatTime } from "@/lib/reservas/format";
import { cn } from "@/lib/utils";

/**
 * La vuelta de Mercado Pago después de pagar la seña.
 *
 * No confía en lo que viene en la URL (salvo el token): consulta el turno en el
 * backend, que si sigue pendiente le pregunta a MP. Mientras siga pendiente
 * reintenta unos segundos, porque el webhook suele tardar un poco.
 */

const REINTENTOS = 8;
const ESPERA_MS = 2500;

type Vista =
  | { tipo: "cargando" }
  | { tipo: "turno"; turno: TurnoEstado; esperando: boolean }
  | { tipo: "sin-dato" };

/** Una sola vez por turno, aunque recargue la página. */
function medirConfirmado(token: string, turno: TurnoEstado) {
  if (!process.env.NEXT_PUBLIC_GA_ID) return;
  const key = `ga-turno-${token}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    /* storage bloqueado: se mide igual */
  }
  sendGAEvent("event", "purchase", {
    transaction_id: token,
    value: turno.monto,
    currency: "ARS",
    items: [
      {
        item_name: turno.prestacion,
        item_category: turno.servicio,
        price: turno.monto,
        quantity: 1,
      },
    ],
  });
}

export function TurnoGracias() {
  const params = useSearchParams();
  const token = params.get("token");
  // Sólo para el texto si no se acreditó: el estado lo decide el backend.
  const rechazado = params.get("collection_status") === "rejected";
  const [vista, setVista] = useState<Vista>({ tipo: "cargando" });
  const [ronda, setRonda] = useState(0);

  useEffect(() => {
    if (!token) return;
    let vivo = true;
    let intento = 0;
    let timer: ReturnType<typeof setTimeout>;
    const consultar = async () => {
      try {
        const turno = await getEstado(token);
        if (!vivo) return;
        const esperando = turno.estado === "PENDIENTE" && ++intento < REINTENTOS;
        setVista({ tipo: "turno", turno, esperando });
        if (esperando) timer = setTimeout(consultar, ESPERA_MS);
        else if (turno.estado === "PROCESADA") medirConfirmado(token, turno);
      } catch {
        if (vivo) setVista({ tipo: "sin-dato" });
      }
    };
    void consultar();
    return () => {
      vivo = false;
      clearTimeout(timer);
    };
  }, [token, ronda]);

  const reintentar = () => {
    setVista({ tipo: "cargando" });
    setRonda((r) => r + 1);
  };

  const otroTurno = (
    <Link
      href="/nutricion/turno"
      className="mt-10 inline-block bg-yellow px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-white"
    >
      Sacar otro turno
    </Link>
  );

  if (!token) {
    return (
      <Tarjeta icono="error" titulo="No encontramos tu turno">
        <p className="mt-4 text-lg text-cream/70">
          El link está incompleto. Si pagaste la seña, te llega un email con la
          confirmación.
        </p>
        {otroTurno}
      </Tarjeta>
    );
  }

  if (vista.tipo === "cargando" || (vista.tipo === "turno" && vista.esperando)) {
    return (
      <Tarjeta icono="pendiente" titulo="Confirmando tu pago…">
        <p className="mt-4 text-lg text-cream/70">
          Estamos verificando la seña con Mercado Pago. No cierres esta página.
        </p>
      </Tarjeta>
    );
  }

  if (vista.tipo === "sin-dato") {
    return (
      <Tarjeta icono="pendiente" titulo="Pago en proceso">
        <p className="mt-4 text-lg text-cream/70">
          No pudimos consultar el estado ahora. Cuando se acredite la seña te
          llega un email con la confirmación del turno.
        </p>
        <Reintentar onClick={reintentar} />
      </Tarjeta>
    );
  }

  const { turno } = vista;
  const detalle = <Detalle turno={turno} />;

  switch (turno.estado) {
    case "PROCESADA":
      return (
        <Tarjeta icono="ok" titulo="¡Listo! Tu turno quedó confirmado">
          <p className="mt-4 text-lg text-cream/70">
            Te mandamos un email con los detalles. Para cancelar o cambiar el
            turno, contactá a la sede.
          </p>
          {detalle}
        </Tarjeta>
      );
    case "SIN_LUGAR":
      return (
        <Tarjeta icono="error" titulo="El horario se ocupó">
          <p className="mt-4 text-lg text-cream/70">
            Recibimos tu seña pero el horario se ocupó: te vamos a contactar
            para darte otro. La seña no se pierde.
          </p>
          {detalle}
        </Tarjeta>
      );
    case "VENCIDA":
      return (
        <Tarjeta icono="error" titulo="No recibimos el pago a tiempo">
          <p className="mt-4 text-lg text-cream/70">
            No recibimos el pago de la seña a tiempo y el horario se liberó. Si
            te lo cobraron, escribile a la sede. Si no, podés sacar el turno de
            nuevo.
          </p>
          {otroTurno}
        </Tarjeta>
      );
    default:
      return rechazado ? (
        <Tarjeta icono="error" titulo="El pago no se completó">
          <p className="mt-4 text-lg text-cream/70">
            Mercado Pago no aprobó el pago de la seña, así que el turno no
            quedó reservado. Podés intentarlo de nuevo.
          </p>
          {otroTurno}
        </Tarjeta>
      ) : (
        <Tarjeta icono="pendiente" titulo="Estamos confirmando tu pago…">
          <p className="mt-4 text-lg text-cream/70">
            Mercado Pago todavía no nos avisó del pago. Si ya pagaste, en unos
            minutos te llega un email con la confirmación.
          </p>
          {detalle}
          <Reintentar onClick={reintentar} />
        </Tarjeta>
      );
  }
}

function Detalle({ turno }: { turno: TurnoEstado }) {
  return (
    <div className="mt-10 border border-cream/15 bg-cream/4 p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.3em] text-yellow-deep">
        {turno.servicio}
      </p>
      <p className="display mt-3 text-3xl">{turno.prestacion}</p>
      <p className="mt-1 text-cream/70">
        {formatDayLong(turno.inicio)} · {formatTime(turno.inicio)} a{" "}
        {formatTime(turno.fin)}
      </p>
      <p className="mt-4 text-sm text-cream/80">
        <span className="text-cream/50">Con · </span>
        {turno.profesional}
      </p>
      <p className="mt-2 text-sm text-cream/80">
        <span className="text-cream/50">Sede · </span>
        {turno.sede.nombre}
        <span className="block text-cream/50">{turno.sede.direccion}</span>
      </p>
      {turno.monto > 0 && (
        <dl className="mt-6 space-y-3 border-t border-cream/10 pt-6 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-cream/50">Seña</dt>
            <dd className="text-cream/90">{pesos(turno.monto)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-cream/50">Pagás el día de la consulta</dt>
            <dd className="text-cream/90">{pesos(turno.precio - turno.monto)}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}

function Reintentar({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-8 border border-cream/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:border-yellow hover:text-yellow"
    >
      Volver a consultar
    </button>
  );
}

function Tarjeta({
  icono,
  titulo,
  children,
}: {
  icono: "ok" | "pendiente" | "error";
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl" aria-live="polite">
      <div
        className={cn(
          "flex size-16 items-center justify-center rounded-full",
          icono === "ok" ? "bg-yellow text-ink" : "border border-cream/30 text-cream",
        )}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          width="30"
          height="30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icono === "ok" && <path d="M20 6 9 17l-5-5" />}
          {icono === "error" && <path d="M6 6l12 12M18 6L6 18" />}
          {icono === "pendiente" && (
            <>
              <circle cx="12" cy="12" r="8.5" />
              <path d="M12 7.5V12l3 2" />
            </>
          )}
        </svg>
      </div>
      <h1 className="display mt-8 text-5xl leading-[0.95] md:text-6xl">
        {titulo}
      </h1>
      {children}
      <Link
        href="/nutricion"
        className="mt-10 block text-xs uppercase tracking-[0.2em] text-cream/50 hover:text-yellow"
      >
        ← Volver a Nutrición
      </Link>
    </div>
  );
}
