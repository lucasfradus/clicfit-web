import { franquicia } from "@/lib/content/franquicia";
import { LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { waLinkFranquicia } from "@/lib/whatsapp";

export function FranquiciaHero() {
  return (
    <section className="relative flex min-h-[80vh] items-end overflow-hidden bg-ink pt-32 pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-yellow opacity-[0.15] blur-[160px]"
      />

      <div className="container-clic relative z-10">
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-yellow">
          Franquicias
        </p>

        <h1
          className="display leading-[0.85]"
          style={{ fontSize: "clamp(64px, 14vw, 200px)" }}
        >
          {franquicia.headline.display}
          <br />
          <span className="italic-serif text-yellow">
            {franquicia.headline.italic}
          </span>{" "}
          {franquicia.headline.tail}
        </h1>

        <p className="mt-8 max-w-2xl text-xl leading-relaxed text-cream/80 md:text-2xl">
          {franquicia.subhead}
        </p>

        <div className="mt-10">
          <LinkButton
            href={waLinkFranquicia()}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
          >
            <WhatsAppIcon className="size-5" />
            Hablemos por WhatsApp
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
