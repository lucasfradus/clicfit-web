export type Disciplina = {
  slug: string;
  name: string;
  short: string;
  tag: string;
  description: string;
  benefits: string[];
  forWho: string;
  heroImage: string;
};

export const disciplinas: Disciplina[] = [
  {
    slug: "crossfit",
    name: "CrossFit",
    short:
      "Alta intensidad. Levantamiento, gimnasia y cardio en un solo WOD diario.",
    tag: "Para romper límites",
    description:
      "El CrossFit es un programa de entrenamiento de alta intensidad que combina levantamiento de pesas, gimnasia y ejercicios cardiovasculares. Se estructura mediante rutinas diarias llamadas WODs (Workout of the Day) que cambian todos los días, así nunca te aburrís y el cuerpo no se adapta. Los movimientos son funcionales y ejecutados a alta intensidad, lo que te da resultados visibles en pocas semanas.",
    benefits: [
      "Mejora la fuerza general y la resistencia cardiovascular",
      "Quema grasa en menos tiempo que el cardio tradicional",
      "Entrena en comunidad con gente a tu nivel",
      "Progresión medible día a día",
    ],
    forWho:
      "Para quien busca intensidad, variedad y resultados rápidos. Adaptable a todos los niveles con coaches que escalan cada movimiento.",
    heroImage: "/img/disciplinas/crossfit.jpg",
  },
  {
    slug: "funcional",
    name: "Funcional",
    short:
      "Movimientos naturales que mejoran tu vida diaria. Coordinación, equilibrio, fuerza.",
    tag: "Para todo nivel",
    description:
      "El entrenamiento funcional se centra en movimientos naturales que mejoran tu capacidad para realizar actividades diarias. Usamos una variedad de ejercicios y equipos para trabajar múltiples grupos musculares a la vez. La meta es coordinación, equilibrio y movilidad de manera holística, adaptada a tu nivel actual.",
    benefits: [
      "Mejora postura y movilidad articular",
      "Fortalece el core y previene lesiones",
      "Clases dinámicas, sin rutinas aburridas",
      "Ideal si recién empezás a entrenar",
    ],
    forWho:
      "Para cualquier nivel — es el mejor punto de entrada si hace tiempo no hacés ejercicio o si querés una base sólida antes de sumar intensidad.",
    heroImage: "/img/disciplinas/funcional.jpg",
  },
  {
    slug: "hiit",
    name: "HIIT",
    short: "Intervalos de alta intensidad. Máxima quema en mínimo tiempo.",
    tag: "Para quien no tiene tiempo que perder",
    description:
      "El HIIT (High-Intensity Interval Training) alterna períodos cortos de ejercicio intenso con períodos de recuperación. Es la forma más eficiente de mejorar la resistencia cardiovascular y quemar calorías cuando tenés poco tiempo. Una clase de 45-60 minutos equivale a más de una hora de cardio tradicional en términos de impacto metabólico.",
    benefits: [
      "Máxima quema de calorías en poco tiempo",
      "Efecto EPOC: seguís quemando después de terminar",
      "Mejora capacidad pulmonar y resistencia",
      "Ideal para agendas apretadas",
    ],
    forWho:
      "Para quien tiene poco tiempo y busca resultados visibles. Requiere base mínima de estado físico — si nunca entrenaste, empezá con funcional.",
    heroImage: "/img/disciplinas/hiit.jpg",
  },
  {
    slug: "gap",
    name: "GAP",
    short: "Glúteos, abdominales, piernas. Tonificación focalizada.",
    tag: "Para tonificar con foco",
    description:
      "GAP es tonificación focalizada en tres zonas: glúteos, abdominales y piernas. Usamos peso corporal, bandas elásticas, discos y mancuernas livianas con altas repeticiones. Es ideal como complemento del entrenamiento general o si tu objetivo principal es definir esas áreas específicas.",
    benefits: [
      "Tonifica zonas clave del tren inferior",
      "Fortalece el core profundo",
      "Bajo impacto, apto para todas las edades",
      "Excelente complemento de CrossFit o HIIT",
    ],
    forWho:
      "Para quien quiere tonificar glúteos, piernas y abdomen sin ganar mucho volumen. Apto para cualquier nivel.",
    heroImage: "/img/disciplinas/gap.jpg",
  },
  {
    slug: "fuerza",
    name: "Fuerza",
    short:
      "Cargas progresivas. Más músculo, más densidad ósea, más metabolismo.",
    tag: "Para construir base sólida",
    description:
      "Entrenamiento con cargas progresivas orientado a mejorar fuerza, masa muscular y densidad ósea. Trabajamos con barras, mancuernas y máquinas siguiendo una progresión planificada. A diferencia del CrossFit, acá el foco no es la intensidad sino la técnica y la carga bien pautada en el tiempo.",
    benefits: [
      "Aumenta la masa muscular y el metabolismo basal",
      "Mejora la densidad ósea — clave pasando los 35",
      "Mejora postura y previene dolores de espalda",
      "Técnica depurada con coach dedicado",
    ],
    forWho:
      "Para quien quiere construir músculo de forma planificada, recuperar masa muscular perdida o simplemente ser más fuerte en su día a día.",
    heroImage: "/img/disciplinas/fuerza.jpg",
  },
];

export function getDisciplinaBySlug(slug: string): Disciplina | null {
  return disciplinas.find((d) => d.slug === slug) ?? null;
}
