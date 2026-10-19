import Link from "next/link";
import { nutricion } from "@/lib/content/nutricion";

export function NutricionNoSocio() {
  const { noSocio } = nutricion;

  return (
    <section id="turno" className="bg-ink py-24 md:py-32">
      <div className="container-clic">
        <div className="grid gap-10 border-t border-cream/10 pt-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-yellow-deep">
              {noSocio.eyebrow}
            </p>
            <h2 className="display text-5xl leading-[0.95] md:text-7xl">
              {noSocio.display}
              <br />
              <span className="italic-serif text-yellow">{noSocio.italic}</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:self-end">
            <p className="text-lg leading-relaxed text-cream/70">
              {noSocio.desc}
            </p>
            <Link
              href="/nutricion/turno"
              className="group mt-8 inline-flex items-center gap-3 bg-yellow px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-white"
            >
              {noSocio.cta}
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
