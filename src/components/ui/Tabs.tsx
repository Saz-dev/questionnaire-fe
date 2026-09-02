import { cn } from '@/utils/cn'

interface TabsProps<T extends string> {
  tabs: { id: T; label: string }[]
  active: T
  onChange: (id: T) => void
  className?: string
}

export function Tabs<T extends string>({ tabs, active, onChange, className }: TabsProps<T>) {
  return (
    <div className={cn('flex gap-1 border-b border-[var(--border)]', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative px-3 py-2 text-xs font-medium tracking-tight transition-colors cursor-pointer',
            active === tab.id ? 'text-[var(--text)]' : 'text-[var(--text-faint)] hover:text-[var(--text-muted)]',
          )}
        >
          {tab.label}
          {active === tab.id && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[var(--accent)]" />
          )}
        </button>
      ))}
    </div>
  )
}
