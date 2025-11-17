import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

interface ThemeToggleProps {
  className?: string
  size?: number
  showLabel?: boolean
}

export default function ThemeToggle({ className = '', size = 20, showLabel = false }: ThemeToggleProps) {
  const { toggleTheme, isDark, resolvedTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative flex items-center justify-center rounded-full
        transition-all duration-300 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-gt-primary focus-visible:ring-offset-2
        hover:bg-gt-surface-hover
        ${showLabel ? 'gap-2 px-3 py-2' : 'w-10 h-10'}
        ${className}
      `}
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
      aria-pressed={isDark}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
    >
      <div className="relative">
        <Sun
          size={size}
          className={`
            absolute inset-0 transition-all duration-300 ease-in-out
            text-amber-500
            ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
          `}
          aria-hidden="true"
        />
        <Moon
          size={size}
          className={`
            transition-all duration-300 ease-in-out
            text-gt-interactive
            ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
          `}
          aria-hidden="true"
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gt-text">
          {resolvedTheme === 'light' ? 'Clair' : 'Sombre'}
        </span>
      )}
    </button>
  )
}