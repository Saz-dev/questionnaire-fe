import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { MobileNav } from './MobileNav'

export function AppShell() {
  return (
    <div className="flex h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <TopBar />
      <main className="min-h-0 flex-1 overflow-hidden">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  )
}
