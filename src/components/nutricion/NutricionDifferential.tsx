import { nutricion } from "@/lib/content/nutricion";

export function NutricionDifferential() {
  const { differential } = nutricion;

  return (
    <section className="bg-yellow py-32 text-ink md:py-40">
      <div className="container-clic">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-ink/70">
            {differential.eyebrow}
          </p>
          <h2
            className="display leading-[0.9]"
            style={{ fontSize: "clamp(56px, 10vw, 128px)" }}
          >
            {differential.display}
            <br />
            <span className="italic-serif">{differential.italic}</span>
          </h2>
          <p className="mt-10 text-xl leading-relaxed md:text-2xl">
            {differential.desc}
          </p>
        </div>
      </div>
    </section>
  );
}
