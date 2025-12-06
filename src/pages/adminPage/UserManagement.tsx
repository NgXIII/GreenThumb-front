import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Users, RefreshCw, Loader2, AlertCircle, UserX } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import useAdminUsers from "@/shared/hooks/useAdminUsers";
import UserTable from "./components/UserTable";
import Pagination from "./components/Pagination";
import type { UserFilter } from "@/shared/types/admin";
import { cn } from "@/shared/lib/utils";

const PAGE_SIZE = 10;

const filterOptions: { value: UserFilter; label: string }[] = [
    { value: "all", label: "Tous" },
    { value: "active", label: "Actifs" },
    { value: "deleted", label: "Supprimés" },
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
        filter,
        setFilter,
        setPage,
        refresh,
        handleToggleActivation,
        handleSoftDelete,
        handleHardDelete,
        handleRestore,
        actionLoading,
    } = useAdminUsers(0, PAGE_SIZE);

    // Sync URL params with filter
    useEffect(() => {
        const urlFilter = searchParams.get("filter") as UserFilter | null;
        if (urlFilter && ["all", "active", "deleted"].includes(urlFilter)) {
            setFilter(urlFilter);
        }
    }, [searchParams, setFilter]);

    const handleFilterChange = (newFilter: UserFilter) => {
        setFilter(newFilter);
        if (newFilter === "all") {
            searchParams.delete("filter");
        } else {
            searchParams.set("filter", newFilter);
        }
        setSearchParams(searchParams);
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

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {filterOptions.map((option) => (
                    <Button
                        key={option.value}
                        variant={filter === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFilterChange(option.value)}
                        className={cn(
                            filter === option.value
                                ? "bg-gt-primary hover:bg-gt-primary-hover text-gt-primary-foreground"
                                : "border-gt-border text-gt-text"
                        )}
                    >
                        {option.label}
                    </Button>
                ))}
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
                            {filter !== "all"
                                ? `Aucun utilisateur ${filter === "active" ? "actif" : "supprimé"} pour le moment.`
                                : "Il n'y a pas encore d'utilisateurs enregistrés."}
                        </p>
                        {filter !== "all" && (
                            <Button
                                variant="outline"
                                onClick={() => handleFilterChange("all")}
                                className="mt-4 border-gt-border"
                            >
                                Voir tous les utilisateurs
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
                        onRestore={handleRestore}
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