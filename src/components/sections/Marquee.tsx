const PHRASE = "CROSSFIT ✦ FUNCIONAL ✦ HIIT ✦ GAP ✦ FUERZA ✦";
const REPEATS = 4;

export function Marquee() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden bg-yellow py-4 text-ink md:py-6"
    >
      <div className="animate-marquee flex whitespace-nowrap font-display text-4xl md:text-5xl">
        {Array.from({ length: REPEATS }, (_, i) => (
          <span key={i} className="px-6">
            {PHRASE}
          </span>
        ))}
      </div>
    </div>
  );
}
