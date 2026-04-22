import { nutricion } from "@/lib/content/nutricion";

export function NutricionIncludes() {
  const { includes } = nutricion;

  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="container-clic">
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-yellow-deep">
          {includes.eyebrow}
        </p>
        <h2 className="display text-5xl leading-[0.95] md:text-7xl">
          {includes.display}
          <br />
          <span className="italic-serif text-yellow">{includes.italic}</span>
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
          {includes.items.map((item, i) => (
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
