import { useUserStore } from "@/app/stores/userStore";

export interface AdminRolePermissions {
  role: string | undefined;
  isModerator: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  canAccessModeration: boolean;
  canAccessUsers: boolean;
  canAccessCommunications: boolean;
  canAccessRoles: boolean;
  hasAnyAdminAccess: boolean;
}

/**
 * Hook pour vérifier les permissions admin basées sur le rôle de l'utilisateur
 *
 * @returns Objet contenant les permissions et les vérifications de rôle
 *
 * @example
 * ```tsx
 * const { canAccessUsers, isModerator } = useAdminRole();
 *
 * {canAccessUsers && (
 *   <Link to="/admin/users">Utilisateurs</Link>
 * )}
 * ```
 */
export const useAdminRole = (): AdminRolePermissions => {
  const { user } = useUserStore();

  const role = user?.role;

  const isModerator = role === 'MODERATEUR';
  const isAdmin = role === 'ADMIN';
  const isSuperAdmin = role === 'SUPER_ADMIN';

  // Permissions par fonctionnalité
  const canAccessModeration = isModerator || isAdmin || isSuperAdmin;
  const canAccessUsers = isAdmin || isSuperAdmin;
  const canAccessCommunications = isAdmin || isSuperAdmin;
  const canAccessRoles = isSuperAdmin;

  // Accès général au panel admin
  const hasAnyAdminAccess = isModerator || isAdmin || isSuperAdmin;

  return {
    role,
    isModerator,
    isAdmin,
    isSuperAdmin,
    canAccessModeration,
    canAccessUsers,
    canAccessCommunications,
    canAccessRoles,
    hasAnyAdminAccess,
  };
};