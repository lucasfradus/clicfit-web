import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sedes, getSedeBySlug } from "@/lib/content/sedes";
import type { Sede } from "@/lib/content/sedes";
import { siteConfig } from "@/lib/content/site";
import {
  sedeExerciseGymSchema,
  sedeFaqSchema,
  breadcrumbSchema,
} from "@/lib/seo";
import { buildSedeFaqs } from "@/components/sede/SedeFaq";
import { SedeHero } from "@/components/sede/SedeHero";
import { SedeQuickInfo } from "@/components/sede/SedeQuickInfo";
import { SedeDisciplinasStrip } from "@/components/sede/SedeDisciplinasStrip";
import { SedeSchedule } from "@/components/sede/SedeSchedule";
import { SedeGallery } from "@/components/sede/SedeGallery";
import { SedeMap } from "@/components/sede/SedeMap";
import { SedeFaq } from "@/components/sede/SedeFaq";
import { SedeCtaFinal } from "@/components/sede/SedeCtaFinal";

// Pre-render all 3 slugs at build time
export async function generateStaticParams() {
  return sedes.map((s) => ({ slug: s.slug }));
}

// Dynamic metadata per sede
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sede = getSedeBySlug(slug);
  if (!sede) return {};
  return {
    title: `Gimnasio en ${sede.name} · CrossFit, Funcional y HIIT`,
    description: `CLIC FIT ${sede.name} — entrenamiento y nutrición en ${sede.address.locality}. Horarios de Lun a Vie ${sede.hours.weekdays.opens} a ${sede.hours.weekdays.closes}. Reservá tu primera clase gratis.`,
    alternates: { canonical: `/sedes/${sede.slug}` },
    openGraph: {
      title: `CLIC FIT ${sede.name}`,
      description: `Entrenamiento en ${sede.address.locality}. Reservá por WhatsApp.`,
      url: `${siteConfig.url}/sedes/${sede.slug}`,
    },
  };
}

export default async function SedePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const maybeSede = getSedeBySlug(slug);

  if (!maybeSede) {
    notFound();
  }

  // TypeScript control-flow narrowing: notFound() throws, so maybeSede is non-null here.
  const sede: Sede = maybeSede;

  const faqs = buildSedeFaqs(sede);

  const schemas = [
    sedeExerciseGymSchema(sede),
    sedeFaqSchema(faqs),
    breadcrumbSchema([
      { name: "Inicio", url: siteConfig.url },
      { name: "Sedes", url: `${siteConfig.url}/sedes` },
      { name: sede.name, url: `${siteConfig.url}/sedes/${sede.slug}` },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <SedeHero sede={sede} />
      <SedeQuickInfo sede={sede} />
      <SedeDisciplinasStrip sede={sede} />
      <SedeSchedule sede={sede} />
      <SedeGallery sede={sede} />
      <SedeMap sede={sede} />
      <SedeFaq sede={sede} />
      <SedeCtaFinal sede={sede} />
    </>
  );
}
