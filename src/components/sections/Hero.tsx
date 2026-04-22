import { LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ClaseGratisButton } from "@/components/ui/ClaseGratisModal";
import { siteConfig } from "@/lib/content/site";

const STATS: { value: string; label: string }[] = [
  { value: "5+", label: "Disciplinas" },
  { value: "3", label: "Sedes" },
  { value: "500+", label: "Alumnos activos" },
  { value: "14h", label: "Clases por día" },
];

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center bg-ink pt-28 pb-16 md:pt-32">
      <div className="container-clic w-full">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:items-end lg:gap-12">
          <div>
            <div
              className="animate-reveal mb-6 text-[11px] uppercase tracking-[0.3em] text-cream/60"
              style={{ animationDelay: "0ms" }}
            >
              3 sedes · Zona norte · Desde {siteConfig.since}
            </div>
            <h1
              className="display animate-reveal text-[clamp(56px,14vw,200px)] leading-[0.85]"
              style={{ animationDelay: "100ms" }}
            >
              EL LUGAR
              <br />
              DONDE TUS
              <br />
              <span className="italic-serif text-yellow">hábitos</span>
              <br />
              CAMBIAN.
            </h1>
          </div>

          <div
            className="animate-reveal flex flex-col gap-6 lg:pb-4"
            style={{ animationDelay: "200ms" }}
          >
            <p className="max-w-md text-lg leading-relaxed text-cream/80">
              Entrenamiento real, coaches que te conocen, y un sistema que se
              adapta a tu objetivo. No es un gimnasio más.
            </p>
            <div className="flex flex-col gap-3">
              <ClaseGratisButton variant="primary">
                <WhatsAppIcon className="size-5" />
                Probá una clase gratis
              </ClaseGratisButton>
              <LinkButton href="/sedes" variant="outline">
                Ver sedes →
              </LinkButton>
            </div>
          </div>
        </div>

        <div
          className="animate-reveal mt-12 grid grid-cols-2 gap-6 border-t border-cream/15 pt-8 md:grid-cols-4 md:gap-8"
          style={{ animationDelay: "300ms" }}
        >
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="display text-4xl text-yellow-deep md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-xs uppercase tracking-widest text-cream/60">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
