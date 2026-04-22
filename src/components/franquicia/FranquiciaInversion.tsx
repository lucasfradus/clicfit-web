import { LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { waLinkFranquicia } from "@/lib/whatsapp";

export function FranquiciaInversion() {
  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="container-clic">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-yellow-deep">
            03 — Inversión
          </p>
          <h2 className="display text-5xl leading-[0.95] md:text-7xl">
            Depende de
            <br />
            <span className="italic-serif text-yellow">vos</span>.
          </h2>
          <p className="mt-8 text-xl leading-relaxed text-cream/80 md:text-2xl">
            La inversión varía según la zona, el tamaño del local y el nivel de
            obra necesario. Preferimos conversarlo directamente — cada proyecto
            es distinto y te pasamos un estimado realista para tu caso puntual.
          </p>
          <div className="mt-10 flex justify-center">
            <LinkButton
              href={waLinkFranquicia()}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
            >
              <WhatsAppIcon className="size-5" />
              Consultar inversión
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
