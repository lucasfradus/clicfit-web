export function Field({
  label,
  error,
  ...rest
}: {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-cream/60">
        {label}
      </span>
      <input
        {...rest}
        aria-invalid={error ? true : undefined}
        className={
          "w-full border bg-transparent px-4 py-3 text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-yellow " +
          (error ? "border-red-400/70" : "border-cream/20")
        }
      />
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
