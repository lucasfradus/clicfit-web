import Image from "next/image";
import fs from "node:fs";
import path from "node:path";
import { type Sede } from "@/lib/content/sedes";

function publicFileExists(publicPath: string): boolean {
  try {
    return fs.existsSync(
      path.join(process.cwd(), "public", publicPath.replace(/^\//, "")),
    );
  } catch {
    return false;
  }
}

export function SedeGallery({ sede }: { sede: Sede }) {
  const availableImages = sede.gallery.filter((src) => publicFileExists(src));

  return (
    <section className="py-24 md:py-32 bg-ink">
      <div className="container-clic">
        {/* Header */}
        <p className="text-xs uppercase tracking-[0.3em] text-yellow-deep mb-6">
          El lugar
        </p>
        <h2 className="display text-5xl md:text-7xl leading-[0.95] mb-6">
          Así se
          <br />
          <span className="italic-serif">entrena</span>.
        </h2>

        {/* Gallery */}
        {sede.gallery.length === 0 || availableImages.length === 0 ? (
          <div className="mt-12 flex items-center justify-center py-24 border border-cream/10">
            <p className="display text-5xl text-cream/30">Fotos próximamente</p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableImages.map((src, i) => (
              <div key={src} className={i === 0 ? "sm:row-span-2" : ""}>
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={src}
                    alt={`${sede.name} ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
