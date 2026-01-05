import { useState } from "react";
import { Filter, X, ChevronDown, Droplets, Sun, Leaf, Skull, Home, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import {
    LIFE_CYCLE_OPTIONS,
    WATER_NEED_OPTIONS,
    LIGHT_OPTIONS,
    SOIL_TYPE_OPTIONS,
} from "@/shared/types/plant";

export interface PlantFiltersState {
    lifeCycle: string[];
    waterNeed: string[];
    lightLevel: string[];
    soilType: string[];
    petToxic: boolean | null;
    humanToxic: boolean | null;
    indoorFriendly: boolean | null;
}

const defaultFilters: PlantFiltersState = {
    lifeCycle: [],
    waterNeed: [],
    lightLevel: [],
    soilType: [],
    petToxic: null,
    humanToxic: null,
    indoorFriendly: null,
};

interface PlantFiltersProps {
    filters: PlantFiltersState;
    onFiltersChange: (filters: PlantFiltersState) => void;
}

type FilterCategory = 'lifeCycle' | 'waterNeed' | 'lightLevel' | 'soilType';

export default function PlantFilters({ filters, onFiltersChange }: PlantFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    const activeFiltersCount =
        filters.lifeCycle.length +
        filters.waterNeed.length +
        filters.lightLevel.length +
        filters.soilType.length +
        (filters.petToxic !== null ? 1 : 0) +
        (filters.humanToxic !== null ? 1 : 0) +
        (filters.indoorFriendly !== null ? 1 : 0);

    const toggleArrayFilter = (category: FilterCategory, value: string) => {
        const current = filters[category];
        const updated = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
        onFiltersChange({ ...filters, [category]: updated });
    };

    const toggleBooleanFilter = (category: 'petToxic' | 'humanToxic' | 'indoorFriendly', value: boolean | null) => {
        const currentValue = filters[category];
        // Toggle: null -> true -> false -> null
        let newValue: boolean | null;
        if (currentValue === null) {
            newValue = value;
        } else if (currentValue === value) {
            newValue = null;
        } else {
            newValue = value;
        }
        onFiltersChange({ ...filters, [category]: newValue });
    };

    const resetFilters = () => {
        onFiltersChange(defaultFilters);
    };

    const hasActiveFilters = activeFiltersCount > 0;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="default"
                    className={cn(
                        "gap-2 border-gt-border relative",
                        hasActiveFilters && "border-gt-primary bg-gt-primary/10"
                    )}
                >
                    <Filter size={16} />
                    <span className="hidden sm:inline">Filtres</span>
                    {hasActiveFilters && (
                        <Badge
                            variant="default"
                            className="ml-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs bg-gt-primary text-gt-primary-foreground"
                        >
                            {activeFiltersCount}
                        </Badge>
                    )}
                    <ChevronDown size={14} className="hidden sm:block" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-[calc(100vw-2rem)] sm:w-96 p-0 bg-gt-surface-elevated border-gt-border max-h-[min(500px,calc(100vh-8rem))] flex flex-col overflow-hidden"
                align="end"
                sideOffset={8}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gt-border flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gt-primary" />
                        <span className="font-semibold text-gt-text">Filtres</span>
                        {hasActiveFilters && (
                            <Badge variant="secondary" className="text-xs">
                                {activeFiltersCount} actif{activeFiltersCount > 1 ? 's' : ''}
                            </Badge>
                        )}
                    </div>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                            className="gap-1 text-gt-text-muted hover:text-gt-text h-8 px-2"
                        >
                            <RotateCcw size={14} />
                            <span className="text-xs">Réinitialiser</span>
                        </Button>
                    )}
                </div>

                {/* Filter sections */}
                <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-5 overscroll-contain">
                    {/* Cycle de vie */}
                    <FilterSection
                        icon={<Leaf size={16} />}
                        title="Cycle de vie"
                        options={LIFE_CYCLE_OPTIONS}
                        selectedValues={filters.lifeCycle}
                        onToggle={(value) => toggleArrayFilter('lifeCycle', value)}
                    />

                    {/* Besoin en eau */}
                    <FilterSection
                        icon={<Droplets size={16} />}
                        title="Besoin en eau"
                        options={WATER_NEED_OPTIONS}
                        selectedValues={filters.waterNeed}
                        onToggle={(value) => toggleArrayFilter('waterNeed', value)}
                    />

                    {/* Niveau de lumière */}
                    <FilterSection
                        icon={<Sun size={16} />}
                        title="Lumière"
                        options={LIGHT_OPTIONS}
                        selectedValues={filters.lightLevel}
                        onToggle={(value) => toggleArrayFilter('lightLevel', value)}
                    />

                    {/* Type de sol */}
                    <FilterSection
                        icon={<Leaf size={16} />}
                        title="Type de sol"
                        options={SOIL_TYPE_OPTIONS}
                        selectedValues={filters.soilType}
                        onToggle={(value) => toggleArrayFilter('soilType', value)}
                    />

                    {/* Toxicité & Indoor */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gt-text-muted">
                            <Skull size={16} />
                            <span className="text-sm font-medium">Sécurité & Emplacement</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <BooleanFilter
                                label="Non toxique pour animaux"
                                icon={<span className="text-sm">🐾</span>}
                                value={filters.petToxic === false ? true : filters.petToxic === true ? false : null}
                                onToggle={(val) => toggleBooleanFilter('petToxic', val === null ? null : !val)}
                            />
                            <BooleanFilter
                                label="Non toxique pour humains"
                                icon={<span className="text-sm">👨‍👩‍👧‍👦</span>}
                                value={filters.humanToxic === false ? true : filters.humanToxic === true ? false : null}
                                onToggle={(val) => toggleBooleanFilter('humanToxic', val === null ? null : !val)}
                            />
                            <BooleanFilter
                                label="Adaptée à l'intérieur"
                                icon={<Home size={14} />}
                                value={filters.indoorFriendly}
                                onToggle={(val) => toggleBooleanFilter('indoorFriendly', val)}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer with active filters summary */}
                {hasActiveFilters && (
                    <div className="p-4 border-t border-gt-border bg-gt-surface/50 flex-shrink-0 max-h-28 overflow-y-auto">
                        <div className="flex flex-wrap gap-1.5">
                            {filters.lifeCycle.map((value) => (
                                <FilterTag
                                    key={`lc-${value}`}
                                    label={value}
                                    onRemove={() => toggleArrayFilter('lifeCycle', value)}
                                />
                            ))}
                            {filters.waterNeed.map((value) => (
                                <FilterTag
                                    key={`wn-${value}`}
                                    label={value}
                                    onRemove={() => toggleArrayFilter('waterNeed', value)}
                                />
                            ))}
                            {filters.lightLevel.map((value) => (
                                <FilterTag
                                    key={`ll-${value}`}
                                    label={LIGHT_OPTIONS.find(o => o.value === value)?.label || value}
                                    onRemove={() => toggleArrayFilter('lightLevel', value)}
                                />
                            ))}
                            {filters.soilType.map((value) => (
                                <FilterTag
                                    key={`st-${value}`}
                                    label={value}
                                    onRemove={() => toggleArrayFilter('soilType', value)}
                                />
                            ))}
                            {filters.petToxic !== null && (
                                <FilterTag
                                    label={filters.petToxic ? "Toxique animaux" : "Non toxique animaux"}
                                    onRemove={() => onFiltersChange({ ...filters, petToxic: null })}
                                />
                            )}
                            {filters.humanToxic !== null && (
                                <FilterTag
                                    label={filters.humanToxic ? "Toxique humains" : "Non toxique humains"}
                                    onRemove={() => onFiltersChange({ ...filters, humanToxic: null })}
                                />
                            )}
                            {filters.indoorFriendly !== null && (
                                <FilterTag
                                    label={filters.indoorFriendly ? "Intérieur" : "Extérieur"}
                                    onRemove={() => onFiltersChange({ ...filters, indoorFriendly: null })}
                                />
                            )}
                        </div>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}

// Sub-components
interface FilterSectionProps {
    icon: React.ReactNode;
    title: string;
    options: { value: string; label: string }[];
    selectedValues: string[];
    onToggle: (value: string) => void;
}

function FilterSection({ icon, title, options, selectedValues, onToggle }: FilterSectionProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-gt-text-muted">
                {icon}
                <span className="text-sm font-medium">{title}</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onToggle(option.value)}
                        className={cn(
                            "px-3 py-1.5 text-sm rounded-full border transition-all duration-200",
                            selectedValues.includes(option.value)
                                ? "bg-gt-primary text-gt-primary-foreground border-gt-primary"
                                : "bg-gt-surface border-gt-border text-gt-text hover:border-gt-primary/50 hover:bg-gt-primary/5"
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

interface BooleanFilterProps {
    label: string;
    icon: React.ReactNode;
    value: boolean | null;
    onToggle: (value: boolean | null) => void;
}

function BooleanFilter({ label, icon, value, onToggle }: BooleanFilterProps) {
    return (
        <button
            onClick={() => {
                // Cycle: null -> true -> null
                if (value === null) {
                    onToggle(true);
                } else {
                    onToggle(null);
                }
            }}
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-left",
                value === true
                    ? "bg-gt-primary text-gt-primary-foreground border-gt-primary"
                    : "bg-gt-surface border-gt-border text-gt-text hover:border-gt-primary/50 hover:bg-gt-primary/5"
            )}
        >
            {icon}
            <span className="text-sm">{label}</span>
            {value === true && (
                <span className="ml-auto text-xs opacity-80">✓</span>
            )}
        </button>
    );
}

interface FilterTagProps {
    label: string;
    onRemove: () => void;
}

function FilterTag({ label, onRemove }: FilterTagProps) {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gt-primary/10 text-gt-primary rounded-full border border-gt-primary/20">
            {label}
            <button
                onClick={onRemove}
                className="hover:bg-gt-primary/20 rounded-full p-0.5 transition-colors"
                aria-label={`Retirer le filtre ${label}`}
            >
                <X size={12} />
            </button>
        </span>
    );
}

export { defaultFilters };

