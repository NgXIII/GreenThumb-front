import { Shield, RefreshCw, Loader2, AlertCircle, CheckCircle, XCircle, Flag, MessageSquare } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import useModeration from "@/shared/hooks/admin/useModeration";
import Pagination from "./components/Pagination";
import type { ModerationFilter, ModerationItem } from "@/shared/types/moderation";
import { cn } from "@/shared/lib/utils";

const PAGE_SIZE = 20;

const filterOptions: { value: ModerationFilter; label: string; icon: React.ReactNode }[] = [
    { value: "all", label: "Tous les messages", icon: <MessageSquare className="w-4 h-4" /> },
    { value: "ai_rejected", label: "IA invalidés", icon: <XCircle className="w-4 h-4" /> },
    { value: "pending_review", label: "En attente", icon: <AlertCircle className="w-4 h-4" /> },
];

interface ModerationCardProps {
    item: ModerationItem;
    onApprove: (messageId: number) => void;
    onReject: (messageId: number) => void;
    isLoading: boolean;
}

function ModerationCard({ item, onApprove, onReject, isLoading }: ModerationCardProps) {
    const handleApproveClick = () => {
        onApprove(item.messageId);
    };

    const handleRejectClick = () => {
        onReject(item.messageId);
    };

    return (
        <div className="bg-white dark:bg-gt-surface rounded-2xl border border-gray-200 dark:border-gt-border p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-gt-text">Message #{item.messageId}</h3>
                        <span className="px-2 py-1 bg-gt-primary/10 text-gt-primary text-xs rounded-lg font-medium">
                            Thread: {item.threadTitle}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gt-text-muted">
                        <span>Par: <span className="font-medium text-gt-text">{item.author}</span></span>
                        <span>{new Date(item.createdAt).toLocaleString('fr-FR')}</span>
                    </div>
                </div>
            </div>

            {/* Message Content */}
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gt-surface-elevated rounded-xl border border-gray-200 dark:border-gt-border">
                <p className="text-gt-text whitespace-pre-wrap">{item.text}</p>
            </div>

            {/* AI Moderation Result */}
            <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                        {item.aiModeration.valid === false ? (
                            <XCircle className="w-5 h-5 text-red-500" />
                        ) : (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gt-text mb-1 flex items-center gap-2">
                            Analyse IA
                            <span className={cn(
                                "px-2 py-0.5 text-xs rounded-lg font-medium",
                                item.aiModeration.valid === false
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            )}>
                                {item.aiModeration.valid === false ? "INVALIDE" : "VALIDE"}
                            </span>
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs rounded-lg font-medium">
                                {item.aiModeration.category}
                            </span>
                        </h4>
                        <p className="text-sm text-gt-text-muted">{item.aiModeration.reason}</p>
                    </div>
                </div>
            </div>

            {/* Reports */}
            {item.reports && item.reports.length > 0 && (
                <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                    <h4 className="font-semibold text-gt-text mb-2 flex items-center gap-2">
                        <Flag className="w-4 h-4 text-orange-500" />
                        Signalements ({item.reportCount})
                    </h4>
                    <ul className="space-y-1">
                        {item.reports.slice(0, 3).map((report) => (
                            <li key={report.reportId} className="text-sm text-gt-text-muted">
                                • <span className="font-medium text-gt-text">{report.reporter}</span>: "{report.reason}"
                            </li>
                        ))}
                        {item.reports.length > 3 && (
                            <li className="text-sm text-gt-text-muted italic">
                                ... et {item.reports.length - 3} autre(s) signalement(s)
                            </li>
                        )}
                    </ul>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
                <Button
                    onClick={handleApproveClick}
                    disabled={isLoading}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approuver IA
                        </>
                    )}
                </Button>
                <Button
                    onClick={handleRejectClick}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <>
                            <XCircle className="w-4 h-4 mr-2" />
                            Remettre en ligne
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

export default function ModerationPage() {
    const {
        items,
        totalPages,
        totalElements,
        currentPage,
        loading,
        error,
        filter,
        setFilter,
        setPage,
        refresh,
        handleApprove,
        handleReject,
        actionLoading
    } = useModeration('ai_rejected', 0, PAGE_SIZE);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gt-text mb-2 flex items-center gap-3">
                            <Shield className="w-10 h-10 text-gt-primary" />
                            Modération IA
                        </h1>
                        <p className="text-gt-text-muted">
                            Révisez les messages analysés par l'intelligence artificielle
                        </p>
                    </div>
                    <Button
                        onClick={refresh}
                        disabled={loading}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                        Actualiser
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                    {filterOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setFilter(option.value)}
                            className={cn(
                                "px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2",
                                filter === option.value
                                    ? "bg-gt-primary text-white shadow-lg shadow-gt-primary/30"
                                    : "bg-white dark:bg-gt-surface text-gt-text-muted hover:bg-gray-50 dark:hover:bg-gt-surface-elevated border border-gray-200 dark:border-gt-border"
                            )}
                        >
                            {option.icon}
                            {option.label}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                {!loading && (
                    <div className="mt-4 text-sm text-gt-text-muted">
                        {totalElements} message{totalElements > 1 ? 's' : ''} trouvé{totalElements > 1 ? 's' : ''}
                    </div>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 text-gt-primary animate-spin mb-4" />
                    <p className="text-gt-text-muted">Chargement des messages...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-red-900 dark:text-red-300 mb-1">Erreur</h3>
                        <p className="text-red-700 dark:text-red-400">{error}</p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gt-primary/10 blur-3xl rounded-full"></div>
                        <Shield className="relative w-20 h-20 text-gt-primary opacity-40" />
                    </div>
                    <h3 className="text-xl font-bold text-gt-text mb-2">Aucun message à modérer</h3>
                    <p className="text-sm text-gt-text-muted max-w-sm text-center">
                        Tous les messages ont été traités ou il n'y a pas de signalements en attente.
                    </p>
                </div>
            )}

            {/* Moderation Items */}
            {!loading && !error && items.length > 0 && (
                <>
                    <div className="space-y-4 mb-8">
                        {items.map((item) => (
                            <ModerationCard
                                key={item.messageId}
                                item={item}
                                onApprove={(messageId) => handleApprove(messageId, "Approuvé par modérateur")}
                                onReject={(messageId) => handleReject(messageId, "Faux positif - Message acceptable")}
                                isLoading={actionLoading === item.messageId}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalElements={totalElements}
                            onPageChange={setPage}
                        />
                    )}
                </>
            )}
        </div>
    );
}
