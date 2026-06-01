export function Marquee({ words }: { words: string[] }) {
  const row = (
    <div className="flex shrink-0 items-center gap-16 pr-16">
      {words.map((w, i) => (
        <span key={i} className="font-display text-[clamp(4rem,10vw,12rem)] leading-none text-ink/90">
          {w}
          <span className="mx-8 inline-block h-3 w-3 translate-y-[-0.3em] rounded-full bg-coral align-middle" />
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
