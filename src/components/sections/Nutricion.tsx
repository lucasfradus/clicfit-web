import { LinkButton } from "@/components/ui/Button";

const METRICS: { value: string; label: string }[] = [
  { value: "%", label: "Grasa corporal" },
  { value: "kg", label: "Masa muscular" },
  { value: "∑", label: "Balance hídrico" },
  { value: "Δ", label: "Progreso mensual" },
];

export function Nutricion() {
  return (
    <section id="nutricion" className="bg-ink py-24 md:py-32">
      <div className="container-clic">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="mb-6 text-xs uppercase tracking-[0.3em] text-yellow-deep">
              03 — Nutrición
            </div>
            <h2 className="display text-5xl leading-[0.95] md:text-7xl">
              El entreno
              <br />
              es la <span className="italic-serif text-yellow">mitad</span>.
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-cream/70">
              Asesoramiento nutricional personalizado + medición InBody mensual.
              Vemos composición corporal, porcentaje de grasa y músculo, y
              diseñamos tu plan con datos reales.
            </p>
            <div className="mt-8">
              <LinkButton href="/nutricion" variant="primary">
                Conocer el programa →
              </LinkButton>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-5 lg:col-span-6 lg:col-start-7">
            {METRICS.map((metric) => (
              <div
                key={metric.label}
                className="flex aspect-square flex-col justify-between border border-cream/20 p-6 transition-colors hover:border-yellow"
              >
                <div className="display text-5xl text-yellow-deep md:text-6xl">
                  {metric.value}
                </div>
                <div className="text-xs uppercase tracking-widest text-cream/60">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
