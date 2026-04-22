import { ClaseGratisButton } from "@/components/ui/ClaseGratisModal";

export function CtaFinal() {
  return (
    <section className="bg-yellow py-24 text-ink md:py-32">
      <div className="container-clic text-center">
        <h2 className="display text-[clamp(64px,14vw,200px)] leading-[0.85]">
          A UN
          <br />
          <span className="italic-serif">clic</span>
          <br />
          DE EMPEZAR.
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-xl leading-relaxed">
          Reservá tu primera clase gratis. Sin compromiso, sin letra chica.
        </p>
        <div className="mt-10 flex justify-center">
          <ClaseGratisButton variant="dark" className="px-10 py-5 text-sm">
            Reservar ahora →
          </ClaseGratisButton>
        </div>
      </div>
    </section>
  );
}
