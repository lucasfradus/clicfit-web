/** Tipos compartidos por los backends del contador. Sin lógica, para que
 *  `store.ts` y las implementaciones no se importen en círculo. */

/** Un escaneo. Sin IP ni nada que identifique a una persona (ver `visitante`). */
export type Escaneo = {
  /** Epoch en ms. */
  ts: number;
  pais: string | null;
  ciudad: string | null;
  ua: string;
  referer: string | null;
  /** true si el user-agent parece un crawler y no una persona con una cámara. */
  bot: boolean;
  /**
   * Hash corto de IP + user-agent + día. Permite contar visitantes distintos sin
   * guardar la IP, y se rota solo cada 24hs porque el día entra al hash.
   */
  visitante: string;
};

export type Estadisticas = {
  /** Todos los hits, bots incluidos. */
  total: number;
  /** Hits que no parecen crawler. Es el número que importa. */
  humanos: number;
  /** Visitantes distintos (aproximado: se rota por día). */
  unicos: number;
  /** Los últimos escaneos, del más nuevo al más viejo. */
  recientes: Escaneo[];
  backend: "archivo" | "upstash";
  /** De dónde salen los números. Se muestra en el panel. */
  origen: string;
};

/** Cuántos escaneos guarda el detalle. El total no tiene tope. */
export const MAX_RECIENTES = 100;
