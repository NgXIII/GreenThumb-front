import { Users, UserCheck, UserX, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "@/app/stores/userStore";

interface StatCardProps {
    title: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    description: string;
    linkTo?: string;
    linkText?: string;
    iconColor?: string;
    iconBg?: string;
}

function StatCard({
    title,
    icon: Icon,
    description,
    linkTo,
    linkText,
    iconColor = "text-gt-primary",
    iconBg = "bg-gt-primary/10",
}: StatCardProps) {
    return (
        <div className="bg-gt-surface-elevated rounded-xl border border-gt-border p-6 transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-gt-text-muted">{title}</p>
                    <p className="text-sm text-gt-text-muted mt-2">{description}</p>
                </div>
                <div className={`p-3 rounded-lg ${iconBg}`}>
                    <Icon size={24} className={iconColor} />
                </div>
            </div>
            {linkTo && linkText && (
                <Link
                    to={linkTo}
                    className="inline-block mt-4 text-sm font-medium text-gt-primary hover:text-gt-primary-hover transition-colors"
                >
                    {linkText} &rarr;
                </Link>
            )}
        </div>
    );
}

export default function AdminDashboard() {
    const { user } = useUserStore();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gt-text">
                    Tableau de bord Admin
                </h1>
                <p className="text-gt-text-muted mt-1">
                    Bienvenue, {user?.username}. Gérez votre application depuis cet espace.
                </p>
            </div>

            {/* Quick stats / Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Gestion des utilisateurs"
                    icon={Users}
                    description="Consultez et gérez tous les utilisateurs de la plateforme"
                    linkTo="/admin/users"
                    linkText="Voir les utilisateurs"
                />
                <StatCard
                    title="Utilisateurs actifs"
                    icon={UserCheck}
                    description="Filtrez par utilisateurs actifs"
                    linkTo="/admin/users?filter=active"
                    linkText="Voir les actifs"
                    iconColor="text-green-600 dark:text-green-400"
                    iconBg="bg-green-100 dark:bg-green-900/30"
                />
                <StatCard
                    title="Utilisateurs désactivés"
                    icon={UserX}
                    description="Utilisateurs désactivés mais non supprimés"
                    linkTo="/admin/users"
                    linkText="Gérer les désactivés"
                    iconColor="text-orange-600 dark:text-orange-400"
                    iconBg="bg-orange-100 dark:bg-orange-900/30"
                />
                <StatCard
                    title="Utilisateurs supprimés"
                    icon={Trash2}
                    description="Utilisateurs en attente de suppression définitive"
                    linkTo="/admin/users?filter=deleted"
                    linkText="Voir les supprimés"
                    iconColor="text-red-600 dark:text-red-400"
                    iconBg="bg-red-100 dark:bg-red-900/30"
                />
            </div>

            {/* Info panel */}
            <div className="bg-gt-surface-elevated rounded-xl border border-gt-border p-6">
                <h2 className="text-lg font-semibold text-gt-text mb-4">
                    Actions disponibles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <h3 className="font-medium text-gt-text">Gestion des comptes</h3>
                        <ul className="text-sm text-gt-text-muted space-y-1">
                            <li>• Activer ou désactiver des comptes utilisateurs</li>
                            <li>• Supprimer des utilisateurs (soft delete réversible)</li>
                            <li>• Restaurer des utilisateurs supprimés</li>
                            <li>• Supprimer définitivement des comptes</li>
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-medium text-gt-text">Restrictions de sécurité</h3>
                        <ul className="text-sm text-gt-text-muted space-y-1">
                            <li>• Vous ne pouvez pas modifier votre propre compte</li>
                            <li>• Les administrateurs ne peuvent pas être modifiés</li>
                            <li>• La suppression définitive est irréversible</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}