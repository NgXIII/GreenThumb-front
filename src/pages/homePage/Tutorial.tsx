import useThreeResources from "../../shared/hooks/useThreeResources.ts";
import type {HomeResource} from "@/shared/types/homeResource.ts";
import CardBase from "./CardBase.tsx";
import {formatDateFr} from "@/shared/utils/date.ts";

export default function TutorialSession() {
    const { messages, error, loading } = useThreeResources();

    return (
        <section className="w-full bg-gt-surface-elevated py-12 px-4 sm:px-6 md:px-10 text-center transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gt-text mb-2">
                    Guides et tutoriels experts
                </h2>

                <p className="text-gt-text-muted text-sm sm:text-base mb-10">
                    Apprenez de nouvelles techniques avec nos ressources détaillées
                </p>
                {loading && <p className="text-gt-text-muted">Chargement...</p>}
                {error && <p className="text-red-500">Erreur : {error}</p>}
                {!loading && !error && <TutorialCards data={messages} />}
            </div>
        </section>
    );
}

function TutorialCards({ data }: { data: HomeResource[]}) {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {data.map((item, index) => (
                <TutorialCard key={index} {...item} />
            ))}
        </section>
    );
}

function TutorialCard({title, date, imageUrl }: HomeResource) {

    return (
        <CardBase>
            {/* Image */}
            <div className="relative w-full h-44 sm:h-48 bg-gt-surface flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-4xl">🌞</span>
                )}
            </div>

            <div className="flex flex-col flex-1 justify-between p-5 sm:p-6 h-full">
                <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gt-text mb-3 line-clamp-2">
                        {title}
                    </h3>
                </div>

                <div className="mt-auto pt-4 border-t border-gt-border">
                    <TutorialCardFooter date={date} />
                </div>
            </div>
        </CardBase>
    );
}

function TutorialCardFooter({date}: {date: string}) {
    return (
        <footer className="flex flex-wrap items-center gap-x-2 text-sm text-gt-text-muted">
            <span>{formatDateFr(date)}</span>
        </footer>
    );
}
