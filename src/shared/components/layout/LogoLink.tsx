import { Link } from 'react-router-dom'
import logo from '../../../assets/logo.png'
import type { LogoLinkProps } from '../../types/types/layout'

export default function LogoLink({ className = '' }: LogoLinkProps) {
    return (
        <Link to="/" className={`flex items-center gap-2 ${className}`}>
            <img src={logo} className="w-10 h-auto" alt="logo" />
            <span className="text-xl text-gt-green font-bold gradient-text">GreenThumb</span>
        </Link>
    )
}