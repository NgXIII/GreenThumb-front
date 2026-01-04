import {
    Users,
    UserCheck,
    UserX,
    Trash2,
    Mail,
    MessageSquare,
    Shield,
    AlertTriangle,
    CheckCircle,
    Info,
    ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "@/app/stores/userStore";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface SectionHeaderProps {
    title: string;
    description: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    iconColor?: string;
}

interface StatCardProps {
    title: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    description: string;
    linkTo?: string;
    linkText?: string;
    iconColor?: string;
    iconBg?: string;
    count?: number;
    badge?: string;
    disabled?: boolean;
}

interface ActionItemProps {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    text: string;
    variant?: "default" | "warning" | "danger";
}

// ============================================================================
// Components
// ============================================================================

function SectionHeader({ title, description, icon: Icon, iconColor = "text-gt-primary" }: SectionHeaderProps) {
    return (
        <div className="flex items-start gap-4 mb-6">
            <div className={`p-3 rounded-xl bg-gt-surface-elevated border border-gt-border ${iconColor}`}>
                <Icon size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gt-text">{title}</h2>
                <p className="text-sm text-gt-text-muted mt-1">{description}</p>
            </div>
        </div>
    );
}

function StatCard({
    title,
    icon: Icon,
    description,
    linkTo,
    linkText,
    iconColor = "text-gt-primary",
    iconBg = "bg-gt-primary/10",
    count,
    badge,
    disabled = false
}: StatCardProps) {
    const content = (
        <div className={`
            bg-gt-surface-elevated rounded-xl border border-gt-border p-6
            transition-all duration-200
            ${!disabled ? 'hover:shadow-lg hover:scale-[1.02] hover:border-gt-primary/30' : 'opacity-60 cursor-not-allowed'}
        `}>
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${iconBg} transition-transform ${!disabled ? 'group-hover:scale-110' : ''}`}>
                    <Icon size={24} className={iconColor} />
                </div>
                {badge && (
                    <span className="px-2 py-1 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full border border-orange-200 dark:border-orange-800">
                        {badge}
                    </span>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gt-text">{title}</h3>
                    {count !== undefined && (
                        <span className="text-2xl font-bold text-gt-primary">{count}</span>
                    )}
                </div>
                <p className="text-sm text-gt-text-muted leading-relaxed">{description}</p>
            </div>

            {linkTo && linkText && !disabled && (
                <div className="mt-4 pt-4 border-t border-gt-border">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-gt-primary hover:text-gt-primary-hover transition-colors">
                        {linkText}
                        <ExternalLink size={14} />
                    </span>
                </div>
            )}
        </div>
    );

    if (disabled || !linkTo) {
        return content;
    }

    return (
        <Link to={linkTo} className="group block">
            {content}
        </Link>
    );
}

function ActionItem({ icon: Icon, text, variant = "default" }: ActionItemProps) {
    const colors = {
        default: "text-gt-text-muted",
        warning: "text-orange-600 dark:text-orange-400",
        danger: "text-red-600 dark:text-red-400"
    };

    return (
        <li className="flex items-start gap-2 text-sm">
            <Icon size={16} className={`mt-0.5 flex-shrink-0 ${colors[variant]}`} />
            <span className="text-gt-text-muted">{text}</span>
        </li>
    );
}

// ============================================================================
// Main Component
// ============================================================================

export default function AdminDashboard() {
    const { user } = useUserStore();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="pb-6 border-b border-gt-border">
                <h1 className="text-3xl sm:text-4xl font-bold text-gt-text">
                    Tableau de bord Admin
                </h1>
                <p className="text-gt-text-muted mt-2">
                    Bienvenue, {user?.username}. Gérez votre application depuis cet espace centralisé.
                </p>
            </div>

            {/* Section: Gestion des Utilisateurs */}
            <section className="space-y-4">
                <SectionHeader
                    title="Gestion des Utilisateurs"
                    description="Consultez, gérez et modérez les comptes utilisateurs de la plateforme"
                    icon={Users}
                    iconColor="text-green-600 dark:text-green-400"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Tous les utilisateurs"
                        icon={Users}
                        description="Accédez à la liste complète des utilisateurs et gérez leurs comptes"
                        linkTo="/admin/users"
                        linkText="Gérer les utilisateurs"
                        iconColor="text-gt-primary"
                        iconBg="bg-gt-primary/10"
                    />

                    <StatCard
                        title="Utilisateurs actifs"
                        icon={UserCheck}
                        description="Comptes vérifiés et actifs sur la plateforme"
                        linkTo="/admin/users?filter=active"
                        linkText="Voir les actifs"
                        iconColor="text-green-600 dark:text-green-400"
                        iconBg="bg-green-100 dark:bg-green-900/30"
                    />

                    <StatCard
                        title="Comptes désactivés"
                        icon={UserX}
                        description="Utilisateurs dont l'email n'est pas vérifié ou compte temporairement désactivé"
                        linkTo="/admin/users?filter=inactive"
                        linkText="Gérer les désactivés"
                        iconColor="text-orange-600 dark:text-orange-400"
                        iconBg="bg-orange-100 dark:bg-orange-900/30"
                    />

                    <StatCard
                        title="Suppression définitive"
                        icon={Trash2}
                        description="Utilisateurs anonymisés en attente de suppression physique (hard delete)"
                        linkTo="/admin/users?filter=deleted"
                        linkText="Voir les suppressions"
                        iconColor="text-red-600 dark:text-red-400"
                        iconBg="bg-red-100 dark:bg-red-900/30"
                    />
                </div>
            </section>

            {/* Section: Communications */}
            <section className="space-y-4">
                <SectionHeader
                    title="Communications"
                    description="Envoyez des messages et emails groupés aux utilisateurs"
                    icon={Mail}
                    iconColor="text-blue-600 dark:text-blue-400"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard
                        title="Envoi de mails groupés"
                        icon={Mail}
                        description="Communiquez avec tous les utilisateurs, le staff ou une sélection spécifique via email"
                        linkTo="/admin/communications"
                        linkText="Envoyer un email"
                        iconColor="text-blue-600 dark:text-blue-400"
                        iconBg="bg-blue-100 dark:bg-blue-900/30"
                    />

                </div>
            </section>

            {/* Section: Modération du Forum */}
            <section className="space-y-4">
                <SectionHeader
                    title="Modération du Forum"
                    description="Gérez les contenus signalés et modérez les discussions"
                    icon={MessageSquare}
                    iconColor="text-orange-600 dark:text-orange-400"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard
                        title="Messages signalés"
                        icon={AlertTriangle}
                        description="Consultez et traitez les messages signalés par la communauté"
                        iconColor="text-orange-600 dark:text-orange-400"
                        iconBg="bg-orange-100 dark:bg-orange-900/30"
                        badge="Bientôt"
                        disabled={true}
                    />

                    <StatCard
                        title="En attente de modération"
                        icon={MessageSquare}
                        description="Messages en attente de validation par l'équipe de modération"
                        iconColor="text-orange-600 dark:text-orange-400"
                        iconBg="bg-orange-100 dark:bg-orange-900/30"
                        badge="Bientôt"
                        disabled={true}
                    />

                </div>
            </section>

            {/* Actions & Restrictions Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Actions disponibles */}
                <div className="bg-gt-surface-elevated rounded-xl border border-gt-border p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-gt-primary/10">
                            <CheckCircle size={20} className="text-gt-primary" />
                        </div>
                        <h2 className="text-lg font-semibold text-gt-text">
                            Actions disponibles
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-medium text-gt-text mb-3 flex items-center gap-2">
                                <Users size={16} className="text-gt-primary" />
                                Gestion des comptes
                            </h3>
                            <ul className="space-y-2">
                                <ActionItem
                                    icon={CheckCircle}
                                    text="Activer/désactiver la vérification d'email des utilisateurs"
                                />
                                <ActionItem
                                    icon={UserX}
                                    text="Désactiver définitivement un compte avec anonymisation complète"
                                    variant="warning"
                                />
                                <ActionItem
                                    icon={Trash2}
                                    text="Suppression physique (hard delete) des données anonymisées"
                                    variant="danger"
                                />
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-medium text-gt-text mb-3 flex items-center gap-2">
                                <Mail size={16} className="text-blue-600 dark:text-blue-400" />
                                Communications
                            </h3>
                            <ul className="space-y-2">
                                <ActionItem
                                    icon={Mail}
                                    text="Envoyer des emails groupés à tous les utilisateurs actifs"
                                />
                                <ActionItem
                                    icon={Shield}
                                    text="Communiquer avec l'équipe staff (admins et modérateurs)"
                                />
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Restrictions de sécurité */}
                <div className="bg-gt-surface-elevated rounded-xl border border-gt-border p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                            <Shield size={20} className="text-orange-600 dark:text-orange-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-gt-text">
                            Restrictions de sécurité
                        </h2>
                    </div>

                    <ul className="space-y-3">
                        <ActionItem
                            icon={AlertTriangle}
                            text="Vous ne pouvez pas modifier votre propre compte"
                            variant="warning"
                        />
                        <ActionItem
                            icon={Shield}
                            text="Les comptes administrateurs ne peuvent pas être modifiés"
                            variant="warning"
                        />
                        <ActionItem
                            icon={Trash2}
                            text="La suppression définitive (hard delete) est totalement irréversible"
                            variant="danger"
                        />
                        <ActionItem
                            icon={UserX}
                            text="Les comptes désactivés définitivement ne peuvent pas être restaurés"
                            variant="danger"
                        />
                    </ul>

                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                        <div className="flex items-start gap-3">
                            <Info size={18} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-900 dark:text-blue-100">
                                <span className="font-semibold">Note importante :</span> La désactivation définitive anonymise immédiatement toutes les données personnelles de l'utilisateur. Cette action ne peut pas être annulée.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
