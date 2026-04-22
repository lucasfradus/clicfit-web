import { franquicia } from "@/lib/content/franquicia";

export function FranquiciaIncludes() {
  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="container-clic">
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-yellow-deep">
          01 — Qué incluye
        </p>
        <h2 className="display text-5xl leading-[0.95] md:text-7xl">
          Con todo lo
          <br />
          que <span className="italic-serif text-yellow">necesitás</span>.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-cream/70 md:text-xl">
          El modelo es llave en mano. No hay que inventar nada — hay que
          ejecutar.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
          {franquicia.includes.map((item, i) => (
            <div key={item.title} className="border-t border-cream/10 pt-8">
              <div className="display mb-4 text-4xl text-yellow-deep">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="display mb-3 text-2xl md:text-3xl">{item.title}</h3>
              <p className="text-base leading-relaxed text-cream/70">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
