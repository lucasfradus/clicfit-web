import contacts from "@/contacts.json";

export type Sede = {
  slug: string;
  /**
   * Slug con el que Clicnet conoce a la sede, cuando difiere del de la URL
   * pública. Sólo hace falta cuando el backoffice la nombró distinto.
   */
  backendSlug?: string;
  name: string;
  zone: string;
  address: {
    street: string;
    locality: string;
    postalCode: string;
    region: string;
    country: string;
  };
  coordinates: { lat: number; lng: number };
  phone: string;
  whatsappNumber: string;
  email: string;
  hours: {
    weekdays: { opens: string; closes: string };
    saturday: { opens: string; closes: string } | null;
    sunday: { opens: string; closes: string } | null;
  };
  amenities: string[];
  disciplines: string[];
  heroImage: string;
  gallery: string[];
  transport: { label: string; description: string }[];
  featured: string[];
};

type SedeStatic = Omit<Sede, "hours" | "whatsappNumber">;

const sedesStatic: SedeStatic[] = [
  {
    slug: "tortugas",
    name: "Tortugas",
    zone: "Las Piedras",
    address: {
      street: "Golf Club Golfers 2950",
      locality: "Manuel Alberti",
      postalCode: "B1664",
      region: "Buenos Aires",
      country: "AR",
    },
    coordinates: { lat: -34.4435, lng: -58.8831 },
    phone: "+54 9 11 2689-4398",
    email: "tortugas@clicfit.ar",
    amenities: ["Vestuarios", "Duchas", "Estacionamiento propio"],
    disciplines: ["crossfit", "funcional", "hiit", "gap", "fuerza", "hibrida"],
    heroImage: "/img/sedes/tortugas/hero.jpeg",
    gallery: [
      "/img/sedes/tortugas/1.jpeg",
      "/img/sedes/tortugas/2.jpeg",
      "/img/sedes/tortugas/3.jpg",
      "/img/sedes/tortugas/4.jpg",
    ],
    transport: [
      {
        label: "Auto",
        description:
          "Acceso Norte Ramal Pilar, bajada Tortugas. Estacionamiento propio dentro del predio.",
      },
      {
        label: "Bondi",
        description: "Líneas 57 y 194 — parada a 5 minutos caminando.",
      },
      {
        label: "Tren",
        description:
          "Línea Mitre, estación Manuel Alberti. 10 minutos en auto hasta la sede.",
      },
    ],
    featured: [
      "Dentro del predio Golf Club Golfers",
      "Estacionamiento propio sin costo",
      "Horario extendido de Lun a Vie",
    ],
  },
  {
    slug: "pilar-la-lonja",
    name: "Pilar",
    zone: "La Lonja",
    address: {
      street: "Av. Sgto. Cayetano Beliera 3784",
      locality: "La Lonja",
      postalCode: "B1629",
      region: "Buenos Aires",
      country: "AR",
    },
    coordinates: { lat: -34.4659, lng: -58.8942 },
    phone: "+54 9 11 2689-4398",
    email: "pilar@clicfit.ar",
    amenities: ["Vestuarios", "Duchas", "Estacionamiento"],
    disciplines: ["crossfit", "funcional", "hiit", "gap", "fuerza", "hibrida"],
    heroImage: "/img/sedes/pilar/hero.jpeg",
    gallery: [],
    transport: [
      {
        label: "Auto",
        description: "Sobre Av. Beliera, fácil acceso desde Panamericana.",
      },
      { label: "Bondi", description: "Líneas que recorren Beliera." },
    ],
    featured: [
      "Ubicación central en La Lonja",
      "Buenos accesos desde Panamericana",
    ],
  },
  {
    slug: "office-park",
    backendSlug: "office-fitness",
    name: "Office Park",
    zone: "Panamericana",
    address: {
      street: "Av. 12 de Octubre 2961",
      locality: "Manuel Alberti",
      postalCode: "B1664",
      region: "Buenos Aires",
      country: "AR",
    },
    coordinates: { lat: -34.4401, lng: -58.8798 },
    phone: "+54 9 11 2689-4398",
    email: "officepark@clicfit.ar",
    amenities: ["Vestuarios", "Duchas", "Estacionamiento"],
    disciplines: ["crossfit", "funcional", "hiit", "gap", "fuerza", "hibrida"],
    heroImage: "/img/sedes/office/hero.jpeg",
    gallery: [
      "/img/sedes/office/1.jpeg",
      "/img/sedes/office/2.jpeg",
      "/img/sedes/office/3.jpeg",
    ],
    transport: [
      {
        label: "Auto",
        description:
          "Dentro del predio Office Park sobre Panamericana, acceso directo desde la autopista.",
      },
    ],
    featured: [
      "Dentro de Office Park Panamericana",
      "Ideal para entrenar antes o después del trabajo",
    ],
  },
];

type SedeContacts = Record<
  string,
  { whatsapp: string; hours: Sede["hours"] }
>;

const sedeContacts = contacts.sedes as SedeContacts;

export const sedes: Sede[] = sedesStatic.map((s) => {
  const c = sedeContacts[s.slug];
  if (!c) {
    throw new Error(
      `Falta info de contacto para la sede "${s.slug}" en contacts.json`,
    );
  }
  return {
    ...s,
    whatsappNumber: c.whatsapp,
    hours: c.hours,
  };
});

export function getSedeBySlug(slug: string): Sede | null {
  return sedes.find((s) => s.slug === slug) ?? null;
}

/**
 * Convierte una sede nueva del backend que no existe en el código estático
 * en un objeto Sede completo para que aparezca automáticamente en la web.
 */
export function backendSedeToFullSede(b: import("@/lib/reservas/types").Sede): Sede {
  let whatsappNumber = "5491126894398";
  if (b.whatsappUrl) {
    const digits = b.whatsappUrl.replace(/\D/g, "");
    if (digits.length >= 10) whatsappNumber = digits;
  }

  return {
    slug: b.slug,
    backendSlug: b.slug,
    name: b.nombre,
    zone: b.localidad || b.ciudad || b.nombre,
    address: {
      street: b.direccion || "",
      locality: b.ciudad || b.localidad || "Buenos Aires",
      postalCode: "",
      region: "Buenos Aires",
      country: "AR",
    },
    coordinates: { lat: -34.44, lng: -58.88 },
    phone: b.telefono || "+54 9 11 2689-4398",
    whatsappNumber,
    email: b.email || "info@clicfit.ar",
    hours: {
      weekdays: {
        opens: b.horaApertura || "07:00",
        closes: b.horaCierre || "21:00",
      },
      saturday: { opens: "09:00", closes: "12:00" },
      sunday: null,
    },
    amenities: ["Vestuarios", "Duchas", "Estacionamiento"],
    disciplines: ["crossfit", "funcional", "hiit", "gap", "fuerza", "hibrida"],
    heroImage: b.imagenUrl || "/img/sedes/hero.jpg",
    gallery: b.fotos || [],
    transport: [],
    featured:
      b.caracteristicasWeb && b.caracteristicasWeb.length > 0
        ? b.caracteristicasWeb
        : [
            "Entrenamiento personalizado",
            "Horario extendido",
            "Comunidad CLIC FIT",
          ],
  };
}

/**
 * Combina una sede estática con los datos actualizados del backend de Clicnet.
 */
export function mergeSedeWithBackend(staticSede: Sede, backendSede?: import("@/lib/reservas/types").Sede | null): Sede {
  if (!backendSede) return staticSede;

  // Extraer número de WhatsApp si viene en formato URL (ej: https://wa.me/54911...)
  let whatsappNumber = staticSede.whatsappNumber;
  if (backendSede.whatsappUrl) {
    const digits = backendSede.whatsappUrl.replace(/\D/g, "");
    if (digits.length >= 10) {
      whatsappNumber = digits;
    }
  }

  // Horarios de lunes a viernes desde el backend si están configurados
  const weekdayHours =
    backendSede.horaApertura && backendSede.horaCierre
      ? { opens: backendSede.horaApertura, closes: backendSede.horaCierre }
      : staticSede.hours.weekdays;

  return {
    ...staticSede,
    name: staticSede.name, // Mantiene el nombre de display del front
    zone: backendSede.localidad || backendSede.ciudad || staticSede.zone,
    address: {
      ...staticSede.address,
      street: backendSede.direccion || staticSede.address.street,
      locality: backendSede.ciudad || staticSede.address.locality,
    },
    phone: backendSede.telefono || staticSede.phone,
    whatsappNumber,
    email: backendSede.email || staticSede.email,
    heroImage: backendSede.imagenUrl || staticSede.heroImage,
    gallery:
      backendSede.fotos && backendSede.fotos.length > 0
        ? backendSede.fotos
        : staticSede.gallery,
    featured:
      backendSede.caracteristicasWeb && backendSede.caracteristicasWeb.length > 0
        ? backendSede.caracteristicasWeb
        : staticSede.featured,
    hours: {
      ...staticSede.hours,
      weekdays: weekdayHours,
    },
  };
}

/**
 * Obtiene la lista completa de sedes con los datos dinámicos del backend.
 * Si se crea una nueva sede en el backend, se agrega automáticamente a la lista.
 * Si la API no responde, devuelve la lista estática como fallback seguro.
 */
export async function getDynamicSedes(): Promise<Sede[]> {
  try {
    const { getSedesFitness } = await import("@/lib/reservas/api");
    const backendSedes = await getSedesFitness({ contexto: "web", revalidate: 60 });
    const matchedStatic = sedes.map((s) => {
      const bs = backendSedes.find(
        (b) => b.slug === s.slug || b.slug === s.backendSlug,
      );
      return mergeSedeWithBackend(s, bs);
    });

    // Nuevas sedes creadas en el backend que no existen en el código estático
    const newFromBackend = backendSedes
      .filter((b) => !sedes.some((s) => s.slug === b.slug || s.backendSlug === b.slug))
      .map(backendSedeToFullSede);

    return [...matchedStatic, ...newFromBackend];
  } catch {
    return sedes;
  }
}

/**
 * Obtiene una sede por slug enriquecida con los datos del backend.
 * Si la sede es nueva del backend, la construye automáticamente.
 */
export async function getDynamicSedeBySlug(slug: string): Promise<Sede | null> {
  const staticSede = getSedeBySlug(slug);

  try {
    const { getSedesFitness } = await import("@/lib/reservas/api");
    const backendSedes = await getSedesFitness({ contexto: "web", revalidate: 60 });
    const bs = backendSedes.find(
      (b) => b.slug === slug || (staticSede && b.slug === staticSede.backendSlug),
    );

    if (staticSede) {
      return mergeSedeWithBackend(staticSede, bs);
    }
    if (bs) {
      return backendSedeToFullSede(bs);
    }
    return null;
  } catch {
    return staticSede;
  }
}

/**
 * Traduce el slug de la URL al slug con el que responde /api/public/sedes.
 * Sin esto, una sede que en Clicnet se llama distinto queda como "no
 * disponible" en la web aunque tenga la reserva online habilitada.
 */
export function getBackendSlug(slug: string): string {
  return getSedeBySlug(slug)?.backendSlug ?? slug;
}

export function getHourBlocks(
  opens: string,
  closes: string,
): { start: string; end: string }[] {
  const blocks: { start: string; end: string }[] = [];
  const [oh, om] = opens.split(":").map(Number);
  const [ch, cm] = closes.split(":").map(Number);
  const openMin = oh * 60 + om;
  const closeMin = ch * 60 + cm;

  for (let t = openMin; t < closeMin; t += 60) {
    const s = minutesToHHMM(t);
    const e = minutesToHHMM(Math.min(t + 60, closeMin));
    blocks.push({ start: s, end: e });
  }
  return blocks;
}

function minutesToHHMM(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}
