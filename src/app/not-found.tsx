import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { sedes } from "@/lib/content/sedes";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center bg-ink pt-32 pb-20">
      <div className="container-clic">
        <div className="max-w-3xl">
          <div className="mb-5 text-xs uppercase tracking-[0.3em] text-yellow">
            404
          </div>
          <h1 className="display mb-10 text-[clamp(56px,14vw,200px)] leading-[0.85]">
            Esta página
            <br />
            <span className="italic-serif text-yellow">no existe.</span>
          </h1>
          <p className="mb-10 max-w-xl text-lg text-cream/80 md:text-xl">
            La página que buscás no está acá. Puede que la hayamos movido o que
            el link tenga un error. Te dejamos por dónde seguir:
          </p>

          <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <LinkButton href="/" variant="primary">
              Ir al home
            </LinkButton>
            <LinkButton href="/sedes" variant="outline">
              Ver sedes →
            </LinkButton>
            <LinkButton href="/nutricion" variant="outline">
              Nutrición →
            </LinkButton>
          </div>

          <div className="border-t border-cream/10 pt-8">
            <div className="mb-4 text-xs uppercase tracking-[0.2em] text-cream/50">
              Nuestras sedes
            </div>
            <div className="flex flex-col gap-2 text-base">
              {sedes.map((sede) => (
                <Link
                  key={sede.slug}
                  href={`/sedes/${sede.slug}`}
                  className="transition-colors hover:text-yellow"
                >
                  {sede.name} · {sede.zone}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
