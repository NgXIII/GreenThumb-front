import {useUserStore} from "@/app/stores/userStore.ts";
import type {Plant} from "@/shared/types/plant.ts";
import {useState, useEffect, useCallback} from "react";
import useCountTask from "@/shared/hooks/useTaskCount.ts";
import EmptyState from "@/pages/Dashboard/EmptyState.tsx";
import PlantCards from "@/pages/Dashboard/PlantCards.tsx";
import PlantTasks from "@/pages/Dashboard/PlantTasks.tsx";
import AddPlantDialog from "@/pages/Dashboard/AddPlantDialog.tsx";
import PlantDetails from "@/pages/Dashboard/PlantDetails.tsx";
import { Search } from "lucide-react";

interface PlantListProps {
    username: string | undefined;
    setSelectedPlant: (plant: Plant | null) => void;
    selectedPlant: Plant | null;
    refreshKey: number;
}

export default function Dashboard() {
    const { user, incrementTasksCompleted } = useUserStore();
    const { count } = useCountTask(user?.username);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleTaskCompleted = useCallback(() => {
        // Incrémenter le compteur de tâches complétées dans le store
        incrementTasksCompleted();
        // Forcer le rafraîchissement des plantes
        setRefreshKey(prev => prev + 1);
        // Mettre à jour la plante sélectionnée (les tâches ont changé)
        setSelectedPlant(prev => {
            if (prev) {
                // Retirer la tâche de la liste locale
                return { ...prev, tasks: prev.tasks?.filter(t => t.id !== undefined) ?? [] };
            }
            return prev;
        });
    }, [incrementTasksCompleted]);

    return (
        <main className="min-h-screen bg-gt-surface p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <header
                    className="bg-gt-surface-elevated rounded-lg p-6 border border-gt-border opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
                    style={{ animationDelay: '0.1s' }}
                >
                    <h1 className="text-3xl font-bold text-gt-text mb-2">
                        Bonjour, {user?.username}
                    </h1>
                    <p className="text-gt-text-muted">
                        Tu as {count} tâche{count > 1 ? 's' : ''} en attente aujourd'hui
                    </p>
                </header>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <article
                        className="lg:col-span-1 opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
                        style={{ animationDelay: '0.2s' }}
                    >
                        <PlantList
                            username={user?.username}
                            setSelectedPlant={setSelectedPlant}
                            selectedPlant={selectedPlant}
                            refreshKey={refreshKey}
                        />
                    </article>

                    <article
                        className="lg:col-span-2 space-y-6 opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
                        style={{ animationDelay: '0.3s' }}
                    >
                        <PlantHealth plant={selectedPlant} />
                        <PlantTasks plant={selectedPlant} onTaskCompleted={handleTaskCompleted} />
                    </article>
                </section>
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
        </main>
    );
}

function PlantList({ username, setSelectedPlant, selectedPlant, refreshKey }: PlantListProps) {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce simple : met à jour debouncedQuery 300ms après la dernière frappe
    useEffect(() => {
        const id = setTimeout(() => setDebouncedQuery(query.trim()), 300);
        return () => clearTimeout(id);
    }, [query]);

    return (
        <section className="bg-gt-surface-elevated rounded-lg border border-gt-border overflow-hidden">
            <header className="bg-gt-primary p-4">
                <h2 className="text-xl font-semibold text-gt-primary-foreground flex items-center gap-2">
                    🌱 Liste des plantes
                </h2>
            </header>

            <article className="p-4">
                <div className="mb-4">
                    <label className="sr-only">Rechercher une plante</label>

                    <div className="relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 text-gt-text-muted">
                            <Search width={16} height={16} aria-hidden />
                        </div>

                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            aria-label="Rechercher une plante"
                            placeholder="Rechercher une plante..."
                            className="w-full bg-gt-surface border border-gt-border rounded-lg py-2 pl-10 pr-3 text-gt-text focus:outline-none focus:ring-2 focus:ring-gt-primary transition"
                        />
                    </div>
                </div>

                <PlantCards
                    username={username}
                    setSelectedPlant={setSelectedPlant}
                    selectedPlant={selectedPlant}
                    refreshKey={refreshKey}
                    search={debouncedQuery}
                />

                <AddPlantDialog />
            </article>
        </section>
    );
}

function PlantHealth({ plant }: { plant: Plant | null }) {
    return (
        <section className="bg-gt-surface-elevated rounded-lg border border-gt-border overflow-hidden">
            <header className="bg-gt-primary p-4">
                <h2 className="text-xl font-semibold text-gt-primary-foreground flex items-center gap-2">
                    💗 État de santé
                </h2>
            </header>

            <article className="p-6">
                {!plant ? (
                    <EmptyState
                        icon="👁️"
                        title="Sélectionne une plante"
                        description="Clique sur une plante pour voir son état de santé"
                    />
                ) : (
                    <PlantDetails plant={plant} />
                )}
            </article>
        </section>
    );
}