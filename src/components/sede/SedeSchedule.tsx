import { type Sede, getHourBlocks } from "@/lib/content/sedes";
import { waLinkSede } from "@/lib/whatsapp";
import { LinkButton } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function SedeSchedule({ sede }: { sede: Sede }) {
  const blocks = getHourBlocks(
    sede.hours.weekdays.opens,
    sede.hours.weekdays.closes,
  );

  return (
    <section
      id="horarios"
      className="py-24 md:py-32"
      style={{ background: "rgba(245,241,232,0.02)" }}
    >
      <div className="container-clic">
        {/* Header */}
        <p className="text-xs uppercase tracking-[0.3em] text-yellow-deep mb-6">
          Horarios
        </p>
        <h2 className="display text-5xl md:text-7xl leading-[0.95] mb-6">
          Grilla de
          <br />
          turnos <span className="italic-serif">fija</span>.
        </h2>
        <p className="text-lg text-cream/70 max-w-xl mb-16">
          Cada turno dura una hora. Elegí el que te quede mejor y dentro del
          horario podés optar por CrossFit, Funcional, HIIT, GAP o Fuerza.
          Reservá con al menos 24 hs de anticipación.
        </p>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr>
                {["Horario", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(
                  (h) => (
                    <th
                      key={h}
                      className="border-b border-cream/10 py-3 px-4 text-left text-[10px] uppercase tracking-[0.2em] text-yellow"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {blocks.map((block) => {
                const satAvail =
                  sede.hours.saturday !== null &&
                  block.start >= sede.hours.saturday.opens &&
                  block.start < sede.hours.saturday.closes;

                return (
                  <tr key={block.start} className="border-b border-cream/10">
                    <td className="py-3 px-4 text-cream/60 text-xs">
                      {block.start} – {block.end}
                    </td>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <td key={i} className="py-3 px-4">
                        <div className="bg-yellow/5 hover:bg-yellow/15 transition-colors flex items-center justify-center py-2">
                          <span className="size-2 rounded-full bg-yellow" />
                        </div>
                      </td>
                    ))}
                    <td className="py-3 px-4">
                      {satAvail ? (
                        <div className="bg-yellow/5 hover:bg-yellow/15 transition-colors flex items-center justify-center py-2">
                          <span className="size-2 rounded-full bg-yellow" />
                        </div>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Note */}
        <div className="mt-8 border-l-2 border-yellow bg-cream/4 p-4 text-sm text-cream/70">
          {sede.hours.saturday
            ? "Los feriados se rigen por el horario de sábado. Ante dudas sobre cupo o disponibilidad, escribinos por WhatsApp."
            : "Los feriados: escribinos por WhatsApp para consultar disponibilidad."}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <LinkButton
            href={waLinkSede(sede.name, sede.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
          >
            <WhatsAppIcon className="size-5" />
            Reservar tu turno
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
