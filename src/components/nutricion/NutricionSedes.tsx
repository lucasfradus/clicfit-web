import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { sedes } from "@/lib/content/sedes";

function publicFileExists(p: string): boolean {
  try {
    return fs.existsSync(
      path.join(process.cwd(), "public", p.replace(/^\//, "")),
    );
  } catch {
    return false;
  }
}

export function NutricionSedes() {
  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="container-clic">
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-yellow-deep">
          04 — Dónde
        </p>
        <h2 className="display mb-4 text-5xl leading-[0.95] md:text-7xl">
          Se hace
          <br />
          en las <span className="italic-serif text-yellow">tres</span>.
        </h2>
        <p className="mb-16 max-w-xl text-lg leading-relaxed text-cream/70">
          El servicio de nutrición + InBody está disponible en todas nuestras
          sedes. Consultá los horarios para coordinar tu cita.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {sedes.map((sede, index) => {
            const hasHero = publicFileExists(sede.heroImage);
            const num = String(index + 1).padStart(2, "0");
            return (
              <Link
                key={sede.slug}
                href={`/sedes/${sede.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden bg-ink text-cream transition-colors duration-300 hover:bg-yellow hover:text-ink"
              >
                {hasHero && (
                  <Image
                    src={sede.heroImage}
                    alt={`Sede CLIC FIT ${sede.name}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover opacity-50 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-70"
                  />
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(10,10,10,0.3), rgba(10,10,10,0.9))",
                  }}
                />
                <div className="relative flex h-full flex-col justify-between p-6 md:p-7">
                  <div className="text-xs uppercase tracking-[0.3em] opacity-80">
                    Sede {num}
                  </div>
                  <div>
                    <div className="display text-5xl leading-[0.9] md:text-6xl">
                      {sede.name}
                    </div>
                    <div className="italic-serif mt-1 text-xl text-yellow">
                      {sede.zone}
                    </div>
                    <div className="mt-3 text-sm opacity-80">
                      {sede.address.street}, {sede.address.locality}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-current/20 pt-4 text-xs uppercase tracking-[0.2em]">
                      <span>Ver sede</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
