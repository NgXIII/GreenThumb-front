import {Navigate, useParams, useNavigate} from "react-router-dom";
import {useResource} from "@/shared/hooks/resource/useResources.ts";
import useDeleteResource from "@/shared/hooks/resource/useDeleteResource.ts";
import resolveAvatar from "@/shared/utils/resolveAvatar.ts";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import {useState} from "react";
import {toast} from "sonner";

export default function ResourcePageDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { resource, error, loading } = useResource(slug ?? "");
    const { mutate: deleteResourceMutation, loading: deleting, error: deleteError } = useDeleteResource();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    if (!slug) {
        return <Navigate to="/ressources" replace />;
    }


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gt-surface">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gt-primary"></div>
                    <p className="text-gt-text-muted mt-4">Chargement de la ressource...</p>
                </div>
            </div>
        );
    }

    if (error || !resource) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gt-surface">
                <div className="bg-gt-surface-elevated rounded-lg border border-gt-border p-8">
                    <p className="text-red-500 text-lg">
                        {error || "Ressource introuvable"}
                    </p>
                </div>
            </div>
        );
    }

    const formattedDate = new Date(resource.creationDate).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleEdit = () => {
        navigate(`/ressources/${slug}/modifier`);
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!slug) return;

        try {
            await deleteResourceMutation(slug);
            toast.success("Ressource supprimée", {
                description: "La ressource a été supprimée avec succès"
            });
            setShowDeleteModal(false);
            navigate("/ressources");
        } catch (err) {
            toast.error("Erreur lors de la suppression", {
                description: deleteError || "Une erreur est survenue lors de la suppression de la ressource"
            });
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    return (
        <div className="min-h-screen bg-gt-surface transition-colors duration-300 p-6">
            <article className="max-w-4xl mx-auto">
                <div className="w-full h-[400px] mb-6 rounded-lg overflow-hidden border border-gt-border shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-gt-primary/10 to-gt-primary/5">
                    <img
                        src={resolveAvatar(resource.pictureUrl)}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="bg-gt-surface-elevated rounded-lg border border-gt-border p-8 mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold text-gt-text mb-6">
                            {resource.title}
                        </h1>

                        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="flex items-center gap-2 bg-gt-primary/10 px-4 py-2 rounded-full border border-gt-border shadow-sm">
                                    <span className="text-lg" aria-hidden="true">👤</span>
                                    <span className="font-medium text-gt-text text-sm">{resource.username}</span>
                                </div>

                                <div className="flex items-center gap-2 bg-gt-primary/10 px-4 py-2 rounded-full border border-gt-border shadow-sm">
                                    <span className="text-lg" aria-hidden="true">📅</span>
                                    <span className="text-gt-text text-sm">{formattedDate}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gt-primary text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:bg-gt-primary/90 transition-all duration-200 border border-gt-primary/20"
                                >
                                    <span>Modifier</span>
                                </button>

                                <button
                                    onClick={handleDeleteClick}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:bg-red-600 transition-all duration-200 border border-red-500/20"
                                >
                                    <span>Supprimer</span>
                                </button>
                            </div>
                        </div>
                    </header>

                    <div className="bg-gt-primary/5 border-l-4 border-gt-primary p-6 mb-8 rounded-r-lg shadow-sm">
                        <p className="text-lg text-gt-text italic">
                            {resource.summary}
                        </p>
                    </div>

                    <div className="markdown-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {resource.description}
                        </ReactMarkdown>
                    </div>
                </div>
            </article>

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={handleDeleteCancel}
                    ></div>

                    <div className="relative bg-gt-surface-elevated rounded-xl border border-gt-border shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gt-text mb-2">
                                    Confirmer la suppression
                                </h3>
                                <p className="text-gt-text/70">
                                    Êtes-vous sûr de vouloir supprimer la ressource <strong className="text-gt-text">"{resource.title}"</strong> ? Cette action est irréversible.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={handleDeleteCancel}
                                disabled={deleting}
                                className="px-5 py-2.5 bg-gt-surface text-gt-text font-medium rounded-lg border border-gt-border hover:bg-gt-surface-elevated transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deleting}
                                className="px-5 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg border border-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {deleting && (
                                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                )}
                                <span>{deleting ? "Suppression..." : "Supprimer"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
