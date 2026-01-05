import type { RefObject } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, BookOpen, User, LogOut, Shield, ShieldCheck, ShieldX } from 'lucide-react'
import { useOutsideToggle } from '../../hooks/useOutsideToggle'
import LogoLink from './LogoLink'
import NavItem from './NavItem'
import ProfileMenu from './ProfileMenu'
import ThemeToggle from './ThemeToggle'
import { NotificationPanel } from '../notifications/NotificationPanel'
import type { NavBarProps, NavItemType } from '../../types/layout.ts'
import {useAuth} from "@/shared/hooks/useAuth.ts"
import {useUserStore} from "@/app/stores/userStore.ts"
import resolveAvatar from "@/shared/utils/resolveAvatar.ts"
import { Badge } from '@/shared/components/ui/badge'
import { useAdminRole } from '@/shared/hooks/admin/useAdminRole'
import { cn } from '@/shared/lib/utils'

export default function NavBar({ isAuthenticated = true }: NavBarProps) {
    const location = useLocation()
    const navigate = useNavigate();
    const { logout } = useAuth()
    const { user } = useUserStore()
    const { isOpen: mobileProfileOpen, ref: profileRef, toggle: toggleMobileProfile, close: closeMobileProfile } = useOutsideToggle(false)

    const { hasAnyAdminAccess, isModerator, isAdmin, isSuperAdmin } = useAdminRole()

    const getAdminBadgeConfig = () => {
        if (isSuperAdmin) {
            return {
                label: 'Super Admin',
                icon: ShieldX,
                className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40'
            }
        }
        if (isAdmin) {
            return {
                label: 'Admin',
                icon: Shield,
                className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/40'
            }
        }
        if (isModerator) {
            return {
                label: 'Modération',
                icon: ShieldCheck,
                className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40'
            }
        }
        return null
    }

    const adminBadgeConfig = getAdminBadgeConfig()

    const navItems: NavItemType[] = [
        { name: 'Dashboard', icon: Home, path: '/dashboard' },
        { name: 'Forum', icon: Users, path: '/forum' },
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
                                <NotificationPanel />

                                {hasAnyAdminAccess && adminBadgeConfig && (
                                    <Link to="/admin">
                                        <Badge className={cn('flex items-center gap-1.5 px-3 py-1.5 cursor-pointer transition-colors', adminBadgeConfig.className)}>
                                            <adminBadgeConfig.icon size={14} />
                                            <span className="text-xs font-semibold">{adminBadgeConfig.label}</span>
                                        </Badge>
                                    </Link>
                                )}

                                <Link
                                    to="/profil"
                                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-gt-primary hover:bg-gt-primary-hover overflow-hidden"
                                >
                                    {user?.avatar ? (
                                        <img src={resolveAvatar(user.avatar)} alt="Photo de profil" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={20} className="text-gt-primary-foreground" />
                                    )}
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
                        <NotificationPanel />
                    </div>
                </div>

                {/* Mobile - bottom nav */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gt-surface-elevated border-t border-gt-border z-50 transition-colors duration-300">
                    <div className="flex justify-around items-center h-16">
                        {navItems.map((item) => (
                            <NavItem key={item.name} name={item.name} icon={item.icon} path={item.path} active={isActive(item.path)} compact size={24} />
                        ))}

                        {hasAnyAdminAccess && adminBadgeConfig && (
                            <NavItem name={adminBadgeConfig.label} icon={adminBadgeConfig.icon} path="/admin" active={isActive('/admin')} compact size={24} />
                        )}

                        <ProfileMenu
                            refProp={profileRef as unknown as RefObject<HTMLDivElement>}
                            isOpen={mobileProfileOpen}
                            onToggle={toggleMobileProfile}
                            onClose={closeMobileProfile}
                            onLogout={() => {
                                onLogout()
                                closeMobileProfile()
                            }}
                            isActive={isActive('/profil')}
                        />
                    </div>
                </nav>
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
                        <Link to="/connexion" className="flex-1 py-3 text-center text-gt-interactive hover:bg-gt-surface-hover transition-colors">
                            Connexion
                        </Link>

                        <Link to="/inscription" className="flex-1 py-3 text-center bg-gt-primary text-gt-primary-foreground hover:bg-gt-primary-hover transition-colors">
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