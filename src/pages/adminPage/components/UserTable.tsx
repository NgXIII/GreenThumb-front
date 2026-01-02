import { Shield, User, Mail, CheckCircle, XCircle, Trash2 } from "lucide-react";
import type { AdminUserDto } from "@/shared/types/admin";
import UserActions from "./UserActions";
import { cn } from "@/shared/lib/utils";

interface UserTableProps {
    users: AdminUserDto[];
    onToggleActivation: (username: string, currentEnabled: boolean) => Promise<void>;
    onSoftDelete: (username: string) => Promise<void>;
    onHardDelete: (username: string) => Promise<void>;
    onRestore: (username: string) => Promise<void>;
    actionLoading: string | null;
}

function UserStatusBadge({ user }: { user: AdminUserDto }) {
    if (user.deleted) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                <Trash2 size={12} />
                Supprimé
            </span>
        );
    }
    if (!user.enabled) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                <XCircle size={12} />
                Désactivé
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle size={12} />
            Actif
        </span>
    );
}

function UserRoleBadge({ role }: { role: string }) {
    const isAdmin = role === "ADMIN";
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                isAdmin
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
            )}
        >
            {isAdmin && <Shield size={12} />}
            {role}
        </span>
    );
}

// Desktop Table Row
function TableRow({
    user,
    onToggleActivation,
    onSoftDelete,
    onHardDelete,
    onRestore,
    actionLoading,
}: {
    user: AdminUserDto;
    onToggleActivation: (username: string, currentEnabled: boolean) => Promise<void>;
    onSoftDelete: (username: string) => Promise<void>;
    onHardDelete: (username: string) => Promise<void>;
    onRestore: (username: string) => Promise<void>;
    actionLoading: string | null;
}) {
    return (
        <tr className="border-b border-gt-border hover:bg-gt-surface-hover transition-colors">
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gt-primary flex items-center justify-center flex-shrink-0">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
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
                <UserStatusBadge user={user} />
            </td>
            <td className="px-4 py-3">
                <UserActions
                    user={user}
                    onToggleActivation={onToggleActivation}
                    onSoftDelete={onSoftDelete}
                    onHardDelete={onHardDelete}
                    onRestore={onRestore}
                    actionLoading={actionLoading}
                />
            </td>
        </tr>
    );
}

// Mobile Card
function UserCard({
    user,
    onToggleActivation,
    onSoftDelete,
    onHardDelete,
    onRestore,
    actionLoading,
}: {
    user: AdminUserDto;
    onToggleActivation: (username: string, currentEnabled: boolean) => Promise<void>;
    onSoftDelete: (username: string) => Promise<void>;
    onHardDelete: (username: string) => Promise<void>;
    onRestore: (username: string) => Promise<void>;
    actionLoading: string | null;
}) {
    return (
        <div className="bg-gt-surface-elevated rounded-lg border border-gt-border p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gt-primary flex items-center justify-center flex-shrink-0">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.username}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <User size={24} className="text-gt-primary-foreground" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-gt-text truncate">{user.username}</p>
                        <p className="text-sm text-gt-text-muted truncate">
                            {user.firstname} {user.lastname}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <UserRoleBadge role={user.role} />
                    <UserStatusBadge user={user} />
                </div>
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
                <UserActions
                    user={user}
                    onToggleActivation={onToggleActivation}
                    onSoftDelete={onSoftDelete}
                    onHardDelete={onHardDelete}
                    onRestore={onRestore}
                    actionLoading={actionLoading}
                />
            </div>
        </div>
    );
}

export default function UserTable({
    users,
    onToggleActivation,
    onSoftDelete,
    onHardDelete,
    onRestore,
    actionLoading,
}: UserTableProps) {
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
                                Rôle
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gt-text">
                                Statut
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
                                onToggleActivation={onToggleActivation}
                                onSoftDelete={onSoftDelete}
                                onHardDelete={onHardDelete}
                                onRestore={onRestore}
                                actionLoading={actionLoading}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
                {users.map((user) => (
                    <UserCard
                        key={user.username}
                        user={user}
                        onToggleActivation={onToggleActivation}
                        onSoftDelete={onSoftDelete}
                        onHardDelete={onHardDelete}
                        onRestore={onRestore}
                        actionLoading={actionLoading}
                    />
                ))}
            </div>
        </>
    );
}