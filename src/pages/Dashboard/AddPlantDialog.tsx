import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
    DialogClose,
    DialogTitle,
    DialogDescription
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import type {PlantSearchResult} from "@/shared/types/plant.ts";
import {useCreatePlantApi, useSearchPlants} from "@/shared/hooks/usePlant.ts";
import {toast} from "sonner";

export default function AddPlantDialog() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlant, setSelectedPlant] = useState<PlantSearchResult | null>(null);
    const navigate = useNavigate();

    const { plants, isLoading, error, currentPage, totalPages, totalElements, search, clearError } = useSearchPlants();
    const { createPlantApi, error: createError } = useCreatePlantApi();

    const handleSearch = async (page: number = 1) => {
        setSelectedPlant(null);
        await search(searchQuery, page);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            handleSearch(newPage);
        }
    };

    const handleAddPlant = async () => {
        if (selectedPlant) {
            const success = await createPlantApi(selectedPlant);

            if (success) {
                navigate(`/creation-plante/${selectedPlant.slug}`, {
                    state: { selectedPlant }
                });
            } else {
                toast.error(createError || "Erreur lors de la création de la plante. Veuillez réessayer.")
            }
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className="cursor-pointer w-full mt-4 bg-gt-primary hover:bg-gt-primary-hover text-gt-primary-foreground font-medium py-3 px-4 rounded-lg
                                transition-colors duration-200 flex items-center justify-center gap-2">
                    ➕ Ajouter une plante
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col bg-gt-surface-elevated">
                <DialogTitle className="text-gt-text">Ajouter une plante</DialogTitle>
                <DialogDescription className="text-gt-text-muted">
                    Recherchez et sélectionnez une plante à ajouter à votre collection
                </DialogDescription>

                <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Rechercher une plante..."
                            className="flex-1"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                clearError();
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSearch(1);
                                }
                            }}
                        />
                        <Button
                            type="button"
                            onClick={() => handleSearch(1)}
                            disabled={isLoading || searchQuery.trim().length < 2}
                        >
                            Rechercher
                        </Button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                            <p className="font-medium">Erreur</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gt-primary"></div>
                        </div>
                    )}

                    {!isLoading && plants.length === 0 && searchQuery && (
                        <div className="text-center py-8 text-gt-text-muted">
                            <p className="text-lg">🔍 Aucune plante trouvée</p>
                            <p className="text-sm mt-2">
                                Essayez avec un autre terme de recherche
                            </p>
                        </div>
                    )}

                    {!isLoading && plants.length === 0 && !searchQuery && (
                        <div className="text-center py-8 text-gt-text-muted">
                            <p className="text-lg">🔍 Recherchez une plante</p>
                            <p className="text-sm mt-2">
                                Entrez au moins 2 caractères pour commencer
                            </p>
                        </div>
                    )}

                    {!isLoading && plants.length > 0 && (
                        <>
                            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                                {plants.map((plant) => (
                                    <div
                                        key={plant.scientificName}
                                        onClick={() => setSelectedPlant(plant)}
                                        className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                                            selectedPlant?.scientificName === plant.scientificName
                                                ? 'border-gt-border bg-gt-green'
                                                : 'border-gt-primary bg-gt-primary/10 hover:border-gt-primary/50 hover:bg-gt-surface'
                                        }`}
                                    >
                                        <img
                                            src={plant.imageUrl || '/placeholder-plant.png'}
                                            alt={plant.commonName || plant.scientificName}
                                            className="w-16 h-16 rounded-lg object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = '/placeholder-plant.png';
                                            }}
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gt-text">
                                                {plant.commonName || 'Nom commun non disponible'}
                                            </h3>
                                            <p className="text-sm text-gt-text-muted italic">
                                                {plant.scientificName}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex items-center justify-between border-t pt-4 border-gt-border">
                                    <p className="text-sm text-gt-text-muted">
                                        {totalElements} résultat{totalElements > 1 ? 's' : ''} •
                                        Page {currentPage} sur {totalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            ← Précédent
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Suivant →
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <DialogFooter>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 w-full">
                        <Button
                            type="button"
                            onClick={() => navigate("/creation-plante")}
                            className="cursor-pointer w-full sm:w-auto"
                        >
                            Créer une plante
                        </Button>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <DialogClose asChild>
                                <Button variant="outline" className="cursor-pointer flex-1 sm:flex-none">Annuler</Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={!selectedPlant}
                                onClick={handleAddPlant}
                                className="flex-1 sm:flex-none"
                            >
                                Ajouter la plante
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
