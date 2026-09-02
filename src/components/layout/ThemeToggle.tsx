import { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { applyTheme, useThemeStore } from '@/hooks/useTheme'

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme)
  const toggle = useThemeStore((s) => s.toggle)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex size-7 items-center justify-center rounded-sm border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)] cursor-pointer"
    >
      {theme === 'dark' ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
    </button>
  )
}
