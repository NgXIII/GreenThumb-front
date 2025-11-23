import useThreeResources from "../../shared/hooks/useThreeResources.ts";
import type {Resource} from "@/shared/types/resource.ts";
import CardBase from "./CardBase.tsx";
import {formatDateFr} from "@/shared/utils/date.ts";

export default function TutorialSession() {
    const { messages, error, loading } = useThreeResources();

    return (
        <section className="bg-gradient-to-b py-12 px-4 sm:px-6 md:px-10 text-center">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    Guides et tutoriels experts
                </h2>

                <p className="text-gray-600 text-sm sm:text-base mb-10">
                    Apprenez de nouvelles techniques avec nos ressources détaillées
                </p>
                {loading && <p>Chargement...</p>}
                {error && <p className="text-red-500">Erreur : {error}</p>}
                {!loading && !error && <TutorialCards data={messages} />}
            </div>
        </section>
    );
}

function TutorialCards({ data }: { data: Resource[]}) {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {data.map((item, index) => (
                <TutorialCard key={index} {...item} />
            ))}
        </section>
    );
}

function TutorialCard({title, date, imageUrl }: Resource) {
    const urlImage = "src/assets/resourceImage/" + imageUrl;

    return (
        <CardBase>
            {/* Image */}
            <div className="relative w-full h-44 sm:h-48 bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center overflow-hidden">
                {urlImage ? (
                    <img
                        src={urlImage}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-4xl">🌞</span>
                )}
            </div>

            <div className="flex flex-col flex-1 justify-between p-5 sm:p-6 h-full">
                <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                        {title}
                    </h3>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100">
                    <TutorialCardFooter date={date} />
                </div>
            </div>
        </CardBase>
    );
}

function TutorialCardFooter({date}: {date: string}) {
    return (
        <footer className="flex flex-wrap items-center gap-x-2 text-sm text-gray-500">
            <span>{formatDateFr(date)}</span>
        </footer>
    );
}
