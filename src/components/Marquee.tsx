export function Marquee({ words }: { words: string[] }) {
  const row = (
    <div className="flex shrink-0 items-center gap-16 pr-16">
      {words.map((w, i) => (
        <span key={i} className="inline-flex items-center font-display text-[clamp(4rem,10vw,12rem)] leading-none text-ink/90">
          {w}
          <span className="mx-8 h-3 w-3 rounded-full bg-coral shrink-0" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative w-full overflow-hidden border-y border-line/60 py-8">
      <div className="marquee flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}
