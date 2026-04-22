import { type Sede } from "@/lib/content/sedes";
import { disciplinas } from "@/lib/content/disciplinas";

export function SedeDisciplinasStrip({ sede }: { sede: Sede }) {
  return (
    <section className="py-24 md:py-32 bg-ink">
      <div className="container-clic">
        <p className="text-xs uppercase tracking-[0.3em] text-yellow-deep mb-6">
          Disciplinas en esta sede
        </p>
        <h2 className="display text-5xl md:text-7xl leading-[0.95] mb-6">
          Elegí tu
          <br />
          <span className="italic-serif text-cream/70">entrenamiento</span>.
        </h2>
        <p className="text-lg text-cream/70 max-w-xl mb-16">
          Podés combinar todas las modalidades dentro de tu membresía. Cada
          turno, elegís.
        </p>

        <div className="grid grid-cols-1 border-t border-cream/10 sm:grid-cols-3 lg:grid-cols-5">
          {sede.disciplines.map((slug) => {
            const disciplina = disciplinas.find((d) => d.slug === slug);
            if (!disciplina) return null;
            return (
              <div
                key={slug}
                className="flex flex-col items-center justify-center border-b border-r border-cream/10 py-10"
              >
                <span className="display text-3xl">{disciplina.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
