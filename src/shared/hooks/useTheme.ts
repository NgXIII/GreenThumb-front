import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'greenthumb-theme'

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return 'system'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme

  if (effectiveTheme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme())
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    const stored = getStoredTheme()
    return stored === 'system' ? getSystemTheme() : stored
  })
    
  useEffect(() => {
    applyTheme(theme)
    setResolvedTheme(theme === 'system' ? getSystemTheme() : theme)
  }, [theme])
    
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
        setResolvedTheme(getSystemTheme())
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(STORAGE_KEY, newTheme)
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
  }
}