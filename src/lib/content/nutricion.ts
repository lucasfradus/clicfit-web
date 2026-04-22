export const nutricion = {
  hero: {
    eyebrow: "Nutrición + InBody",
    display: "El entreno",
    italic: "es la mitad",
    tail: "del camino.",
    subhead:
      "Asesoramiento nutricional personalizado y medición InBody mensual. Sin costo aparte — está incluido en tu membresía.",
  },

  inbody: {
    eyebrow: "01 — InBody",
    display: "Medición que ves",
    italic: "en números.",
    desc: "InBody es un estudio de composición corporal que se hace con una balanza de última tecnología. En 60 segundos vemos qué hay detrás del número en la balanza común: cuánto es grasa, cuánto es músculo, cómo está distribuido el agua corporal, y tu estado general de nutrición.",
    measures: [
      { num: "%", label: "Grasa corporal" },
      { num: "kg", label: "Masa muscular" },
      { num: "∑", label: "Balance hídrico" },
      { num: "Δ", label: "Evolución mensual" },
    ],
  },

  process: {
    eyebrow: "02 — Cómo funciona",
    display: "Simple,",
    italic: "mensual",
    tail: "y sin extras.",
    steps: [
      {
        step: "01",
        title: "Primera medición",
        desc: "Al arrancar hacemos tu medición inicial InBody. Vemos tu composición corporal actual — el punto de partida.",
      },
      {
        step: "02",
        title: "Consulta con la nutricionista",
        desc: "Conversamos sobre tus hábitos, objetivos y preferencias. La nutricionista diseña un plan realista para tu estilo de vida, no dietas imposibles.",
      },
      {
        step: "03",
        title: "Entrenás con dirección",
        desc: "Tu rutina de entrenamiento se alinea con tu plan nutricional. Los coaches conocen tus objetivos y ajustan la intensidad.",
      },
      {
        step: "04",
        title: "Medición mensual",
        desc: "Cada mes repetimos InBody. Vemos qué cambió, ajustamos el plan si hace falta, celebramos lo que funciona.",
      },
    ],
  },

  includes: {
    eyebrow: "03 — Qué incluye",
    display: "Todo esto,",
    italic: "sin extras.",
    items: [
      {
        title: "Medición InBody mensual",
        desc: "Escaneo completo de composición corporal con balanza profesional.",
      },
      {
        title: "Consulta con nutricionista",
        desc: "Una sesión por mes para revisar plan, ajustar y resolver dudas.",
      },
      {
        title: "Plan nutricional personalizado",
        desc: "Adaptado a tus objetivos, tus gustos y tu rutina — no plantillas genéricas.",
      },
      {
        title: "Seguimiento continuo",
        desc: "Canal abierto con la nutricionista entre consultas para ajustes puntuales.",
      },
    ],
  },

  differential: {
    eyebrow: "Sin letra chica",
    display: "Incluido en tu",
    italic: "membresía.",
    desc: "La mayoría de los gimnasios cobran las consultas nutricionales aparte. Nosotros no. Si sos parte de CLIC FIT, la nutrición es parte del combo — no hay packs adicionales ni extras que aparecen después.",
  },
} as const;

export type Nutricion = typeof nutricion;
