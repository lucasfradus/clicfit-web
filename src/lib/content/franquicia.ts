export const franquicia = {
  headline: {
    display: "Abrí tu",
    italic: "CLIC",
    tail: "FIT.",
  },
  subhead:
    "Un modelo probado, marca consolidada en zona norte y soporte operativo completo. Si querés sumarte al crecimiento, hablemos.",

  stats: [
    { num: "2022", label: "Operando desde" },
    { num: "3", label: "Sedes operativas" },
    { num: "5", label: "Disciplinas en sistema" },
    { num: "∞", label: "Comunidad activa" },
  ],

  includes: [
    {
      title: "Marca consolidada",
      desc: "Uso de la marca CLIC FIT y sus manuales visuales, con reconocimiento ya instalado en zona norte.",
    },
    {
      title: "Sistema de management propio",
      desc: "Acceso al software de gestión que usamos en todas las sedes: reservas, pagos, membresías, reportes.",
    },
    {
      title: "Manual operativo",
      desc: "Procedimientos estandarizados para operar la sede: apertura, cierre, atención al cliente, resolución de incidentes.",
    },
    {
      title: "Capacitación inicial",
      desc: "Formación completa del equipo (coaches y administración) antes de abrir. Acompañamiento en los primeros meses.",
    },
    {
      title: "Programación semanal",
      desc: "Planes de entrenamiento y programación de clases armados por nuestro equipo. Nunca arrancás una semana sin saber qué dictás.",
    },
    {
      title: "Soporte continuo",
      desc: "Acompañamiento permanente en operaciones, marketing, nutrición y estrategia. No te soltamos después de la apertura.",
    },
    {
      title: "Territorio protegido",
      desc: "Exclusividad en tu zona para que no te compitas contra otra sede de la red.",
    },
    {
      title: "Búsqueda del local",
      desc: "Te acompañamos en la evaluación del inmueble: metros, layout, ubicación, negociación.",
    },
  ],

  process: [
    {
      step: "01",
      title: "Contacto inicial",
      desc: "Nos escribís por WhatsApp contándonos brevemente tu perfil y zona de interés.",
    },
    {
      step: "02",
      title: "Reunión para conocernos",
      desc: "Hablamos por Zoom o nos juntamos personalmente para entender expectativas y ver si hay match.",
    },
    {
      step: "03",
      title: "Evaluación de zona e inmueble",
      desc: "Analizamos ubicación, características del local y potencial de la zona.",
    },
    {
      step: "04",
      title: "Firma y apertura",
      desc: "Contrato, acondicionamiento del local, capacitación del equipo, apertura.",
    },
  ],
} as const;

export type Franquicia = typeof franquicia;
