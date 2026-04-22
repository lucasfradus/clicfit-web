import { nutricion } from "@/lib/content/nutricion";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ClaseGratisButton } from "@/components/ui/ClaseGratisModal";

export function NutricionHero() {
  const { hero } = nutricion;

  return (
    <section className="relative flex min-h-[85vh] items-end overflow-hidden bg-ink pt-32 pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(251,250,63,0.08) 0%, rgba(251,250,63,0) 60%)",
        }}
      />

      <div className="container-clic relative z-10">
        <nav
          className="mb-12 flex items-center gap-1 text-xs text-cream/70"
          aria-label="Breadcrumb"
        >
          <a href="/" className="hover:text-cream transition-colors">
            Inicio
          </a>
          <span className="text-cream/30"> / </span>
          <a
            href="/nutricion"
            className="hover:text-cream transition-colors"
            aria-current="page"
          >
            Nutrición
          </a>
        </nav>

        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-yellow">
          {hero.eyebrow}
        </p>

        <h1
          className="display leading-[0.85]"
          style={{ fontSize: "clamp(64px, 14vw, 200px)" }}
        >
          {hero.display}
          <br />
          <span className="italic-serif text-yellow">{hero.italic}</span>
          <br />
          {hero.tail}
        </h1>

        <p className="mt-8 max-w-2xl text-xl leading-relaxed text-cream/85 md:text-2xl">
          Asesoramiento nutricional personalizado y medición InBody mensual. Sin
          costo aparte —{" "}
          <span className="font-semibold text-yellow">
            incluido en tu membresía
          </span>
          .
        </p>

        <div className="mt-10">
          <ClaseGratisButton variant="primary">
            <WhatsAppIcon className="size-5" />
            Probá una clase gratis
          </ClaseGratisButton>
        </div>
      </div>
    </section>
  );
}
