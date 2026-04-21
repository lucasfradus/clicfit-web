import { LinkButton } from "@/components/ui/Button";
import { waLinkFranquicia } from "@/lib/whatsapp";

export function Franquicias() {
  return (
    <section
      id="franquicias"
      className="relative overflow-hidden border-t border-cream/10 bg-ink py-24 md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 size-96 rounded-full bg-yellow opacity-25 blur-[120px]"
      />

      <div className="container-clic relative">
        <div className="max-w-4xl">
          <div className="mb-6 text-xs uppercase tracking-[0.3em] text-yellow-deep">
            04 — Franquicias
          </div>
          <h2 className="display text-5xl leading-[0.95] md:text-7xl">
            Abrí tu
            <br />
            <span className="italic-serif text-yellow">CLIC</span> FIT.
          </h2>
          <p className="mt-8 mb-8 max-w-2xl text-xl leading-relaxed text-cream/70">
            Un modelo probado, sistema de management propio, marca consolidada
            en zona norte y soporte operativo completo. Si querés sumarte al
            crecimiento, hablemos.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <LinkButton
              href={waLinkFranquicia()}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
            >
              Pedir información →
            </LinkButton>
            <LinkButton href="#" variant="outline">
              Descargar brochure
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
