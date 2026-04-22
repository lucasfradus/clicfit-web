import { LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { waLinkFranquicia } from "@/lib/whatsapp";

export function FranquiciaCtaFinal() {
  return (
    <section className="bg-yellow py-24 text-ink md:py-32">
      <div className="container-clic text-center">
        <h2
          className="display leading-[0.85]"
          style={{ fontSize: "clamp(64px, 14vw, 200px)" }}
        >
          Hablemos.
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-xl leading-relaxed">
          Contanos brevemente tu perfil y zona de interés. Te respondemos en
          menos de 24 horas.
        </p>
        <div className="mt-10 flex justify-center">
          <LinkButton
            href={waLinkFranquicia()}
            target="_blank"
            rel="noopener noreferrer"
            variant="dark"
            className="px-10 py-5 text-sm"
          >
            <WhatsAppIcon className="size-5" />
            Escribir por WhatsApp
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
