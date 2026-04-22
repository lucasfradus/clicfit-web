import { type Sede } from "@/lib/content/sedes";
import { waLinkSede } from "@/lib/whatsapp";

export function SedeQuickInfo({ sede }: { sede: Sede }) {
  return (
    <div className="bg-ink border-b border-cream/10">
      <div className="container-clic grid grid-cols-1 gap-px bg-cream/10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Horario */}
        <div className="bg-ink p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.25em] text-yellow-deep mb-2">
            Horario general
          </p>
          <p className="text-sm leading-relaxed text-cream/90">
            Lun a Vie {sede.hours.weekdays.opens} – {sede.hours.weekdays.closes}
            {sede.hours.saturday && (
              <>
                <br />
                <span className="text-cream/60">
                  Sáb {sede.hours.saturday.opens} – {sede.hours.saturday.closes}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Teléfono */}
        <div className="bg-ink p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.25em] text-yellow-deep mb-2">
            Teléfono
          </p>
          <p className="text-sm leading-relaxed text-cream/90">
            <a
              href={waLinkSede(sede.name, sede.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow transition-colors"
            >
              {sede.phone}
            </a>
            <br />
            <span className="text-cream/50 text-xs">WhatsApp y llamadas</span>
          </p>
        </div>

        {/* Email */}
        <div className="bg-ink p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.25em] text-yellow-deep mb-2">
            Email
          </p>
          <p className="text-sm leading-relaxed text-cream/90">
            <a
              href={`mailto:${sede.email}`}
              className="hover:text-yellow transition-colors"
            >
              {sede.email}
            </a>
          </p>
        </div>

        {/* Comodidades */}
        <div className="bg-ink p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.25em] text-yellow-deep mb-2">
            Comodidades
          </p>
          <p className="text-sm leading-relaxed text-cream/90">
            {sede.amenities.join(" · ")}
          </p>
        </div>
      </div>
    </div>
  );
}
