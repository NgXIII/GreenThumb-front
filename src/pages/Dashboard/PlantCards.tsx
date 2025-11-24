import usePlant from "@/shared/hooks/usePlant.ts";
import {motion} from "framer-motion";
import type {Plant} from "@/shared/types/plant.ts";
import {useState} from "react";

interface PlantCardsProps {
    username: string | undefined;
    setSelectedPlant: (plant: Plant | null) => void;
    selectedPlant: Plant | null;
}

interface PlantCardProps {
    plant: Plant;
    onClick: () => void;
    isSelected: boolean;
    index: number;
}

export default function PlantCards({ username, setSelectedPlant, selectedPlant }: PlantCardsProps) {
    const [page, setPage] = useState(0);

    const {
        plants,
        totalPages,
        currentPage,
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

    return (
        <div className="space-y-3">
            {plants.map((plant, index) => (
                <PlantCard
                    key={index}
                    plant={plant}
                    onClick={() => setSelectedPlant(plant)}
                    isSelected={selectedPlant === plant}
                    index={index}
                />
            ))}

            <div className="flex items-center justify-center gap-2 pt-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-gt-surface border border-gt-border hover:bg-gt-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    disabled={currentPage === 0}
                    onClick={() => setPage(prev => prev - 1)}
                >
                    <svg className="w-5 h-5 text-gt-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </motion.button>

                <div className="flex items-center gap-1 px-3">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setPage(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                i === currentPage
                                    ? 'bg-gt-interactive w-6'
                                    : 'bg-gt-border hover:bg-gt-text-muted'
                            }`}
                        />
                    ))}
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-gt-surface border border-gt-border hover:bg-gt-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    disabled={currentPage + 1 >= totalPages}
                    onClick={() => setPage(prev => prev + 1)}
                >
                    <svg className="w-5 h-5 text-gt-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </motion.button>
            </div>
        </div>
    );
}

function PlantCard({ plant, onClick, isSelected, index }: PlantCardProps) {
    return (
        <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
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
                    src={plant.imageUrl}
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
        </motion.button>
    );
}