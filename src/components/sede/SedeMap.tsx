import { type Sede } from "@/lib/content/sedes";
import { waLinkSede } from "@/lib/whatsapp";
import { LinkButton } from "@/components/ui/Button";

export function SedeMap({ sede }: { sede: Sede }) {
  const mapsDestination = encodeURIComponent(
    `${sede.address.street} ${sede.address.locality}`,
  );

  return (
    <section className="py-24 md:py-32 bg-ink">
      <div className="container-clic">
        {/* Header */}
        <p className="text-xs uppercase tracking-[0.3em] text-yellow-deep mb-6">
          Ubicación
        </p>
        <h2 className="display text-5xl md:text-7xl leading-[0.95] mb-16">
          Cómo
          <br />
          <span className="italic-serif">llegar</span>.
        </h2>

        {/* Content grid */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column */}
          <div>
            <h3 className="display text-5xl leading-[0.95] mb-4">
              {sede.address.street}
            </h3>
            <p className="text-lg text-cream/70 mb-8">
              {sede.address.locality}, {sede.address.region}
            </p>

            {/* Transport */}
            <ul className="space-y-4 mb-10">
              {sede.transport.map((t) => (
                <li key={t.label} className="flex gap-4">
                  <span className="text-xs uppercase tracking-widest text-yellow-deep pt-1 w-16 shrink-0">
                    {t.label}
                  </span>
                  <span className="text-sm text-cream/70 leading-relaxed">
                    {t.description}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <LinkButton
                href={waLinkSede(sede.name, sede.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
              >
                Pedir indicaciones →
              </LinkButton>
              <LinkButton
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapsDestination}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
              >
                Abrir en Google Maps ↗
              </LinkButton>
            </div>
          </div>

          {/* Right column — map iframe */}
          <div className="aspect-[4/3] overflow-hidden border border-cream/15">
            <iframe
              title={`Mapa CLIC FIT ${sede.name}`}
              src={`https://maps.google.com/maps?q=${sede.coordinates.lat},${sede.coordinates.lng}&z=16&output=embed`}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[80%] contrast-[1.1] transition-all hover:grayscale-0 hover:contrast-100"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
