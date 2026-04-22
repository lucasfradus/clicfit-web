import type { Metadata } from "next";
import { NutricionHero } from "@/components/nutricion/NutricionHero";
import { NutricionInbody } from "@/components/nutricion/NutricionInbody";
import { NutricionProcess } from "@/components/nutricion/NutricionProcess";
import { NutricionIncludes } from "@/components/nutricion/NutricionIncludes";
import { NutricionDifferential } from "@/components/nutricion/NutricionDifferential";
import { NutricionSedes } from "@/components/nutricion/NutricionSedes";
import { NutricionCtaFinal } from "@/components/nutricion/NutricionCtaFinal";
import { nutricionServiceSchema, breadcrumbSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Nutrición + InBody",
  description:
    "Asesoramiento nutricional personalizado y medición InBody mensual, incluido en tu membresía. CLIC FIT — nutrición deportiva en zona norte de Buenos Aires.",
  alternates: { canonical: "/nutricion" },
  openGraph: {
    title: "Nutrición + InBody — CLIC FIT",
    description:
      "Medición InBody mensual y consulta con nutricionista, sin costo aparte. Incluido en tu membresía.",
    url: "https://clicfit.ar/nutricion",
  },
};

export default function NutricionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            nutricionServiceSchema(),
            breadcrumbSchema([
              { name: "Inicio", url: siteConfig.url },
              {
                name: "Nutrición",
                url: `${siteConfig.url}/nutricion`,
              },
            ]),
          ]),
        }}
      />
      <NutricionHero />
      <NutricionInbody />
      <NutricionProcess />
      <NutricionIncludes />
      <NutricionDifferential />
      <NutricionSedes />
      <NutricionCtaFinal />
    </>
  );
}
