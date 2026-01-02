import { Menu, User, LogOut, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { useUserStore } from "@/app/stores/userStore";
import ThemeToggle from "@/shared/components/layout/ThemeToggle";

interface AdminNavbarProps {
    onMenuClick: () => void;
}

export default function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { user } = useUserStore();

    const onLogout = () => {
        try {
            logout();
            navigate("/");
        } catch {
            console.error("Logout error");
        }
    };

    return (
        <header className="sticky top-0 z-30 bg-gt-surface-elevated border-b border-gt-border">
            <div className="flex items-center justify-between h-16 px-4">
                {/* Left side - Menu button (mobile) + Logo */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg hover:bg-gt-surface-hover transition-colors"
                        aria-label="Ouvrir le menu"
                    >
                        <Menu size={24} className="text-gt-text" />
                    </button>

                    {/* Logo for mobile */}
                    <div className="lg:hidden flex items-center gap-2">
                        <Shield size={24} className="text-gt-primary" />
                        <span className="font-semibold text-gt-text">Admin</span>
                    </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <ThemeToggle />

                    <div className="hidden sm:flex items-center gap-2 text-gt-text-muted">
                        <span className="text-sm">{user?.username}</span>
                    </div>

                    <Link
                        to="/profil"
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-colors bg-gt-primary hover:bg-gt-primary-hover"
                    >
                        <User size={18} className="text-gt-primary-foreground" />
                    </Link>

                    <button
                        onClick={onLogout}
                        className="hidden sm:flex items-center gap-2 text-gt-interactive hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Déconnexion</span>
                    </button>

                    {/* Mobile logout */}
                    <button
                        onClick={onLogout}
                        className="sm:hidden p-2 rounded-lg hover:bg-gt-surface-hover transition-colors"
                        aria-label="Déconnexion"
                    >
                        <LogOut size={20} className="text-gt-interactive hover:text-red-500" />
                    </button>
                </div>
            </div>
        </header>
    );
}