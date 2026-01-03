import { useState } from "react";
import { Power, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import ConfirmationModal from "./ConfirmationModal";
import { cn } from "@/shared/lib/utils";
import type { AdminUserDto } from "@/shared/types/admin";
import { useUserStore } from "@/app/stores/userStore";

interface UserActionsProps {
    user: AdminUserDto;
    onToggleActivation: (username: string, currentEnabled: boolean) => Promise<void>;
    onSoftDelete: (username: string) => Promise<void>;
    onHardDelete: (username: string) => Promise<void>;
    actionLoading: string | null;
}

type ModalType = "toggle" | "softDelete" | "hardDelete" | null;

export default function UserActions({
    user,
    onToggleActivation,
    onSoftDelete,
    onHardDelete,
    actionLoading,
}: UserActionsProps) {
    const [modalOpen, setModalOpen] = useState<ModalType>(null);
    const currentUser = useUserStore((state) => state.user);

    const isCurrentUser = currentUser?.username === user.username;
    const isAdmin = user.role === "ADMIN";
    const isLoading = actionLoading === user.username;
    const canModify = !isCurrentUser && !isAdmin;

    const handleConfirm = async () => {
        switch (modalOpen) {
            case "toggle":
                await onToggleActivation(user.username, user.enabled);
                break;
            case "softDelete":
                await onSoftDelete(user.username);
                break;
            case "hardDelete":
                await onHardDelete(user.username);
                break;
        }
        setModalOpen(null);
    };

    const getModalConfig = (): {
        title: string;
        description: string;
        confirmLabel: string;
        variant: "default" | "destructive";
    } => {
        switch (modalOpen) {
            case "toggle":
                return {
                    title: user.enabled ? "Désactiver l'utilisateur" : "Activer l'utilisateur",
                    description: user.enabled
                        ? `Êtes-vous sûr de vouloir désactiver le compte de "${user.username}" ? L'utilisateur ne pourra plus se connecter.`
                        : `Êtes-vous sûr de vouloir activer le compte de "${user.username}" ?`,
                    confirmLabel: user.enabled ? "Désactiver" : "Activer",
                    variant: user.enabled ? "destructive" : "default",
                };
            case "softDelete":
                return {
                    title: "Désactivation Définitive",
                    description: `ATTENTION : Cette action est IRRÉVERSIBLE et définitive.

Conséquences :
• Données personnelles anonymisées à jamais
• Impossible de se reconnecter
• Contributions préservées mais anonymes
• Aucune restauration possible

Êtes-vous absolument certain de vouloir désactiver définitivement le compte de "${user.username}" ?`,
                    confirmLabel: "Désactiver définitivement",
                    variant: "destructive",
                };
            case "hardDelete":
                return {
                    title: "Suppression définitive",
                    description: `ATTENTION : Cette action est IRRÉVERSIBLE. Toutes les données de "${user.username}" seront définitivement supprimées. Êtes-vous absolument certain ?`,
                    confirmLabel: "Supprimer définitivement",
                    variant: "destructive",
                };
            default:
                return {
                    title: "",
                    description: "",
                    confirmLabel: "",
                    variant: "default",
                };
        }
    };

    const modalConfig = getModalConfig();

    // Disabled tooltip message
    const getDisabledReason = () => {
        if (isCurrentUser) return "Vous ne pouvez pas vous modifier vous-même";
        if (isAdmin) return "Vous ne pouvez pas modifier un administrateur";
        return "";
    };

    if (!canModify) {
        return (
            <div className="flex items-center gap-2 text-gt-text-muted text-sm">
                <AlertTriangle size={16} />
                <span className="hidden sm:inline">{getDisabledReason()}</span>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                {/* Toggle activation button */}
                {!user.deleted && (
                    <Button
                        variant={user.enabled ? "outline" : "default"}
                        size="sm"
                        onClick={() => setModalOpen("toggle")}
                        disabled={isLoading}
                        className={cn(
                            "gap-1",
                            user.enabled
                                ? "border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-950"
                                : "bg-gt-primary hover:bg-gt-primary-hover"
                        )}
                        title={user.enabled ? "Désactiver" : "Activer"}
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Power size={16} />
                        )}
                        <span className="hidden sm:inline">
                            {user.enabled ? "Désactiver" : "Activer"}
                        </span>
                    </Button>
                )}

                {/* Soft delete button - only for non-deleted users */}
                {!user.deleted && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setModalOpen("softDelete")}
                        disabled={isLoading}
                        className="gap-1 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
                        title="Supprimer"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 size={16} />
                        )}
                        <span className="hidden sm:inline">Supprimer</span>
                    </Button>
                )}

                {/* Hard delete button - only for deleted users */}
                {user.deleted && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setModalOpen("hardDelete")}
                        disabled={isLoading}
                        className="gap-1 bg-red-600 hover:bg-red-700"
                        title="Supprimer définitivement"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 size={16} />
                        )}
                        <span className="hidden sm:inline">Définitif</span>
                    </Button>
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                open={modalOpen !== null}
                onOpenChange={(open) => !open && setModalOpen(null)}
                title={modalConfig.title}
                description={modalConfig.description}
                confirmLabel={modalConfig.confirmLabel}
                variant={modalConfig.variant}
                onConfirm={handleConfirm}
                loading={isLoading}
            />
        </>
    );
}