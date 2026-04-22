import type { Metadata } from "next";
import { FranquiciaHero } from "@/components/franquicia/FranquiciaHero";
import { FranquiciaStats } from "@/components/franquicia/FranquiciaStats";
import { FranquiciaIncludes } from "@/components/franquicia/FranquiciaIncludes";
import { FranquiciaProcess } from "@/components/franquicia/FranquiciaProcess";
import { FranquiciaInversion } from "@/components/franquicia/FranquiciaInversion";
import { FranquiciaCtaFinal } from "@/components/franquicia/FranquiciaCtaFinal";
import { franchiseOfferSchema, breadcrumbSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Franquicias",
  description:
    "Abrí tu franquicia CLIC FIT. Modelo probado, marca consolidada en zona norte, sistema de management propio, soporte operativo completo. Consultá por WhatsApp.",
  alternates: { canonical: "/franquicias" },
  openGraph: {
    title: "Franquicias CLIC FIT",
    description:
      "Un modelo probado y soporte operativo completo. Si querés sumarte, hablemos.",
    url: "https://clicfit.ar/franquicias",
  },
};

export default function FranquiciasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            franchiseOfferSchema(),
            breadcrumbSchema([
              { name: "Inicio", url: siteConfig.url },
              {
                name: "Franquicias",
                url: `${siteConfig.url}/franquicias`,
              },
            ]),
          ]),
        }}
      />
      <FranquiciaHero />
      <FranquiciaStats />
      <FranquiciaIncludes />
      <FranquiciaProcess />
      <FranquiciaInversion />
      <FranquiciaCtaFinal />
    </>
  );
}
