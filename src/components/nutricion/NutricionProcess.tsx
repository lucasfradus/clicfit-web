import { nutricion } from "@/lib/content/nutricion";

export function NutricionProcess() {
  const { process } = nutricion;

  return (
    <section className="bg-cream py-24 text-ink md:py-32">
      <div className="container-clic">
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-ink/60">
          {process.eyebrow}
        </p>
        <h2 className="display text-5xl leading-[0.95] md:text-7xl">
          {process.display}{" "}
          <span className="italic-serif">{process.italic}</span>{" "}
          {process.tail}
        </h2>

        <div className="relative mt-16">
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-6 w-px bg-ink/10 md:hidden"
          />

          <ol className="space-y-0">
            {process.steps.map((s) => (
              <li
                key={s.step}
                className="relative grid grid-cols-1 gap-4 border-t border-ink/10 py-10 pl-16 md:grid-cols-12 md:gap-8 md:pl-0"
              >
                <div className="display absolute left-0 text-6xl text-yellow-deep md:static md:col-span-3 md:text-8xl">
                  {s.step}
                </div>
                <div className="md:col-span-9">
                  <h3 className="display text-3xl md:text-4xl">{s.title}</h3>
                  <p className="mt-3 text-lg leading-relaxed text-ink/70">
                    {s.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
