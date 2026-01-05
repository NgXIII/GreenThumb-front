import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Mail, Phone, User, Award, MessageCircle, Book } from 'lucide-react';
import type { UserAccount } from "@/shared/types/user";
import resolveAvatar from "@/shared/utils/resolveAvatar";

interface UserProfileModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: UserAccount;
    nextTier: { name: string; messageRequired: number } | null;
}

export default function UserProfileModal({ open, onOpenChange, user, nextTier }: UserProfileModalProps) {
    const progress = nextTier
        ? ((user.messageCount - user.tier.messageRequired) / (nextTier.messageRequired - user.tier.messageRequired)) * 100
        : 100;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Profil Utilisateur</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Avatar & Basic Info */}
                    <div className="flex flex-col items-center gap-4 pb-6 border-b border-gt-border/50">
                        <div className="relative inline-block">
                            <img
                                src={resolveAvatar(user.avatar)}
                                alt="avatar"
                                className="w-24 h-24 rounded-full bg-gradient-to-br from-gt-primary to-gt-primary-dark shadow-lg"
                            />
                            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap max-w-[150px] truncate ${
                                user.role === 'ADMIN'
                                    ? 'bg-gradient-to-r from-red-500 to-red-600'
                                    : user.role === 'MODERATEUR'
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                                    : 'bg-gt-primary'
                            }`}>
                                {user.role === 'ADMIN' ? 'Admin' : user.role === 'MODERATEUR' ? 'Modérateur' : user.tier.name}
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gt-text">{user.username}</h3>
                            <p className="text-sm text-gt-text-muted">
                                {user.firstname} {user.lastname}
                            </p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gt-text-muted uppercase tracking-wider flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Informations
                        </h4>

                        <div className="space-y-2">
                            <div className="flex items-center gap-3 p-3 bg-gt-surface/40 rounded-lg">
                                <Mail className="w-4 h-4 text-gt-primary" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gt-text-muted">Email</p>
                                    <p className="text-sm text-gt-text truncate">{user.email}</p>
                                </div>
                            </div>

                            {user.phoneNumber && (
                                <div className="flex items-center gap-3 p-3 bg-gt-surface/40 rounded-lg">
                                    <Phone className="w-4 h-4 text-gt-primary" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gt-text-muted">Téléphone</p>
                                        <p className="text-sm text-gt-text">{user.phoneNumber}</p>
                                    </div>
                                </div>
                            )}

                            {user.biography && (
                                <div className="flex items-start gap-3 p-3 bg-gt-surface/40 rounded-lg">
                                    <Book className="w-4 h-4 text-gt-primary mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gt-text-muted">Biographie</p>
                                        <p className="text-sm text-gt-text">{user.biography}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tier & Progress or Admin Privileges */}
                    {user.role === 'ADMIN' ? (
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gt-text-muted uppercase tracking-wider flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                Privilèges
                            </h4>

                            <div className="p-4 rounded-lg border-2 bg-gradient-to-r from-red-500/10 to-red-600/10 border-red-500/30">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                                    <p className="text-lg font-bold text-red-600 dark:text-red-400">
                                        Administrateur
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm text-gt-text font-semibold mb-2">Avantages :</p>
                                    <div className="flex items-start gap-2 text-sm text-gt-text">
                                        <span className="text-red-500">✓</span>
                                        <span>Création de <span className="font-semibold">channels illimités</span></span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-gt-text">
                                        <span className="text-red-500">✓</span>
                                        <span>Création de <span className="font-semibold">threads illimités</span></span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-gt-text">
                                        <span className="text-red-500">✓</span>
                                        <span>Gestion complète du forum</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-gt-text">
                                        <span className="text-red-500">✓</span>
                                        <span>Modération des contenus</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="p-3 bg-gt-surface/40 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-gt-text-muted">Messages postés</p>
                                    <p className="text-sm text-gt-text font-semibold flex items-center gap-1">
                                        <MessageCircle className="w-4 h-4" />
                                        {user.messageCount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gt-text-muted uppercase tracking-wider flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                Progression
                            </h4>

                            <div className="p-4 bg-gradient-to-r from-gt-primary/10 to-gt-primary-dark/10 rounded-lg border border-gt-primary/20">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-sm font-semibold text-gt-text">Tier Actuel</p>
                                        <p className="text-lg font-bold text-gt-primary">{user.tier.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gt-text-muted">Messages</p>
                                        <p className="text-lg font-bold text-gt-text flex items-center gap-1">
                                            <MessageCircle className="w-4 h-4" />
                                            {user.messageCount}
                                        </p>
                                    </div>
                                </div>

                                {nextTier && (
                                    <>
                                        {/* Progress Bar */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs font-semibold">
                                                <span className="text-gt-text">Progression</span>
                                                <span className="text-gt-primary">{Math.round(progress)}%</span>
                                            </div>
                                            <div className="relative h-6 bg-gt-surface/80 rounded-full overflow-hidden border-2 border-gt-border/30 shadow-inner">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-gt-primary via-gt-primary to-gt-primary-dark transition-all duration-500 shadow-lg"
                                                    style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/30" />
                                                </div>
                                                {/* Pourcentage dans la barre si > 15% */}
                                                {progress > 15 && (
                                                    <div className="absolute inset-0 flex items-center px-3">
                                                        <span className="text-xs font-bold text-white drop-shadow-lg">
                                                            {Math.round(progress)}%
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs pt-1">
                                            <span className="text-gt-text-muted">
                                                Prochain tier: <span className="font-semibold text-gt-primary">{nextTier.name}</span>
                                            </span>
                                            <span className="text-gt-text font-semibold">
                                                {nextTier.messageRequired - user.messageCount} restants
                                            </span>
                                        </div>
                                    </>
                                )}

                                {!nextTier && (
                                    <div className="text-center text-sm text-gt-primary font-semibold">
                                        🎉 Tier Maximum Atteint !
                                    </div>
                                )}
                            </div>

                            {/* Tier Benefits */}
                            <div className="p-3 bg-gt-surface/40 rounded-lg">
                                <p className="text-xs text-gt-text-muted mb-1">Avantages du tier actuel</p>
                                <p className="text-sm text-gt-text">
                                    🔓 <span className="font-semibold">{user.tier.threadUnlocked}</span> threads débloqués
                                </p>
                            </div>

                            {/* Moderator Badge */}
                            {user.role === 'MODERATEUR' && (
                                <div className="p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-500/30">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                            Privilège de Modération
                                        </p>
                                    </div>
                                    <p className="text-xs text-gt-text-muted">
                                        🛡️ Accès aux outils de modération du forum
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
