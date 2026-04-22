import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ClaseGratisButton } from "@/components/ui/ClaseGratisModal";

export function NutricionCtaFinal() {
  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="container-clic text-center">
        <h2
          className="display leading-[0.85]"
          style={{ fontSize: "clamp(64px, 14vw, 200px)" }}
        >
          Sin extras.
          <br />
          Sin sorpresas.
          <br />
          <span className="italic-serif text-yellow">Empezá</span>.
        </h2>
        <p className="mx-auto mt-10 max-w-2xl text-xl leading-relaxed text-cream/80">
          Reservá tu primera clase gratis. Conocé las sedes, conocé la dinámica,
          y si te suma, sumate. La nutrición —{" "}
          <span className="text-yellow">incluida en tu membresía</span> — te
          espera.
        </p>
        <div className="mt-10 flex justify-center">
          <ClaseGratisButton variant="primary">
            <WhatsAppIcon className="size-5" />
            Probá una clase gratis
          </ClaseGratisButton>
        </div>
      </div>
    </section>
  );
}
