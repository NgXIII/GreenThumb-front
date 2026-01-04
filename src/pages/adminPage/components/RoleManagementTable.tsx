import { Shield, User, Mail, ShieldCheck, ShieldX, UserCog } from "lucide-react";
import type { AdminUserDto } from "@/shared/types/admin";
import RoleActions from "./RoleActions";
import { cn } from "@/shared/lib/utils";
import resolveAvatar from "@/shared/utils/resolveAvatar";

interface RoleManagementTableProps {
    users: AdminUserDto[];
    onGrantAdmin: (username: string) => Promise<void>;
    onRevokeAdmin: (username: string) => Promise<void>;
    onGrantModerator: (username: string) => Promise<void>;
    onRevokeModerator: (username: string) => Promise<void>;
    actionLoading: Record<string, boolean>;
}

function UserRoleBadge({ role }: { role: string }) {
    const roleConfig = {
        ADMIN: {
            icon: Shield,
            color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        },
        MODERATEUR: {
            icon: ShieldCheck,
            color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        },
        UTILISATEUR: {
            icon: UserCog,
            color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
        },
        SUPER_ADMIN: {
            icon: ShieldX,
            color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.UTILISATEUR;
    const Icon = config.icon;

    return (
        <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", config.color)}>
            <Icon size={12} />
            {role}
        </span>
    );
}

// Desktop Table Row
function TableRow({
    user,
    onGrantAdmin,
    onRevokeAdmin,
    onGrantModerator,
    onRevokeModerator,
    actionLoading,
}: {
    user: AdminUserDto;
    onGrantAdmin: (username: string) => Promise<void>;
    onRevokeAdmin: (username: string) => Promise<void>;
    onGrantModerator: (username: string) => Promise<void>;
    onRevokeModerator: (username: string) => Promise<void>;
    actionLoading: Record<string, boolean>;
}) {
    return (
        <tr className="border-b border-gt-border hover:bg-gt-surface-hover transition-colors">
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gt-primary flex items-center justify-center flex-shrink-0">
                        {user.avatar ? (
                            <img
                                src={resolveAvatar(user.avatar)}
                                alt={user.username}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <User size={20} className="text-gt-primary-foreground" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-gt-text truncate">{user.username}</p>
                        <p className="text-sm text-gt-text-muted truncate">
                            {user.firstname} {user.lastname}
                        </p>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3">
                <span className="text-sm text-gt-text truncate block max-w-[200px]">
                    {user.email}
                </span>
            </td>
            <td className="px-4 py-3">
                <UserRoleBadge role={user.role} />
            </td>
            <td className="px-4 py-3">
                <RoleActions
                    user={user}
                    onGrantAdmin={onGrantAdmin}
                    onRevokeAdmin={onRevokeAdmin}
                    onGrantModerator={onGrantModerator}
                    onRevokeModerator={onRevokeModerator}
                    actionLoading={actionLoading}
                />
            </td>
        </tr>
    );
}

// Mobile Card
function UserCard({
    user,
    onGrantAdmin,
    onRevokeAdmin,
    onGrantModerator,
    onRevokeModerator,
    actionLoading,
}: {
    user: AdminUserDto;
    onGrantAdmin: (username: string) => Promise<void>;
    onRevokeAdmin: (username: string) => Promise<void>;
    onGrantModerator: (username: string) => Promise<void>;
    onRevokeModerator: (username: string) => Promise<void>;
    actionLoading: Record<string, boolean>;
}) {
    return (
        <div className="bg-gt-surface-elevated rounded-lg border border-gt-border p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gt-primary flex items-center justify-center flex-shrink-0">
                        {user.avatar ? (
                            <img
                                src={resolveAvatar(user.avatar)}
                                alt={user.username}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <User size={24} className="text-gt-primary-foreground" />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gt-text truncate">{user.username}</p>
                        <p className="text-sm text-gt-text-muted truncate">
                            {user.firstname} {user.lastname}
                        </p>
                    </div>
                </div>
                <UserRoleBadge role={user.role} />
            </div>

            {/* Details */}
            <div className="text-sm">
                <div className="flex items-center gap-2 text-gt-text-muted">
                    <Mail size={14} />
                    <span className="truncate">{user.email}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-gt-border">
                <RoleActions
                    user={user}
                    onGrantAdmin={onGrantAdmin}
                    onRevokeAdmin={onRevokeAdmin}
                    onGrantModerator={onGrantModerator}
                    onRevokeModerator={onRevokeModerator}
                    actionLoading={actionLoading}
                />
            </div>
        </div>
    );
}

export default function RoleManagementTable({
    users,
    onGrantAdmin,
    onRevokeAdmin,
    onGrantModerator,
    onRevokeModerator,
    actionLoading,
}: RoleManagementTableProps) {
    return (
        <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gt-surface border-b border-gt-border">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gt-text">
                                Utilisateur
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gt-text">
                                Email
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gt-text">
                                Rôle actuel
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gt-text">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-gt-surface-elevated">
                        {users.map((user) => (
                            <TableRow
                                key={user.username}
                                user={user}
                                onGrantAdmin={onGrantAdmin}
                                onRevokeAdmin={onRevokeAdmin}
                                onGrantModerator={onGrantModerator}
                                onRevokeModerator={onRevokeModerator}
                                actionLoading={actionLoading}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3 p-3">
                {users.map((user) => (
                    <UserCard
                        key={user.username}
                        user={user}
                        onGrantAdmin={onGrantAdmin}
                        onRevokeAdmin={onRevokeAdmin}
                        onGrantModerator={onGrantModerator}
                        onRevokeModerator={onRevokeModerator}
                        actionLoading={actionLoading}
                    />
                ))}
            </div>
        </>
    );
}
