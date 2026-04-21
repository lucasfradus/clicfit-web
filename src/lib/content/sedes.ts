export type Sede = {
  slug: string;
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

export const sedes: Sede[] = [
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
    whatsappNumber: "5491126894398",
    email: "tortugas@clicfit.ar",
    hours: {
      weekdays: { opens: "06:45", closes: "20:45" },
      saturday: { opens: "09:00", closes: "12:00" },
      sunday: null,
    },
    amenities: ["Vestuarios", "Duchas", "Estacionamiento propio"],
    disciplines: ["crossfit", "funcional", "hiit", "gap", "fuerza"],
    heroImage: "/img/sedes/tortugas/hero.jpg",
    gallery: [
      "/img/sedes/tortugas/1.jpg",
      "/img/sedes/tortugas/2.jpg",
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
    whatsappNumber: "5491126894398",
    email: "pilar@clicfit.ar",
    hours: {
      weekdays: { opens: "07:45", closes: "20:45" },
      saturday: { opens: "10:00", closes: "12:00" },
      sunday: null,
    },
    amenities: ["Vestuarios", "Duchas", "Estacionamiento"],
    disciplines: ["crossfit", "funcional", "hiit", "gap", "fuerza"],
    heroImage: "/img/sedes/pilar/hero.jpg",
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
    whatsappNumber: "5491126894398",
    email: "officepark@clicfit.ar",
    hours: {
      weekdays: { opens: "08:00", closes: "21:00" },
      saturday: null,
      sunday: null,
    },
    amenities: ["Vestuarios", "Duchas", "Estacionamiento"],
    disciplines: ["crossfit", "funcional", "hiit", "gap", "fuerza"],
    heroImage: "/img/sedes/office-park/hero.jpg",
    gallery: [
      "/img/sedes/office-park/1.jpg",
      "/img/sedes/office-park/2.jpg",
      "/img/sedes/office-park/3.jpg",
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

export function getSedeBySlug(slug: string): Sede | null {
  return sedes.find((s) => s.slug === slug) ?? null;
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
