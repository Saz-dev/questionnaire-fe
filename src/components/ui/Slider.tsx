interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  format?: (value: number) => string
  hint?: string
}

export function Slider({ label, value, min, max, step = 1, onChange, format, hint }: SliderProps) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-[var(--text-muted)]">{label}</span>
        <span className="font-mono text-xs tabular-nums text-[var(--text)]">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 h-1 w-full cursor-pointer appearance-none rounded-full bg-[var(--surface-3)] accent-[var(--accent)]"
      />
      {hint && <p className="mt-1 text-[10.5px] leading-snug text-[var(--text-faint)]">{hint}</p>}
    </label>
  )
}
