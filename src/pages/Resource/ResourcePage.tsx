import {useResources} from "@/shared/hooks/resource/useResources.ts";
import type {Resource} from "@/shared/types/resource.ts";
import {formatDateFr} from "@/shared/utils/date.ts";
import resolveAvatar from "@/shared/utils/resolveAvatar.ts";
import {useState, useEffect, type MouseEvent} from "react";
import {useNavigate, Link} from "react-router-dom";
import {useLikeResource} from "@/shared/hooks/useLike.ts";
import {useUserStore} from "@/app/stores/userStore.ts";

export default function ResourcePage() {
    const { resources, error, loading } = useResources();
    const { user } = useUserStore.getState();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gt-surface transition-colors duration-300 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <header
                    className="bg-gt-surface-elevated rounded-lg p-6 border border-gt-border opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
                    style={{ animationDelay: '0.1s' }}
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-bold text-gt-text mb-2">
                                Bibliothèque de ressources
                            </h1>
                            <p className="text-gt-text-muted">
                                Découvrez tous nos guides, tutoriels et conseils pour devenir un expert en jardinage
                            </p>
                        </div>
                        {user?.role === 'ADMIN' && (
                            <Link
                                to="/ressources/ajouter"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gt-primary hover:bg-gt-primary/90 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 shrink-0"
                            >
                                <span className="text-xl">+</span>
                                <span>Ajouter un article</span>
                            </Link>
                        )}
                    </div>
                </header>

                <section>
                    {loading && (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gt-primary"></div>
                            <p className="text-gt-text-muted mt-4">Chargement des ressources...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-20 bg-gt-surface-elevated rounded-lg border border-gt-border p-8">
                            <p className="text-red-500 text-lg">Erreur : {error}</p>
                        </div>
                    )}

                    {!loading && !error && resources && (
                        <ResourceGrid resources={resources} />
                    )}

                    {!loading && !error && (!resources || resources.length === 0) && (
                        <div className="text-center py-20 bg-gt-surface-elevated rounded-lg border border-gt-border">
                            <p className="text-gt-text-muted text-lg">Aucune ressource disponible pour le moment</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

function ResourceGrid({ resources }: { resources: Resource[] }) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-wrap justify-center gap-6">
            {resources.map((resource, index) => (
                <article
                    key={resource.slug}
                    className="opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards] w-full md:w-[calc(50%-12px)] xl:w-[calc(33.333%-16px)]"
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                    <ResourceCard
                        {...resource}
                        onClick={() => navigate("/ressources/" + resource.slug)}
                    />
                </article>
            ))}
        </div>
    );
}

function ResourceCard({ slug, title, summary, pictureUrl, like, creationDate, username, onClick }: Omit<Resource, 'description'> & { onClick: () => void }) {
    const [currentLikes, setCurrentLikes] = useState(like);

    const handleLikeUpdate = (newCount: number) => {
        setCurrentLikes(newCount);
    };

    return (
        <article
            className="group bg-gt-surface-elevated rounded-lg border border-gt-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full cursor-pointer"
            onClick={onClick}
        >
            <figure className="relative w-full h-52 bg-gradient-to-br from-gt-primary/10 to-gt-primary/5 overflow-hidden shrink-0">
                {pictureUrl ? (
                    <>
                        <img
                            src={resolveAvatar(pictureUrl)}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-7xl opacity-20">🌿</span>
                    </div>
                )}

                <figcaption className="absolute top-3 left-3 bg-white/20 dark:bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 dark:border-white/20">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-white drop-shadow-md">
                        <span className="text-sm" aria-hidden="true">👤</span>
                        {username}
                    </span>
                </figcaption>
            </figure>

            <div className="flex flex-col flex-1 p-5">
                <h3 className="text-xl font-bold text-gt-text mb-2 line-clamp-2 min-h-[3.5rem]">
                    {title}
                </h3>

                <p className="text-sm text-gt-text-muted line-clamp-3 mb-4 min-h-[4rem]">
                    {summary}
                </p>

                <footer
                    className="mt-auto pt-4 border-t border-gt-border"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between">
                        <time className="text-xs text-gt-text-muted" dateTime={creationDate}>
                            {formatDateFr(creationDate)}
                        </time>
                        <GrowthMeter
                            likes={currentLikes}
                            slug={slug}
                            onLikeUpdate={handleLikeUpdate}
                        />
                    </div>
                </footer>
            </div>
        </article>
    );
}

function GrowthMeter({ likes, slug, onLikeUpdate }: {
    likes: number;
    slug: string;
    onLikeUpdate?: (newCount: number, isLiked: boolean) => void
}) {
    const [isHovered, setIsHovered] = useState(false);
    const { toggleLike, loading } = useLikeResource();

    const handleLike = async (e: MouseEvent) => {
        e.stopPropagation();
        const result = await toggleLike(slug);
        if (result && onLikeUpdate) {
            onLikeUpdate(result.likedCount, result.isLiked);
        }
    }

    const getGrowthStage = (count: number) => {
        if (count === 0) return { icon: "🌰", label: "Aucune graine", color: "text-gray-400", bg: "bg-gray-100 dark:bg-gray-800" };
        if (count <= 10) return { icon: "🌱", label: "Graine", color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" };
        if (count <= 50) return { icon: "🌿", label: "Pousse", color: "text-green-500", bg: "bg-green-100 dark:bg-green-800/30" };
        if (count <= 100) return { icon: "🪴", label: "Plante", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-800/30" };
        if (count <= 500) return { icon: "🌳", label: "Arbre", color: "text-teal-600", bg: "bg-teal-100 dark:bg-teal-800/30" };
        return { icon: "🌲", label: "Forêt", color: "text-green-700", bg: "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30" };
    };

    const stage = getGrowthStage(likes);

    return (
        <button
            onClick={handleLike}
            disabled={loading}
            className="relative inline-flex items-center gap-2 group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${stage.bg} border border-gt-border transition-all duration-300 ${isHovered ? 'scale-110 shadow-md' : ''}`}>
                <span className="text-lg animate-bounce-slow">{stage.icon}</span>
                <span className={`font-bold text-sm ${stage.color}`}>{likes}</span>
            </div>

            {isHovered && (
                <div className="absolute bottom-full mb-2 right-0 bg-gt-surface-elevated border border-gt-border rounded-lg px-3 py-2 shadow-lg whitespace-nowrap z-10 animate-fade-in">
                    <div className="text-xs font-medium text-gt-text">{stage.label}</div>
                    <div className="text-[10px] text-gt-text-muted">{likes} {likes > 1 ? 'graines plantées' : 'graine plantée'}</div>
                </div>
            )}
        </button>
    );
}