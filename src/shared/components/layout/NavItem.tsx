import { Link } from 'react-router-dom'
import type { NavItemProps } from '../../types/types/layout'

export default function NavItem({ name, icon: Icon, path, active = false, onClick, size = 20, compact = false }: NavItemProps) {
    if (compact) {
        return (
            <Link to={path} onClick={onClick} className="flex items-center justify-center transition-colors flex-1 py-2">
                <div className={`px-3 py-2 rounded-full transition-colors ${active ? 'bg-gt-green' : ''}`}>
                    <Icon size={size} className={active ? 'text-white' : 'text-gt-dark-green'} />
                </div>
            </Link>
        )
    }

    return (
        <Link
            to={path}
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                active ? 'bg-gt-green text-white' : 'text-gt-dark-green hover:bg-gt-light-grey'
            }`}
        >
            <Icon size={size} className={active ? 'text-white' : 'text-gt-dark-green'} />
            <span className="font-medium">{name}</span>
        </Link>
    )
}