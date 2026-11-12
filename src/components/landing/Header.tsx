// Figma: "Header" — 412px (6005:3620) and 1280px (6017:370); identical layout.
// The border runs the full width of the screen; the content stays within 1440px (max-w-page).
// Assets are expected in /public/landing/.

import { Link } from 'react-router'
import { useAuth } from '@/lib/auth'

export function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="border-b border-brand-border">
      <div className="mx-auto flex max-w-page items-center justify-between px-6 pt-12 pb-2">
        <Link to="/" aria-label="Unpicked home" className="block h-6 w-24">
          <img src="/landing/logo.svg" alt="Unpicked" className="size-full" />
        </Link>

        <nav className="flex items-center gap-2">
          {/* Figma: "Button - Nova" (ghost) */}
          <Link
            to="/projects"
            className="flex items-center justify-center rounded-lg px-2.5 py-2 text-body-sm font-medium text-chestnut-900 hover:bg-white/60"
          >
            Projects
          </Link>

          {user ? (
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex items-center justify-center rounded-lg px-2.5 py-2 text-body-sm font-medium text-chestnut-900 hover:bg-white/60"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/sign-in"
              className="flex items-center justify-center rounded-lg px-2.5 py-2 text-body-sm font-medium text-chestnut-900 hover:bg-white/60"
            >
              Sign in
            </Link>
          )}

          {/* Figma: "Icon Button - Nova" */}
          <button
            type="button"
            aria-label="Open menu"
            className="flex min-h-9 min-w-9 items-center justify-center rounded-lg p-2.5 hover:bg-white/60"
          >
            <img src="/landing/menu-icon.svg" alt="" className="size-4" />
          </button>
        </nav>
      </div>
    </header>
  )
}
