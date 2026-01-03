import usePlant from "@/shared/hooks/usePlant.ts";
import type {Plant} from "@/shared/types/plant.ts";
import {useState} from "react";
import resolveAvatar from "@/shared/utils/resolveAvatar.ts";

interface PlantCardsProps {
    username: string | undefined;
    setSelectedPlant: (plant: Plant | null) => void;
    selectedPlant: Plant | null;
}

interface PlantCardProps {
    plant: Plant;
    onClick: () => void;
    isSelected: boolean;
}

export default function PlantCards({ username, setSelectedPlant, selectedPlant }: PlantCardsProps) {
    const [page, setPage] = useState(0);

    const {
        plants,
        totalPages,
        loading,
        error
    } = usePlant(username, page, 5);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-gt-text-muted">Chargement des plantes...</div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="bg-gt-surface rounded-lg p-4 border border-gt-border">
                <p className="text-gt-text">Erreur : {error}</p>
            </div>
        );
    }

    if (plants.length === 0) {
        return (
            <div className="text-center py-8 text-gt-text-muted">
                Aucune plante pour le moment
            </div>
        );
    }

    console.log(plants.map((plant: Plant) => {
        console.log(plant.imageUrl);
    }))

    return (
        <div className="space-y-3">
            {plants.map((plant, index) => (
                <div
                    key={index}
                    className="opacity-0 animate-[fadeInUp_0.4s_ease-out_forwards]"
                    style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                    <PlantCard
                        plant={plant}
                        onClick={() => setSelectedPlant(plant)}
                        isSelected={selectedPlant === plant}
                    />
                </div>
            ))}

            <div
                className="flex items-center justify-center gap-2 pt-4 opacity-0 animate-[fadeInUp_0.4s_ease-out_forwards]"
                style={{ animationDelay: `${0.1 + plants.length * 0.1}s` }}
            >
                <button
                    className="p-2 rounded-lg bg-gt-surface border border-gt-border hover:bg-gt-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    disabled={page === 0}
                    onClick={() => setPage(prev => prev - 1)}
                >
                    <svg className="w-5 h-5 text-gt-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex items-center gap-1 px-3">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                i === page
                                    ? 'bg-gt-interactive w-6'
                                    : 'bg-gt-border hover:bg-gt-text-muted'
                            }`}
                        />
                    ))}
                </div>

                <button
                    className="p-2 rounded-lg bg-gt-surface border border-gt-border hover:bg-gt-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(prev => prev + 1)}
                >
                    <svg className="w-5 h-5 text-gt-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}

function PlantCard({ plant, onClick, isSelected }: PlantCardProps) {
    return (
        <button
            onClick={onClick}
            className={`
        w-full text-left p-4 rounded-lg border-2 transition-all duration-200
        ${isSelected
                ? 'border-gt-interactive bg-gt-surface-hover'
                : 'border-gt-border bg-gt-surface hover:bg-gt-surface-hover'
            }
      `}
        >
            <div className="flex items-start gap-3">
                <img
                    src={resolveAvatar(plant.imageUrl)}
                    alt={plant.commonName}
                    className="w-12 h-12 rounded-lg object-cover border border-gt-border flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gt-text truncate">
                        {plant.commonName}
                    </h3>
                    <p className="text-sm text-gt-text-muted italic truncate">
                        {plant.scientificName}
                    </p>
                </div>
            </div>
        </button>
    );
}