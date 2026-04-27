import type { Metadata } from "next";
import Image from "next/image";
import { sedes } from "@/lib/content/sedes";
import { LinkButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import fs from "node:fs";
import path from "node:path";

export const metadata: Metadata = {
  title: "Sedes",
  description:
    "Las 3 sedes de CLIC FIT en zona norte: Tortugas, Pilar La Lonja y Office Park Panamericana. CrossFit, Funcional, HIIT, GAP y Fuerza en todas.",
};

function publicFileExists(p: string): boolean {
  try {
    return fs.existsSync(
      path.join(process.cwd(), "public", p.replace(/^\//, ""))
    );
  } catch {
    return false;
  }
}

export default function SedesPage() {
  return (
    <>
      {/* Hero section */}
      <section className="bg-ink pb-16 pt-32 md:pt-40">
        <div className="container-clic">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-cream/60">
            Sedes
          </p>
          <h1 className="display text-[clamp(56px,12vw,160px)] leading-[0.85]">
            Tres sedes.
            <br />
            <span className="italic-serif">Una</span> comunidad.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-cream/70">
            Todas nuestras sedes están en zona norte y dictan las 5 modalidades.
            Elegí la más cercana y reservá tu primera clase gratis.
          </p>
        </div>
      </section>

      {/* Sedes list section */}
      <section className="bg-ink">
        {sedes.map((sede, index) => {
          const imageExists = publicFileExists(sede.heroImage);
          const isEvenIndex = index % 2 === 0;

          return (
            <div key={sede.slug}>
              {index > 0 && (
                <div className="container-clic">
                  <div className="border-t border-cream/10" />
                </div>
              )}

              <div
                className={cn(
                  "container-clic flex flex-col gap-10 py-16 md:py-24",
                  "lg:items-center lg:gap-16",
                  isEvenIndex ? "lg:flex-row" : "lg:flex-row-reverse"
                )}
              >
                {/* Image side */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink lg:w-5/12 lg:shrink-0">
                  {imageExists ? (
                    <Image
                      src={sede.heroImage}
                      alt={`CLIC FIT sede ${sede.name}, ${sede.zone}`}
                      fill
                      sizes="(min-width: 1024px) 42vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 bg-ink"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, rgba(245,241,232,0.05) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                      }}
                    />
                  )}
                </div>

                {/* Text side */}
                <div className="flex-1">
                  <p className="mb-4 text-xs uppercase tracking-[0.3em] text-yellow-deep">
                    Sede {String(index + 1).padStart(2, "0")} · {sede.zone}
                  </p>

                  <h2 className="display text-7xl leading-[0.9] md:text-8xl">
                    {sede.name}
                  </h2>

                  <p className="italic-serif mt-2 text-3xl text-yellow">
                    {sede.zone}
                  </p>

                  <p className="mt-4 text-sm text-cream/70">
                    {sede.address.street}, {sede.address.locality}
                  </p>

                  <p className="mt-1 text-xs text-cream/50">
                    Lun a Vie · {sede.hours.weekdays.opens} –{" "}
                    {sede.hours.weekdays.closes}
                    {sede.hours.saturday
                      ? ` · Sáb ${sede.hours.saturday.opens} – ${sede.hours.saturday.closes}`
                      : ""}
                  </p>

                  {/* Featured bullets */}
                  <ul className="mt-6 space-y-2">
                    {sede.featured.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-cream/80"
                      >
                        <span className="shrink-0 text-yellow">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <LinkButton href={`/sedes/${sede.slug}`} variant="primary">
                      Ver sede →
                    </LinkButton>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
