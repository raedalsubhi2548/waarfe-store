/** Ornamental section divider: hairlines fading out from a small gold mark. */
export default function Divider({ className = '' }) {
  return (
    <div className={`container-w flex items-center gap-4 ${className}`} role="separator" aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[rgb(215_198_118/0.7)] to-[rgb(215_198_118/0.9)]" />
      <span className="flex items-center gap-2">
        <span className="size-1 rounded-full bg-accent/70" />
        <span className="size-2.5 rotate-45 rounded-[2px] border-[1.5px] border-accent bg-background" />
        <span className="size-1.5 rotate-45 rounded-[1px] bg-primary" />
        <span className="size-2.5 rotate-45 rounded-[2px] border-[1.5px] border-accent bg-background" />
        <span className="size-1 rounded-full bg-accent/70" />
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgb(215_198_118/0.7)] to-[rgb(215_198_118/0.9)]" />
    </div>
  )
}
