import { useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Users, RefreshCw, Loader2, AlertCircle, UserX, Search, X, Filter } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import useAdminUsers from "@/shared/hooks/useAdminUsers";
import UserTable from "./components/UserTable";
import Pagination from "./components/Pagination";
import type { UserStatusFilter, UserEnabledFilter, UserRoleFilter } from "@/shared/types/admin";
import { cn } from "@/shared/lib/utils";
import { useDebouncedCallback } from "use-debounce";

const PAGE_SIZE = 10;

const statusOptions: { value: UserStatusFilter; label: string }[] = [
    { value: "all", label: "Tous" },
    { value: "active", label: "Actifs" },
    { value: "deleted", label: "Supprimés" },
];

const enabledOptions: { value: UserEnabledFilter; label: string }[] = [
    { value: "all", label: "Tous" },
    { value: "true", label: "Activés" },
    { value: "false", label: "Non activés" },
];

const roleOptions: { value: UserRoleFilter; label: string }[] = [
    { value: "all", label: "Tous" },
    { value: "ADMIN", label: "Admins" },
    { value: "MODERATEUR", label: "Modérateurs" },
    { value: "UTILISATEUR", label: "Utilisateurs" },
];

export default function UserManagement() {
    const [searchParams, setSearchParams] = useSearchParams();

    const {
        users,
        totalPages,
        totalElements,
        currentPage,
        loading,
        error,
        filters,
        setStatusFilter,
        setEnabledFilter,
        setRoleFilter,
        setSearchQuery,
        setPage,
        refresh,
        handleToggleActivation,
        handleSoftDelete,
        handleHardDelete,
        actionLoading,
    } = useAdminUsers(0, PAGE_SIZE);

    const debouncedSetSearchQuery = useDebouncedCallback((value: string) => {
        setSearchQuery(value);
    }, 300);

    useEffect(() => {
        const urlStatus = searchParams.get("status") as UserStatusFilter | null;
        const urlEnabled = searchParams.get("enabled") as UserEnabledFilter | null;
        const urlRole = searchParams.get("role") as UserRoleFilter | null;
        const urlQuery = searchParams.get("q");

        if (urlStatus && ["all", "active", "deleted"].includes(urlStatus)) {
            setStatusFilter(urlStatus);
        }
        if (urlEnabled && ["all", "true", "false"].includes(urlEnabled)) {
            setEnabledFilter(urlEnabled);
        }
        if (urlRole && ["all", "ADMIN", "MODERATEUR", "UTILISATEUR"].includes(urlRole)) {
            setRoleFilter(urlRole);
        }
        if (urlQuery) {
            setSearchQuery(urlQuery);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update URL when filters change
    const updateUrlParams = useCallback((key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value === "all" || value === "") {
            newParams.delete(key);
        } else {
            newParams.set(key, value);
        }
        setSearchParams(newParams);
    }, [searchParams, setSearchParams]);

    const handleStatusChange = (newStatus: UserStatusFilter) => {
        setStatusFilter(newStatus);
        updateUrlParams("status", newStatus);
    };

    const handleEnabledChange = (newEnabled: UserEnabledFilter) => {
        setEnabledFilter(newEnabled);
        updateUrlParams("enabled", newEnabled);
    };

    const handleRoleChange = (newRole: UserRoleFilter) => {
        setRoleFilter(newRole);
        updateUrlParams("role", newRole);
    };

    const handleSearchChange = (value: string) => {
        debouncedSetSearchQuery(value);
        updateUrlParams("q", value);
    };

    const clearSearch = () => {
        setSearchQuery("");
        updateUrlParams("q", "");
    };

    const hasActiveFilters = filters.status !== "all" || filters.enabled !== "all" || filters.role !== "all" || filters.searchQuery !== "";

    const clearAllFilters = () => {
        setStatusFilter("all");
        setEnabledFilter("all");
        setRoleFilter("all");
        setSearchQuery("");
        setSearchParams(new URLSearchParams());
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gt-text flex items-center gap-3">
                        <Users className="text-gt-primary" />
                        Gestion des utilisateurs
                    </h1>
                    <p className="text-gt-text-muted mt-1">
                        Gérez les comptes utilisateurs de la plateforme
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={refresh}
                    disabled={loading}
                    className="gap-2 border-gt-border self-start sm:self-auto"
                >
                    {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <RefreshCw size={16} />
                    )}
                    Actualiser
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gt-text-muted"
                />
                <input
                    type="text"
                    placeholder="Rechercher par nom, email, prénom, nom..."
                    defaultValue={filters.searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 rounded-lg border border-gt-border bg-gt-surface text-gt-text placeholder:text-gt-text-muted focus:outline-none focus:ring-2 focus:ring-gt-primary focus:border-transparent transition-all"
                />
                {filters.searchQuery && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gt-text-muted hover:text-gt-text transition-colors"
                        aria-label="Effacer la recherche"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="flex items-center gap-2 text-gt-text-muted">
                    <Filter size={18} />
                    <span className="text-sm font-medium">Filtres :</span>
                </div>

                <div className="flex flex-wrap gap-4">
                    {/* Status filter */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gt-text-muted">Statut</label>
                        <div className="flex gap-1">
                            {statusOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    variant={filters.status === option.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleStatusChange(option.value)}
                                    className={cn(
                                        "text-xs px-2 py-1 h-7",
                                        filters.status === option.value
                                            ? "bg-gt-primary hover:bg-gt-primary-hover text-gt-primary-foreground"
                                            : "border-gt-border text-gt-text"
                                    )}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Enabled filter */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gt-text-muted">Activation</label>
                        <div className="flex gap-1">
                            {enabledOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    variant={filters.enabled === option.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleEnabledChange(option.value)}
                                    className={cn(
                                        "text-xs px-2 py-1 h-7",
                                        filters.enabled === option.value
                                            ? "bg-gt-primary hover:bg-gt-primary-hover text-gt-primary-foreground"
                                            : "border-gt-border text-gt-text"
                                    )}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Role filter */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gt-text-muted">Rôle</label>
                        <div className="flex gap-1">
                            {roleOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    variant={filters.role === option.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleRoleChange(option.value)}
                                    className={cn(
                                        "text-xs px-2 py-1 h-7",
                                        filters.role === option.value
                                            ? "bg-gt-primary hover:bg-gt-primary-hover text-gt-primary-foreground"
                                            : "border-gt-border text-gt-text"
                                    )}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Clear all filters button */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-gt-text-muted hover:text-gt-text gap-1 h-7"
                    >
                        <X size={14} />
                        Réinitialiser
                    </Button>
                )}
            </div>

            {/* Content */}
            <div className="bg-gt-surface-elevated rounded-xl border border-gt-border overflow-hidden">
                {/* Error state */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <AlertCircle size={48} className="text-red-500 mb-4" />
                        <h3 className="text-lg font-semibold text-gt-text mb-2">
                            Erreur de chargement
                        </h3>
                        <p className="text-gt-text-muted mb-4">{error}</p>
                        <Button onClick={refresh} variant="outline" className="gap-2 border-gt-border">
                            <RefreshCw size={16} />
                            Réessayer
                        </Button>
                    </div>
                )}

                {/* Loading state */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 size={48} className="text-gt-primary animate-spin mb-4" />
                        <p className="text-gt-text-muted">Chargement des utilisateurs...</p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && users.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <UserX size={48} className="text-gt-text-muted mb-4" />
                        <h3 className="text-lg font-semibold text-gt-text mb-2">
                            Aucun utilisateur trouvé
                        </h3>
                        <p className="text-gt-text-muted">
                            {filters.searchQuery
                                ? `Aucun résultat pour "${filters.searchQuery}"`
                                : hasActiveFilters
                                ? "Aucun utilisateur ne correspond aux filtres sélectionnés."
                                : "Il n'y a pas encore d'utilisateurs enregistrés."}
                        </p>
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                onClick={clearAllFilters}
                                className="border-gt-border mt-4"
                            >
                                Réinitialiser les filtres
                            </Button>
                        )}
                    </div>
                )}

                {/* User table */}
                {!loading && !error && users.length > 0 && (
                    <UserTable
                        users={users}
                        onToggleActivation={handleToggleActivation}
                        onSoftDelete={handleSoftDelete}
                        onHardDelete={handleHardDelete}
                        actionLoading={actionLoading}
                    />
                )}
            </div>

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
}