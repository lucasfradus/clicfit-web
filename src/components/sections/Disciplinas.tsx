import { disciplinas } from "@/lib/content/disciplinas";

export function Disciplinas() {
  return (
    <section id="disciplinas" className="bg-ink py-24 md:py-32">
      <div className="container-clic">
        <div className="mb-16 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="mb-6 text-xs uppercase tracking-[0.3em] text-yellow-deep">
              01 — Entrenamiento
            </div>
            <h2 className="display text-5xl leading-[0.95] md:text-7xl">
              Elegí cómo
              <br />
              <span className="italic-serif text-cream/70">entrenar</span> hoy.
            </h2>
          </div>
          <div className="flex lg:items-end">
            <p className="max-w-md text-lg leading-relaxed text-cream/70">
              Cinco modalidades, un mismo objetivo: que cumplas el tuyo.
              Combinalas según tu semana, tu energía y tu meta.
            </p>
          </div>
        </div>

        <ul className="border-t border-cream/10">
          {disciplinas.map((d, index) => {
            const num = String(index + 1).padStart(2, "0");
            return (
              <li
                key={d.slug}
                className="grid grid-cols-[40px_1fr] items-baseline gap-x-4 gap-y-2 border-b border-cream/10 py-7 lg:grid-cols-[40px_1fr_2fr_1fr] lg:gap-8"
              >
                <span className="text-xs uppercase tracking-widest text-cream/40">
                  {num}
                </span>
                <span className="display text-4xl md:text-6xl">{d.name}</span>
                <span className="col-span-2 text-sm text-cream/70 md:text-base lg:col-span-1">
                  {d.short}
                </span>
                <span className="hidden text-right text-xs uppercase tracking-widest text-cream/40 lg:block">
                  {d.tag}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
