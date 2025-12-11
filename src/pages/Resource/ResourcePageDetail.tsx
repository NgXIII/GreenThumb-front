import {Navigate, useParams} from "react-router-dom";
import {useResource} from "@/shared/hooks/useResources.ts";
import resolveAvatar from "@/shared/utils/resolveAvatar.ts";

export default function ResourcePageDetail() {
    const { slug } = useParams();
    const { resource, error, loading } = useResource(slug ?? "");

    if (!slug) {
        return <Navigate to="/ressources" replace />;
    }


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-gray-600">Chargement...</div>
            </div>
        );
    }

    if (error || !resource) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-red-600">
                    {error || "Ressource introuvable"}
                </div>
            </div>
        );
    }

    const formattedDate = new Date(resource.creationDate).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <article className="max-w-4xl mx-auto px-4 py-8">
            <div className="w-full h-[400px] mb-8 rounded-lg overflow-hidden shadow-lg">
                <img
                    src={resolveAvatar(resource.pictureUrl)}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                />
            </div>

            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {resource.title}
                </h1>

                <div className="flex items-center gap-6 text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">{resource.username}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formattedDate}</span>
                    </div>
                </div>
            </header>

            <div className="bg-gray-50 border-l-4 border-green-500 p-6 mb-8 rounded-r-lg">
                <p className="text-lg text-gray-700 italic">
                    {resource.summary}
                </p>
            </div>

            <div className="prose prose-lg max-w-none">
                <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {resource.description}
                </div>
            </div>
        </article>
    );
}