import type { Plant } from "@/shared/types/plant.ts";
import resolveAvatar from "@/shared/utils/resolveAvatar.ts";
import React, {useState} from "react";
import WaterDrop from "@/shared/components/ui/customs/WaterDrop.tsx";
import { useDeletePlant } from "@/shared/hooks/usePlant.ts";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface PlantDetailsProps {
    plant: Plant;
    onPlantDeleted: () => void;
}

export default function PlantDetails({ plant, onPlantDeleted }: PlantDetailsProps) {
    console.log(plant)
    const getLightIcon = (light: string) => {
        switch (light) {
            case "Plein soleil": return "☀️";
            case "Mi-ombre": return "🌤";
            case "Ombre": return "🌑";
            default: return "💡";
        }
    };

    const formatBloomPeriod = (bloomMonth: string | null | undefined) => {
        if (!bloomMonth || bloomMonth.trim() === "-") {
            return "Non renseigné";
        }
        return bloomMonth.replace("-", " -> ");
    };

    return (
        <div className="space-y-6">
            <HeaderPlantInfos plant={plant} onPlantDeleted={onPlantDeleted}/>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard title="Informations générales" icon="📋">
                    <InfoRow label="Cycle de vie" value={plant.lifeCycle} icon="🔄" />
                    <InfoRow label="Type de sol" value={plant.soilType} icon="🌍" />
                    <InfoRow
                        label="pH du sol"
                        value={plant.soilPhMin && plant.soilPhMax ? `${plant.soilPhMin} - ${plant.soilPhMax}` : null}
                        icon="⚗️"
                    />
                </InfoCard>

                <InfoCard title="Besoins environnementaux" icon="💧">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 py-2 border-b border-gt-border">
                        <span className="text-gt-text-muted flex items-center gap-2">
                            💧 Besoin en eau
                        </span>
                        {plant.waterNeed ? (
                            <span className="flex items-center gap-2 sm:text-right">
                                <span className="text-gt-text font-medium">{plant.waterNeed}</span>
                                <WaterDrop level={plant.waterNeed} />
                            </span>
                        ) : (
                            <span className="text-gt-text-muted italic sm:text-right">Non renseigné</span>
                        )}
                    </div>
                    <InfoRow
                        label="Lumière"
                        value={plant.lightLevel}
                        icon={getLightIcon(plant.lightLevel)}
                    />
                    <InfoRow label="Humidité" value={plant.humidityNeed} icon="💦" />
                </InfoCard>

                <InfoCard title="Température" icon="🌡️">
                    <InfoRow
                        label="Température min"
                        value={plant.temperatureMin !== null && plant.temperatureMin !== undefined ? `${plant.temperatureMin}°C` : null}
                        icon="❄️"
                    />
                    <InfoRow
                        label="Température max"
                        value={plant.temperatureMax !== null && plant.temperatureMax !== undefined ? `${plant.temperatureMax}°C` : null}
                        icon="🔥"
                    />
                </InfoCard>

                <InfoCard title="Sécurité & Environnement" icon="⚠️">
                    <InfoRow label="Toxique pour animaux" value={plant.petToxic} icon="🐾" />
                    <InfoRow label="Toxique pour humains" value={plant.humanToxic} icon="👤" />
                    <InfoRow label="Adapté intérieur" value={plant.indoorFriendly} icon="🏠" />
                </InfoCard>
            </div>

            <div className="bg-gt-surface rounded-lg border border-gt-border p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gt-text font-semibold flex items-center gap-2">
                        🌸 Période de floraison
                    </span>
                    <span className={`${!plant.bloomMonth || plant.bloomMonth.trim() === "-" ? "text-gt-text-muted italic" : "text-gt-text-muted"} sm:text-right`}>
                        {formatBloomPeriod(plant.bloomMonth)}
                    </span>
                </div>
            </div>
        </div>
    );
}

function HeaderPlantInfos({plant, onPlantDeleted}: { plant: Plant; onPlantDeleted: () => void }) {
    const { removePlant, isLoading } = useDeletePlant();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        const success = await removePlant(plant.slug);
        if (success) {
            toast.success("Plante supprimée avec succès");
            onPlantDeleted();
        } else {
            toast.error("Erreur lors de la suppression de la plante");
        }
        setShowConfirm(false);
    };

    return (
        <div className="flex items-start gap-4 pb-4 border-b border-gt-border">
            <img
                src={resolveAvatar(plant.imageUrl)}
                alt={plant.commonName || "Plante"}
                className="w-24 h-24 rounded-lg object-cover border-2 border-gt-border flex-shrink-0"
            />
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-2xl font-bold text-gt-text">
                        {plant.commonName || "Non renseigné"}
                    </h3>
                    {!showConfirm ? (
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="p-2 text-gt-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer la plante"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "..." : "Confirmer"}
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-3 py-1 bg-gt-surface border border-gt-border text-gt-text text-sm rounded-lg hover:bg-gt-surface-hover transition-colors"
                            >
                                Annuler
                            </button>
                        </div>
                    )}
                </div>
                <p className="text-lg text-gt-text-muted italic mb-2">
                    {plant.scientificName || "Non renseigné"}
                </p>
                {plant.description && (
                    <p className="text-sm text-gt-text-muted line-clamp-2">
                        {plant.description}
                    </p>
                )}
            </div>
        </div>
    )
}

function InfoRow({label, value, icon}: {
    label: string;
    value: string | number | boolean | null | undefined;
    icon?: string
}) {
    const isEmpty = value === null || value === undefined || value === "" || (typeof value === "string" && value.trim() === "");

    const displayValue = isEmpty
        ? "Non renseigné"
        : typeof value === "boolean"
            ? (value ? "Oui" : "Non")
            : value;

    return (
        <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 py-2 border-b border-gt-border last:border-0">
            <span className="text-gt-text-muted flex items-center gap-2">
                {icon && <span>{icon}</span>}
                {label}
            </span>
            <span className={`${isEmpty ? "text-gt-text-muted italic" : "text-gt-text font-medium"} sm:text-right`}>
                {displayValue}
            </span>
        </div>
    );
}

function InfoCard({title, children, icon }: { title: string; children: React.ReactNode; icon?: string }) {
    return (
        <div className="bg-gt-surface rounded-lg border border-gt-border p-4">
            <h3 className="text-lg font-semibold text-gt-text mb-3 flex items-center gap-2">
                {icon && <span>{icon}</span>}
                {title}
            </h3>
            <div className="space-y-1">
                {children}
            </div>
        </div>
    );
}