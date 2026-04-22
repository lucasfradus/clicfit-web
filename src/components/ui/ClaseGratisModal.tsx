"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { sedes } from "@/lib/content/sedes";
import { waLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Ctx = { open: () => void; close: () => void };
const ClaseGratisCtx = createContext<Ctx | null>(null);

function useClaseGratisModal(): Ctx {
  const ctx = useContext(ClaseGratisCtx);
  if (!ctx) {
    throw new Error(
      "ClaseGratisProvider no está montado. Envolvé la app con <ClaseGratisProvider>.",
    );
  }
  return ctx;
}

export function ClaseGratisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close]);

  return (
    <ClaseGratisCtx.Provider value={{ open, close }}>
      {children}
      {mounted &&
        isOpen &&
        createPortal(<Modal onClose={close} />, document.body)}
    </ClaseGratisCtx.Provider>
  );
}

function Modal({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clase-gratis-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-lg border border-cream/20 bg-ink p-8 shadow-2xl md:p-10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-4 text-2xl leading-none text-cream/60 transition-colors hover:text-yellow"
        >
          ×
        </button>

        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-yellow-deep">
          Clase gratis
        </p>
        <h2
          id="clase-gratis-title"
          className="display text-4xl leading-[0.95] md:text-5xl"
        >
          Elegí tu <span className="italic-serif text-yellow">sede</span>.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-cream/70">
          Te conectamos por WhatsApp con la sede elegida para coordinar tu
          clase.
        </p>

        <ul className="mt-6 border-y border-cream/10 divide-y divide-cream/10">
          {sedes.map((sede) => {
            const href = waLink(
              `Hola Clic! Me interesa probar una clase gratis en la sede ${sede.name}. ¿Me pasan info?`,
              sede.whatsappNumber,
            );
            return (
              <li key={sede.slug}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="group flex items-center justify-between gap-4 py-5 transition-colors hover:bg-cream/5"
                >
                  <div>
                    <div className="display text-2xl transition-colors group-hover:text-yellow md:text-3xl">
                      {sede.name}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-cream/60">
                      {sede.zone} · {sede.address.locality}
                    </div>
                  </div>
                  <span className="text-yellow transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ---------- triggers ---------- */

type Variant = "primary" | "outline" | "dark";

const variantClasses: Record<Variant, string> = {
  primary: "bg-yellow text-ink hover:bg-white",
  outline:
    "border border-cream/40 text-cream hover:border-yellow hover:text-yellow",
  dark: "bg-ink text-yellow hover:bg-[#1a1a1a]",
};

const baseClasses =
  "inline-flex items-center justify-center gap-3 px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors";

type TriggerProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

export function ClaseGratisButton({
  variant = "primary",
  className,
  children,
  ...rest
}: TriggerProps) {
  const { open } = useClaseGratisModal();
  return (
    <button
      type="button"
      onClick={open}
      className={cn(baseClasses, variantClasses[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
}

/**
 * Trigger sin estilos predeterminados — usalo cuando necesites un clickeable
 * custom (link en el footer, botón con clases propias en el nav, etc.).
 */
export function ClaseGratisTrigger({
  className,
  children,
  ...rest
}: {
  className?: string;
  children: React.ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">) {
  const { open } = useClaseGratisModal();
  return (
    <button type="button" onClick={open} className={className} {...rest}>
      {children}
    </button>
  );
}
