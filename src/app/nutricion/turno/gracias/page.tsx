import { Suspense } from "react";
import type { Metadata } from "next";
import { TurnoGracias } from "@/components/consultorio/TurnoGracias";

export const metadata: Metadata = {
  title: "Tu turno de nutrición",
  robots: { index: false, follow: false },
};

export default function TurnoGraciasPage() {
  return (
    <section className="min-h-screen bg-ink pb-24 pt-32 md:pt-40">
      <div className="container-clic">
        <Suspense
          fallback={
            <p className="text-sm uppercase tracking-[0.2em] text-cream/50">
              Cargando…
            </p>
          }
        >
          <TurnoGracias />
        </Suspense>
      </div>
    </section>
  );
}
