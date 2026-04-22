import { siteConfig } from "./content/site";
import type { Sede } from "./content/sedes";

export function sedeExerciseGymSchema(sede: Sede) {
  const hours: Record<string, unknown>[] = [];
  hours.push({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: sede.hours.weekdays.opens,
    closes: sede.hours.weekdays.closes,
  });
  if (sede.hours.saturday) {
    hours.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: sede.hours.saturday.opens,
      closes: sede.hours.saturday.closes,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    name: `${siteConfig.name} ${sede.name}`,
    image: siteConfig.logoUrl,
    url: `${siteConfig.url}/sedes/${sede.slug}`,
    telephone: sede.phone,
    email: sede.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: sede.address.street,
      addressLocality: sede.address.locality,
      addressRegion: sede.address.region,
      postalCode: sede.address.postalCode,
      addressCountry: sede.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: sede.coordinates.lat,
      longitude: sede.coordinates.lng,
    },
    openingHoursSpecification: hours,
    priceRange: "$$",
    amenityFeature: sede.amenities.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
  };
}

export function sedeFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
