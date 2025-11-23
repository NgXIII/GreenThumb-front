import { User, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ProfileMenuProps } from '../../types/layout.ts'

export default function ProfileMenu({ isOpen, refProp, onToggle, onClose, onLogout, isActive = false }: ProfileMenuProps) {
    return (
        <div ref={refProp} className="flex items-center justify-center flex-1 py-2 relative">
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={onToggle}
                className={`px-3 py-2 rounded-full transition-colors ${isActive ? 'bg-gt-primary' : ''}`}
            >
                <User size={24} className={isActive ? 'text-gt-primary-foreground' : 'text-gt-interactive'} />
            </button>

            {isOpen && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-44 bg-gt-surface-elevated rounded-lg shadow-lg z-50 transition-colors border border-gt-border">
                    <Link to="/profile" onClick={onClose} className="flex items-center gap-2 px-4 py-2 hover:bg-gt-surface-hover rounded-t-md transition-colors">
                        <User size={18} className="text-gt-interactive" />
                        <span className="text-sm text-gt-text">Profil</span>
                    </Link>
                    <button
                        onClick={() => {
                            onLogout()
                            onClose()
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gt-surface-hover rounded-b-md transition-colors"
                    >
                        <LogOut size={18} className="text-gt-interactive" />
                        <span className="text-sm text-gt-text">Déconnexion</span>
                    </button>
                </div>
            )}
        </div>
    )
}