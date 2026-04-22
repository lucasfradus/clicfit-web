import { type Sede } from "@/lib/content/sedes";
import { waLinkSede } from "@/lib/whatsapp";
import { LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function SedeCtaFinal({ sede }: { sede: Sede }) {
  return (
    <section className="bg-yellow py-24 text-ink md:py-32">
      <div className="container-clic text-center">
        <h2 className="display text-[clamp(64px,12vw,160px)] leading-[0.85]">
          Probá una
          <br />
          <span className="italic-serif">clase</span>
          <br />
          GRATIS.
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-xl leading-relaxed">
          Primera clase sin cargo y sin compromiso. Escribinos por WhatsApp y te
          coordinamos el turno.
        </p>
        <div className="mt-10 flex justify-center">
          <LinkButton
            href={waLinkSede(sede.name, sede.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            variant="dark"
            className="px-10 py-5 text-sm"
          >
            <WhatsAppIcon className="size-5" />
            Reservar mi clase gratis
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
