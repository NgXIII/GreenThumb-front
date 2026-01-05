import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EditPlantForm from "@/pages/plantCreationPage/EditPlantForm.tsx";
import { useEffect, useState } from "react";
import type { Plant } from "@/shared/types/plant.ts";
import apiClient from "@/services/http/apiClient.ts";
import { useUserStore } from "@/app/stores/userStore.ts";

export default function EditPlantPage() {
    const navigate = useNavigate();
    const { plantSlug } = useParams();
    const { user } = useUserStore();
    const [plant, setPlant] = useState<Plant | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!plantSlug || !user?.username) {
            setError("Plante introuvable");
            setLoading(false);
            return;
        }

        const fetchPlant = async () => {
            try {
                const response = await apiClient.get<{ content: Plant[] }>(`/users/${user.username}/plants`, {
                    params: { page: 0, size: 100 }
                });
                const foundPlant = response.data.content.find(p => p.slug === plantSlug);
                if (foundPlant) {
                    setPlant(foundPlant);
                } else {
                    setError("Plante introuvable");
                }
            } catch {
                setError("Erreur lors du chargement de la plante");
            } finally {
                setLoading(false);
            }
        };

        fetchPlant();
    }, [plantSlug, user?.username]);

    if (loading) {
        return (
            <main className="min-h-screen text-gt-text bg-gt-surface flex items-center justify-center">
                <div className="text-gt-text-muted">Chargement...</div>
            </main>
        );
    }

    if (error || !plant) {
        return (
            <main className="min-h-screen text-gt-text bg-gt-surface flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error || "Plante introuvable"}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-gt-primary hover:underline"
                    >
                        Retour au dashboard
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen text-gt-text bg-gt-surface overflow-hidden transition-colors duration-300">
            <div className="flex-1 flex flex-col items-center px-4">
                <div className="w-full max-w-4xl relative">
                    <section className="border border-gt-border rounded-md bg-gt-surface-elevated shadow-xs
                                     px-4 mt-5 sm:px-10 py-6 mb-8 relative z-10
                                     transition-colors duration-300"
                    >
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 text-gt-text-accent hover:text-gt-primary transition-colors mb-4 cursor-pointer"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="text-sm">Retour</span>
                        </button>

                        <h1 className="text-2xl font-semibold mt-4 mb-6 text-center lg:text-left lg:text-[2rem] text-gt-text">
                            Modifier votre plante
                        </h1>

                        <EditPlantForm plant={plant} />
                    </section>
                </div>
            </div>
        </main>
    );
}

