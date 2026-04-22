import { nutricion } from "@/lib/content/nutricion";

export function NutricionInbody() {
  const { inbody } = nutricion;

  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="container-clic">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-yellow-deep">
              {inbody.eyebrow}
            </p>
            <h2 className="display text-5xl leading-[0.95] md:text-7xl">
              {inbody.display}
              <br />
              <span className="italic-serif text-yellow">{inbody.italic}</span>
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-cream/80">
              {inbody.desc}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-5 lg:col-span-6 lg:col-start-7">
            {inbody.measures.map((m) => (
              <div
                key={m.label}
                className="flex aspect-square flex-col justify-between border border-cream/20 p-6 transition-colors hover:border-yellow"
              >
                <div className="display text-5xl text-yellow-deep md:text-6xl">
                  {m.num}
                </div>
                <div className="text-xs uppercase tracking-widest text-cream/60">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
