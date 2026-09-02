import { cn } from '@/utils/cn'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse-soft rounded-sm bg-[var(--surface-3)]', className)} />
}
