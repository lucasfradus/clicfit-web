export const siteConfig = {
  name: "CLIC FIT",
  url: "https://clicfit.ar",
  tagline: "El lugar donde tus hábitos cambian",
  description:
    "Entrenamiento y nutrición en zona norte. CrossFit, Funcional, HIIT, GAP y Fuerza. 3 sedes: Tortugas, Pilar y Office Park.",
  phone: "+54 9 11 2689-4398",
  whatsappNumber: "5491126894398",
  email: "hola@clicfit.ar",
  instagram: "https://instagram.com/clic.fit",
  tiktok: "https://www.tiktok.com/@clicfit",
  since: 2022,
  logoUrl: "/img/logo-white.png",
} as const;

export type SiteConfig = typeof siteConfig;
