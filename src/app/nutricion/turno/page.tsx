import type { Metadata } from "next";
import { SacarTurno } from "@/components/consultorio/SacarTurno";

export const metadata: Metadata = {
  title: "Sacá tu turno de nutrición",
  description:
    "Turno con nutricionista en CLIC FIT para no socios. Elegí la consulta, el día y el horario, y reservá con una seña por Mercado Pago.",
  alternates: { canonical: "/nutricion/turno" },
};

export default function TurnoNutricionPage() {
  return (
    <section className="min-h-screen bg-ink pb-24 pt-32 md:pt-40">
      <div className="container-clic">
        <SacarTurno />
      </div>
    </section>
  );
}
