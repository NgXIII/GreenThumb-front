import { Link, useLocation } from "react-router-dom";
import { Home, Users, ArrowLeft, X, Shield, Mail, UserCog } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useAdminRole } from "@/shared/hooks/admin/useAdminRole";

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SidebarItem {
    name: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    path: string;
    roles: ('MODERATEUR' | 'ADMIN' | 'SUPER_ADMIN')[];
}

const sidebarItems: SidebarItem[] = [
    { name: "Accueil", icon: Home, path: "/admin", roles: ['MODERATEUR', 'ADMIN', 'SUPER_ADMIN'] },
    { name: "Utilisateurs", icon: Users, path: "/admin/users", roles: ['ADMIN', 'SUPER_ADMIN'] },
    { name: "Modération", icon: Shield, path: "/admin/moderation", roles: ['MODERATEUR', 'ADMIN', 'SUPER_ADMIN'] },
    { name: "Communications", icon: Mail, path: "/admin/communications", roles: ['ADMIN', 'SUPER_ADMIN'] },
    { name: "Gestion des rôles", icon: UserCog, path: "/admin/roles", roles: ['SUPER_ADMIN'] },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const location = useLocation();
    const { role } = useAdminRole();

    const isActive = (path: string) => {
        if (path === "/admin") {
            return location.pathname === "/admin";
        }
        return location.pathname.startsWith(path);
    };

    const visibleItems = sidebarItems.filter((item) => {
        // Filter items based on user role
        if (!role) return false;
        return item.roles.includes(role as 'MODERATEUR' | 'ADMIN' | 'SUPER_ADMIN');
    });

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-full bg-gt-surface-elevated border-r border-gt-border transition-transform duration-300 ease-in-out",
                    "w-64 flex flex-col",
                    "lg:translate-x-0 lg:static lg:z-auto lg:min-h-screen",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gt-border">
                    <div className="flex items-center gap-2">
                        <Shield size={24} className="text-gt-primary" />
                        <span className="font-semibold text-gt-text">Admin</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg hover:bg-gt-surface-hover transition-colors"
                        aria-label="Fermer le menu"
                    >
                        <X size={20} className="text-gt-text-muted" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {visibleItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    active
                                        ? "bg-gt-primary text-gt-primary-foreground"
                                        : "text-gt-text hover:bg-gt-surface-hover"
                                )}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer - Return to app */}
                <div className="p-4 border-t border-gt-border">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gt-text hover:bg-gt-surface-hover transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Retour à l'app</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}