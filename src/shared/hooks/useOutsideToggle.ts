import { useEffect, useRef, useState } from 'react'

export function useOutsideToggle(initial = false) {
  const [isOpen, setIsOpen] = useState<boolean>(initial)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (isOpen && ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const toggle = () => setIsOpen(s => !s)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return { isOpen, setIsOpen, ref, toggle, open, close }
}

/* Exemple d'utilisation dans `src/shared/components/layout/NavBar.tsx` :
import { useOutsideToggle } from '../../hooks/useOutsideToggle'

const { isOpen: mobileProfileOpen, ref: profileRef, toggle: toggleMobileProfile, close: closeMobileProfile } = useOutsideToggle(false)

Remplace les variables locales et l'effect existant :
- utilise `profileRef` au lieu de `useRef`
- utilise `mobileProfileOpen` au lieu de `mobileProfileOpen` state
- appelle `toggleMobileProfile()` pour ouvrir/fermer
- appelle `closeMobileProfile()` dans `onLogout`
*/