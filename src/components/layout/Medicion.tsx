"use client";

import { useEffect } from "react";
import { capturarGclid, clasificarWhatsApp, medir } from "@/lib/medicion";

/**
 * Un solo listener para todos los links de WhatsApp del sitio (hay más de diez,
 * casi todos en Server Components): así ninguno se queda sin medir cuando se
 * agrega uno nuevo. También guarda el gclid del anuncio al entrar.
 */
export function Medicion() {
  useEffect(() => {
    capturarGclid(window.location.search);

    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const clase = clasificarWhatsApp(link.href, window.location.pathname);
      if (!clase) return;
      medir(clase.evento, { sede: clase.sede, pagina: window.location.pathname });
    };
    // Fase de captura: corre aunque algún handler corte la propagación.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
