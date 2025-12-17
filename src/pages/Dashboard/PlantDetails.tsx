import type { Plant } from "@/shared/types/plant.ts";
import resolveAvatar from "@/shared/utils/resolveAvatar.ts";
import React from "react";
import WaterDrop from "@/shared/components/ui/customs/WaterDrop.tsx";

interface PlantDetailsProps {
    plant: Plant;
}

function InfoRow({ label, value, icon }: { label: string; value: string | number | boolean; icon?: string }) {
    const displayValue = typeof value === "boolean"
        ? (value ? "Oui" : "Non")
        : value;

    return (
        <div className="flex items-center justify-between py-2 border-b border-gt-border last:border-0">
            <span className="text-gt-text-muted flex items-center gap-2">
                {icon && <span>{icon}</span>}
                {label}
            </span>
            <span className="text-gt-text font-medium">{displayValue}</span>
        </div>
    );
}

function InfoCard({ title, children, icon }: { title: string; children: React.ReactNode; icon?: string }) {
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

export default function PlantDetails({ plant }: PlantDetailsProps) {
    const getLightIcon = (light: string) => {
        switch (light) {
            case "Plein soleil": return "☀️";
            case "Mi-ombre": return "🌤";
            case "Ombre": return "🌑";
            default: return "💡";
        }
    };

    return (
        <div className="space-y-6">
            {/* En-tête avec image et noms */}
            <div className="flex items-start gap-4 pb-4 border-b border-gt-border">
                <img
                    src={resolveAvatar(plant.imageUrl)}
                    alt={plant.commonName}
                    className="w-24 h-24 rounded-lg object-cover border-2 border-gt-border flex-shrink-0"
                />
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gt-text mb-1">
                        {plant.commonName}
                    </h3>
                    <p className="text-lg text-gt-text-muted italic mb-2">
                        {plant.scientificName}
                    </p>
                    {plant.description && (
                        <p className="text-sm text-gt-text-muted line-clamp-2">
                            {plant.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Grille d'informations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cycle de vie et sol */}
                <InfoCard title="Informations générales" icon="📋">
                    <InfoRow label="Cycle de vie" value={plant.lifeCycle} icon="🔄" />
                    <InfoRow label="Type de sol" value={plant.soilType} icon="🌍" />
                    <InfoRow label="pH du sol" value={`${plant.soilPhMin} - ${plant.soilPhMax}`} icon="⚗️" />
                </InfoCard>

                {/* Besoins en eau et lumière */}
                <InfoCard title="Besoins environnementaux" icon="💧">
                    <div className="flex items-center justify-between py-2 border-b border-gt-border">
                        <span className="text-gt-text-muted flex items-center gap-2">
                            💧 Besoin en eau
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="text-gt-text font-medium">{plant.waterNeed}</span>
                            <WaterDrop level={plant.waterNeed} />
                        </span>
                    </div>
                    <InfoRow
                        label="Lumière"
                        value={plant.lightLevel}
                        icon={getLightIcon(plant.lightLevel)}
                    />
                    <InfoRow label="Humidité" value={plant.humidityNeed} icon="💦" />
                </InfoCard>

                {/* Température */}
                <InfoCard title="Température" icon="🌡️">
                    <InfoRow label="Température min" value={`${plant.temperatureMin}°C`} icon="❄️" />
                    <InfoRow label="Température max" value={`${plant.temperatureMax}°C`} icon="🔥" />
                </InfoCard>

                {/* Toxicité et environnement */}
                <InfoCard title="Sécurité & Environnement" icon="⚠️">
                    <InfoRow label="Toxique pour animaux" value={plant.petToxic} icon="🐾" />
                    <InfoRow label="Toxique pour humains" value={plant.humanToxic} icon="👤" />
                    <InfoRow label="Adapté intérieur" value={plant.indoorFriendly} icon="🏠" />
                </InfoCard>
            </div>

            {/* Période de floraison */}
            {plant.bloomMonth && (
                <div className="bg-gt-surface rounded-lg border border-gt-border p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gt-text font-semibold flex items-center gap-2">
                            🌸 Période de floraison
                        </span>
                        <span className="text-gt-text-muted">{plant.bloomMonth}</span>
                    </div>
                </div>
            )}
        </div>
    );
}