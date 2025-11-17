import type { RefObject } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, BookOpen, User, LogOut } from 'lucide-react'
import { useOutsideToggle } from '../../hooks/useOutsideToggle'
import LogoLink from './LogoLink'
import NavItem from './NavItem'
import ProfileMenu from './ProfileMenu'
import type { NavBarProps, NavItemType } from '../../types/layout.ts'

export default function NavBar({ isAuthenticated = true }: NavBarProps) {
    const location = useLocation()
    const navigate = useNavigate()
    const { isOpen: mobileProfileOpen, ref: profileRef, toggle: toggleMobileProfile, close: closeMobileProfile } = useOutsideToggle(false)

    const navItems: NavItemType[] = [
        { name: 'Dashboard', icon: Home, path: '/dashboard' },
        { name: 'Communauté', icon: Users, path: '/community' },
        { name: 'Ressources', icon: BookOpen, path: '/ressources' },
    ]

    const isActive = (path: string) => location.pathname === path

    const onLogout = () => {
        // remplacer par la logique réelle
        console.log('logout')
        navigate('/')
    }

    function AuthenticatedView() {
        return (
            <>
                {/* Desktop - connecté */}
                <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 hidden md:block">
                    <div className="px-4">
                        <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
                            <LogoLink />

                            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-8">
                                {navItems.map((item) => (
                                    <NavItem key={item.name} name={item.name} icon={item.icon} path={item.path} active={isActive(item.path)} />
                                ))}
                            </div>

                            <div className="flex items-center gap-4">
                                <Link
                                    to="/profile"
                                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-gt-green hover:bg-gt-dark-green"
                                >
                                    <User size={20} className="text-white" />
                                </Link>

                                <button className="flex items-center gap-2 text-gt-dark-green hover:text-red-600 transition-colors" onClick={onLogout}>
                                    <LogOut size={20} />
                                    <span className="font-medium">Déconnexion</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Mobile - logo top */}
                <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
                    <div className="px-4 h-16 flex items-center justify-center">
                        <LogoLink />
                    </div>
                </div>

                {/* Mobile - bottom nav */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
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
                <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 hidden md:block">
                    <div className="px-4 h-16 flex items-center justify-between max-w-7xl mx-auto">
                        <LogoLink />

                        <div className="flex items-center gap-3">
                            <Link to="/connexion" className="px-3 py-2 rounded-full text-gt-dark-green hover:bg-gt-light-grey transition-colors">
                                Se connecter
                            </Link>

                            <Link to="/inscription" className="px-3 py-2 rounded-full bg-gt-green text-white hover:bg-gt-dark-green transition-colors">
                                Créer un compte
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Mobile - logo top */}
                <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
                    <div className="px-4 h-16 flex items-center justify-center">
                        <LogoLink />
                    </div>
                </div>

                {/* Mobile - bottom actions */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                    <div className="flex">
                        <Link to="/login" className="flex-1 py-3 text-center text-gt-dark-green hover:bg-gt-light-grey transition-colors">
                            Connexion
                        </Link>

                        <Link to="/signup" className="flex-1 py-3 text-center bg-gt-green text-white hover:bg-gt-dark-green transition-colors">
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