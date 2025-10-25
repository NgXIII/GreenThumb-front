import { User, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ProfileMenuProps } from '../../types/types/layout'

export default function ProfileMenu({ isOpen, refProp, onToggle, onClose, onLogout, isActive = false }: ProfileMenuProps) {
    return (
        <div ref={refProp} className="flex items-center justify-center flex-1 py-2 relative">
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={onToggle}
                className={`px-3 py-2 rounded-full transition-colors ${isActive ? 'bg-gt-green' : ''}`}
            >
                <User size={24} className={isActive ? 'text-white' : 'text-gt-dark-green'} />
            </button>

            {isOpen && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-44 bg-white rounded-lg shadow-lg z-50">
                    <Link to="/profile" onClick={onClose} className="flex items-center gap-2 px-4 py-2 hover:bg-gt-light-grey rounded-t-md">
                        <User size={18} className="text-gt-dark-green" />
                        <span className="text-sm">Profil</span>
                    </Link>
                    <button
                        onClick={() => {
                            onLogout()
                            onClose()
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gt-light-grey rounded-b-md"
                    >
                        <LogOut size={18} className="text-gt-dark-green" />
                        <span className="text-sm">Déconnexion</span>
                    </button>
                </div>
            )}
        </div>
    )
}