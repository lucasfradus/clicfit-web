import Image from "next/image";
import fs from "node:fs";
import path from "node:path";
import { sedes, type Sede } from "@/lib/content/sedes";
import { waLinkSede } from "@/lib/whatsapp";
import { LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

function publicFileExists(publicPath: string): boolean {
  try {
    return fs.existsSync(
      path.join(process.cwd(), "public", publicPath.replace(/^\//, "")),
    );
  } catch {
    return false;
  }
}

export function SedeHero({ sede }: { sede: Sede }) {
  const index = sedes.findIndex((s) => s.slug === sede.slug) + 1;
  const indexStr = String(index).padStart(2, "0");
  const heroExists = publicFileExists(sede.heroImage);

  return (
    <section className="relative min-h-[80vh] md:min-h-[85vh] bg-ink">
      {heroExists && (
        <Image
          src={sede.heroImage}
          alt={sede.name}
          fill
          sizes="100vw"
          className="object-cover"
          preload={true}
        />
      )}
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.5) 40%, rgba(10,10,10,0.95) 100%)",
        }}
      />
      {/* Content */}
      <div className="container-clic relative z-10 flex h-full min-h-[inherit] flex-col justify-end pb-16 pt-28">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-12 flex items-center gap-1 text-xs text-cream/70"
        >
          <a href="/" className="hover:text-yellow transition-colors">
            Inicio
          </a>
          <span className="text-cream/30"> / </span>
          <a href="/sedes" className="hover:text-yellow transition-colors">
            Sedes
          </a>
          <span className="text-cream/30"> / </span>
          <a
            href={`/sedes/${sede.slug}`}
            className="hover:text-yellow transition-colors"
          >
            {sede.name}
          </a>
        </nav>

        {/* Eyebrow */}
        <p className="text-xs uppercase tracking-[0.3em] text-cream/70 mb-4">
          Sede {indexStr} · {sede.address.locality}
        </p>

        {/* Heading */}
        <h1 className="display text-[clamp(64px,14vw,200px)] leading-[0.85]">
          {sede.name}
          <br />
          <span className="italic-serif text-yellow">{sede.zone}</span>
        </h1>

        {/* Address */}
        <p className="mt-4 text-base md:text-lg text-cream/85">
          {sede.address.street}, {sede.address.postalCode}{" "}
          {sede.address.locality}, {sede.address.region}
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <LinkButton
            href={waLinkSede(sede.name, sede.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
          >
            <WhatsAppIcon className="size-5" />
            Reservar por WhatsApp
          </LinkButton>
          <LinkButton href="#horarios" variant="outline">
            Ver horarios ↓
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
