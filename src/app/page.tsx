import { LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig } from "@/lib/content/site";
import { waLinkClaseGratis } from "@/lib/whatsapp";

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-screen items-center pt-24">
        <div className="container-clic">
          <div className="mb-5 text-[11px] uppercase tracking-[0.3em] text-cream/60">
            3 sedes · Zona norte · Desde {siteConfig.since}
          </div>
          <h1 className="display text-[clamp(56px,14vw,200px)] leading-[0.85]">
            EL LUGAR
            <br />
            DONDE TUS
            <br />
            <span className="italic-serif text-yellow">hábitos</span>
            <br />
            CAMBIAN.
          </h1>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <LinkButton
              href={waLinkClaseGratis()}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
            >
              <WhatsAppIcon className="size-5" />
              Probá una clase gratis
            </LinkButton>
            <LinkButton href="/sedes" variant="outline">
              Ver sedes →
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="border-t border-cream/10 py-32 text-center text-cream/40">
        <div className="container-clic">
          <p className="display text-6xl">Próximas secciones</p>
          <p className="mt-4 text-sm uppercase tracking-widest">
            disciplinas · sedes · nutrición · franquicias
          </p>
        </div>
      </section>
    </>
  );
}
