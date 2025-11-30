import { Link } from 'react-router-dom'
import type { NavItemProps } from '../../types/layout.ts'

export default function NavItem({ name, icon: Icon, path, active = false, onClick, size = 20, compact = false }: NavItemProps) {
    if (compact) {
        return (
            <Link to={path} onClick={onClick} className="flex items-center justify-center transition-colors flex-1 py-2">
                <div className={`px-3 py-2 rounded-full transition-colors ${active ? 'bg-gt-primary' : ''}`}>
                    <Icon size={size} className={active ? 'text-gt-primary-foreground' : 'text-gt-interactive'} />
                </div>
            </Link>
        )
    }

    return (
        <Link
            to={path}
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                active ? 'bg-gt-primary text-gt-primary-foreground' : 'text-gt-interactive hover:bg-gt-surface-hover'
            }`}
        >
            <Icon size={size} className={active ? 'text-gt-primary-foreground' : 'text-gt-interactive'} />
            <span className="font-medium">{name}</span>
        </Link>
    )
}