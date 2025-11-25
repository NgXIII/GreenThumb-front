import type { RefObject } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, BookOpen, User, LogOut } from 'lucide-react'
import { useOutsideToggle } from '../../hooks/useOutsideToggle'
import LogoLink from './LogoLink'
import NavItem from './NavItem'
import ProfileMenu from './ProfileMenu'
import ThemeToggle from './ThemeToggle'
import type { NavBarProps, NavItemType } from '../../types/layout.ts'
import {useAuth} from "@/shared/hooks/useAuth.ts";

export default function NavBar({ isAuthenticated = true }: NavBarProps) {
    const location = useLocation()
    const navigate = useNavigate();
    const { logout } = useAuth()
    const { isOpen: mobileProfileOpen, ref: profileRef, toggle: toggleMobileProfile, close: closeMobileProfile } = useOutsideToggle(false)

    const navItems: NavItemType[] = [
        { name: 'Dashboard', icon: Home, path: '/dashboard' },
        { name: 'Communauté', icon: Users, path: '/community' },
        { name: 'Ressources', icon: BookOpen, path: '/ressources' },
    ]

    const isActive = (path: string) => location.pathname === path

    const onLogout = () => {
        try {
            logout()
            navigate('/')
        } catch {
            console.error('Logout error')
        }
    }

    function AuthenticatedView() {
        return (
            <>
                {/* Desktop - connecté */}
                <nav className="bg-gt-surface-elevated border-b border-gt-border sticky top-0 z-50 hidden md:block transition-colors duration-300">
                    <div className="px-4">
                        <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
                            <LogoLink />

                            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-8">
                                {navItems.map((item) => (
                                    <NavItem key={item.name} name={item.name} icon={item.icon} path={item.path} active={isActive(item.path)} />
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                <ThemeToggle />

                                <Link
                                    to="/profile"
                                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-gt-primary hover:bg-gt-primary-hover"
                                >
                                    <User size={20} className="text-gt-primary-foreground" />
                                </Link>

                                <button className="flex items-center gap-2 text-gt-interactive hover:text-red-600 dark:hover:text-red-400 transition-colors" onClick={onLogout}>
                                    <LogOut size={20} />
                                    <span className="font-medium">Déconnexion</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Mobile - logo top */}
                <div className="md:hidden bg-gt-surface-elevated border-b border-gt-border sticky top-0 z-50 transition-colors duration-300">
                    <div className="px-4 h-16 flex items-center justify-between">
                        <ThemeToggle size={18} />
                        <LogoLink />
                        <div className="w-10" /> {/* Spacer for balance */}
                    </div>
                </div>

                {/* Mobile - bottom nav */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gt-surface-elevated border-t border-gt-border z-50 transition-colors duration-300">
                    <div className="flex justify-around items-center h-16">
                        {navItems.map((item) => (
                            <NavItem key={item.name} name={item.name} icon={item.icon} path={item.path} active={isActive(item.path)} compact size={24} />
                        ))}

                        <ProfileMenu
                            refProp={profileRef as unknown as RefObject<HTMLDivElement>}
                            isOpen={mobileProfileOpen}
                            onToggle={toggleMobileProfile}
                            onClose={closeMobileProfile}
                            onLogout={() => {
                                onLogout()
                                closeMobileProfile()
                            }}
                            isActive={isActive('/profile')}
                        />
                    </div>
                </nav>

                <div className="md:hidden h-16"></div>
            </>
        )
    }

    function DisconnectedView() {
        return (
            <>
                {/* Desktop - déconnecté */}
                <nav className="bg-gt-surface-elevated border-b border-gt-border sticky top-0 z-50 hidden md:block transition-colors duration-300">
                    <div className="px-4 h-16 flex items-center justify-between max-w-7xl mx-auto">
                        <LogoLink />

                        <div className="flex items-center gap-3">
                            <ThemeToggle />

                            <Link to="/connexion" className="px-3 py-2 rounded-full text-gt-interactive hover:bg-gt-surface-hover transition-colors">
                                Se connecter
                            </Link>

                            <Link to="/inscription" className="px-3 py-2 rounded-full bg-gt-primary text-gt-primary-foreground hover:bg-gt-primary-hover transition-colors">
                                Créer un compte
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Mobile - logo top */}
                <div className="md:hidden bg-gt-surface-elevated border-b border-gt-border sticky top-0 z-50 transition-colors duration-300">
                    <div className="px-4 h-16 flex items-center justify-between">
                        <ThemeToggle size={18} />
                        <LogoLink />
                        <div className="w-10" /> {/* Spacer for balance */}
                    </div>
                </div>

                {/* Mobile - bottom actions */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gt-surface-elevated border-t border-gt-border z-50 transition-colors duration-300">
                    <div className="flex">
                        <Link to="/login" className="flex-1 py-3 text-center text-gt-interactive hover:bg-gt-surface-hover transition-colors">
                            Connexion
                        </Link>

                        <Link to="/signup" className="flex-1 py-3 text-center bg-gt-primary text-gt-primary-foreground hover:bg-gt-primary-hover transition-colors">
                            Inscription
                        </Link>
                    </div>
                </nav>

                <div className="md:hidden h-16" />
            </>
        )
    }

    return isAuthenticated ? <AuthenticatedView /> : <DisconnectedView />
}