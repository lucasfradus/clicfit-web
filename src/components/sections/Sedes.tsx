import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { sedes } from "@/lib/content/sedes";

function publicFileExists(publicPath: string): boolean {
  const rel = publicPath.replace(/^\//, "");
  const full = path.join(process.cwd(), "public", rel);
  try {
    return fs.existsSync(full);
  } catch {
    return false;
  }
}

export function Sedes() {
  return (
    <section id="sedes" className="bg-cream py-24 text-ink md:py-32">
      <div className="container-clic">
        <div className="mb-14">
          <div className="mb-6 text-xs uppercase tracking-[0.3em] text-ink/60">
            02 — Dónde
          </div>
          <h2 className="display text-5xl leading-[0.95] md:text-7xl">
            Tres sedes.
            <br />
            <span className="italic-serif">Una</span> comunidad.
          </h2>
        </div>

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
                    alt={`Sede ${sede.name}`}
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
                    <div className="display text-6xl leading-[0.9] md:text-7xl">
                      {sede.name}
                    </div>
                    <div className="italic-serif mt-2 text-xl text-yellow md:text-2xl">
                      {sede.zone}
                    </div>
                    <div className="mt-4 text-sm opacity-80">
                      {sede.address.street}, {sede.address.locality}
                    </div>
                    <div className="mt-1 text-xs opacity-70">
                      Lun a Vie · {sede.hours.weekdays.opens} a{" "}
                      {sede.hours.weekdays.closes}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-current/30 pt-4 text-xs uppercase tracking-[0.2em]">
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
