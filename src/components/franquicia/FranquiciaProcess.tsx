import { franquicia } from "@/lib/content/franquicia";

export function FranquiciaProcess() {
  return (
    <section className="bg-cream py-24 text-ink md:py-32">
      <div className="container-clic">
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-ink/60">
          02 — Proceso
        </p>
        <h2 className="display text-5xl leading-[0.95] md:text-7xl">
          Cuatro pasos.
          <br />
          <span className="italic-serif">Sin vueltas</span>.
        </h2>

        <div className="relative mt-16">
          {/* Mobile connecting line */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-6 w-px bg-ink/10 md:hidden"
          />

          <ol className="space-y-0">
            {franquicia.process.map((p) => (
              <li
                key={p.step}
                className="relative grid grid-cols-1 gap-4 border-t border-ink/10 py-10 pl-16 md:grid-cols-2 md:gap-12 md:pl-0"
              >
                <div className="flex items-start gap-6 md:gap-8">
                  <div className="display absolute left-0 text-6xl text-yellow-deep md:static md:text-8xl">
                    {p.step}
                  </div>
                  <h3 className="display text-3xl md:text-4xl">{p.title}</h3>
                </div>
                <p className="text-lg leading-relaxed text-ink/70">{p.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
