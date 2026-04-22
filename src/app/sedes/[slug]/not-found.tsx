import Link from "next/link";
import { sedes } from "@/lib/content/sedes";
import { LinkButton } from "@/components/ui/Button";

export default function SedeNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-32 text-center">
      <p className="mb-6 text-xs uppercase tracking-[0.3em] text-yellow-deep">
        404
      </p>
      <h1 className="display text-[clamp(56px,12vw,140px)] leading-[0.85] mb-8">
        Esa sede
        <br />
        <span className="italic-serif">no existe</span>.
      </h1>
      <p className="mb-10 max-w-md text-lg text-cream/70">
        La sede que buscás no está en nuestra lista. Estas son las que sí:
      </p>
      <ul className="mb-12 flex flex-col gap-3 text-base text-cream">
        {sedes.map((sede) => (
          <li key={sede.slug}>
            <Link
              href={`/sedes/${sede.slug}`}
              className="text-cream/80 underline-offset-4 hover:text-yellow hover:underline transition-colors"
            >
              {sede.name} — {sede.zone}
            </Link>
          </li>
        ))}
      </ul>
      <LinkButton href="/" variant="outline">
        Volver al inicio →
      </LinkButton>
    </main>
  );
}
