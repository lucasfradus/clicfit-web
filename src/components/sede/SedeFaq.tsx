import type { Sede } from "@/lib/content/sedes";
import { getDisciplinaBySlug } from "@/lib/content/disciplinas";

export type Faq = {
  question: string;
  answer: string;
};

export function buildSedeFaqs(sede: Sede): Faq[] {
  // Build discipline names
  const disciplineNames = sede.disciplines
    .map((slug) => getDisciplinaBySlug(slug)?.name)
    .filter(Boolean)
    .join(", ");

  // Check for amenities
  const hasParking =
    sede.amenities.includes("Estacionamiento propio") ||
    sede.amenities.includes("Estacionamiento");
  const hasChangeRoomsAndShowers =
    sede.amenities.includes("Vestuarios") && sede.amenities.includes("Duchas");

  const faqs: Faq[] = [
    {
      question: `¿Necesito experiencia previa para entrenar en ${sede.name}?`,
      answer:
        "No. Los coaches adaptan cada clase a tu nivel. Podés arrancar sin haber hecho nunca CrossFit ni funcional — la primera clase es gratis para que pruebes antes de decidir.",
    },
    {
      question: "¿Tiene estacionamiento?",
      answer: hasParking
        ? "Sí. La sede cuenta con estacionamiento propio."
        : "No cuenta con estacionamiento propio, pero hay opciones cercanas.",
    },
    {
      question: "¿Cuál es el horario menos concurrido?",
      answer:
        "Los bloques de mediodía (entre las 10:45 y las 14:45 aprox) suelen ser los más tranquilos. Los picos son primera mañana y tarde noche.",
    },
    {
      question: "¿Tengo que reservar con anticipación?",
      answer:
        "Sí. Te recomendamos reservar tu turno por WhatsApp con al menos 24 hs de anticipación para asegurar tu lugar.",
    },
    {
      question: "¿Qué disciplinas se dictan en esta sede?",
      answer: `En ${sede.name} se dictan ${disciplineNames}. Podés combinar las modalidades dentro de tu membresía.`,
    },
    {
      question: "¿Hay vestuarios y duchas?",
      answer: hasChangeRoomsAndShowers
        ? "Sí. Vestuarios separados con duchas y lockers."
        : "Consultanos por WhatsApp.",
    },
  ];

  return faqs;
}

export function SedeFaq({ sede }: { sede: Sede }) {
  const faqs = buildSedeFaqs(sede);

  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="container-clic">
        <div className="max-w-4xl">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-yellow-deep">
            Preguntas frecuentes
          </p>
          <h2 className="display mb-16 text-5xl leading-[0.95] md:text-7xl">
            Lo que
            <br />
            <span className="italic-serif">preguntan</span>.
          </h2>
          <ul className="border-t border-cream/10">
            {faqs.map((faq, i) => (
              <li key={i} className="border-b border-cream/10">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-6 text-left">
                    <span className="text-base font-medium text-cream md:text-lg">
                      {faq.question}
                    </span>
                    <span className="ml-4 shrink-0 text-xl text-yellow transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="pb-6 text-sm leading-relaxed text-cream/70 md:text-base">
                    {faq.answer}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
