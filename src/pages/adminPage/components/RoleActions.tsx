import { Shield, ShieldCheck, ShieldOff, ShieldX, Loader2 } from "lucide-react";
import type { AdminUserDto } from "@/shared/types/admin";
import { Button } from "@/shared/components/ui/button";

interface RoleActionsProps {
    user: AdminUserDto;
    onGrantAdmin: (username: string) => Promise<void>;
    onRevokeAdmin: (username: string) => Promise<void>;
    onGrantModerator: (username: string) => Promise<void>;
    onRevokeModerator: (username: string) => Promise<void>;
    actionLoading: Record<string, boolean>;
}

export default function RoleActions({
    user,
    onGrantAdmin,
    onRevokeAdmin,
    onGrantModerator,
    onRevokeModerator,
    actionLoading,
}: RoleActionsProps) {
    const isLoading = actionLoading[user.username];
    const isSuperAdmin = user.role === "SUPER_ADMIN";
    const isAdmin = user.role === "ADMIN";
    const isModerator = user.role === "MODERATEUR";
    const isUser = user.role === "UTILISATEUR";

    if (isSuperAdmin) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-xs text-gt-text-muted italic flex items-center gap-1">
                    <ShieldX size={14} className="text-red-500" />
                    Super Admin - Non modifiable
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-2">
            {/* Admin role buttons */}
            {!isAdmin ? (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onGrantAdmin(user.username)}
                    disabled={isLoading}
                    className="gap-1 text-xs border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                    {isLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Shield size={14} />
                    )}
                    Accorder Admin
                </Button>
            ) : (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRevokeAdmin(user.username)}
                    disabled={isLoading}
                    className="gap-1 text-xs border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                    {isLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <ShieldOff size={14} />
                    )}
                    Retirer Admin
                </Button>
            )}

            {/* Moderator role buttons - only for non-admin users */}
            {!isAdmin && (
                <>
                    {!isModerator ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onGrantModerator(user.username)}
                            disabled={isLoading}
                            className="gap-1 text-xs border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                            {isLoading ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <ShieldCheck size={14} />
                            )}
                            Accorder Modérateur
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRevokeModerator(user.username)}
                            disabled={isLoading}
                            className="gap-1 text-xs border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                            {isLoading ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <ShieldOff size={14} />
                            )}
                            Retirer Modérateur
                        </Button>
                    )}
                </>
            )}

            {/* Show current status for regular users */}
            {isUser && !isLoading && (
                <span className="text-xs text-gt-text-muted italic self-center">
                    Utilisateur standard
                </span>
            )}
        </div>
    );
}
