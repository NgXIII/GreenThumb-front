import usePlant from "@/shared/hooks/usePlant.ts";
import {motion} from "framer-motion";
import type {Plant} from "@/shared/types/plant.ts";

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
    const { plants, error, loading} = usePlant(username);

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