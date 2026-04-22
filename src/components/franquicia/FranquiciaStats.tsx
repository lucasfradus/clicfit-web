import { franquicia } from "@/lib/content/franquicia";

export function FranquiciaStats() {
  return (
    <section className="border-y border-cream/10 bg-ink">
      <div className="container-clic">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {franquicia.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`px-6 py-8 text-center ${
                i > 0 ? "border-l border-cream/10" : ""
              } ${i === 2 ? "border-l md:border-l" : ""}`}
            >
              <div className="display text-5xl text-yellow-deep md:text-6xl">
                {stat.num}
              </div>
              <div className="mt-3 text-xs uppercase tracking-[0.2em] text-cream/60">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
