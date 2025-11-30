import {useUserStore} from "@/app/stores/userStore.ts";
import type {Plant} from "@/shared/types/plant.ts";
import { motion } from "framer-motion";
import {useState} from "react";
import useCountTask from "@/shared/hooks/useTaskCount.ts";
import EmptyState from "@/pages/Dashboard/EmptyState.tsx";
import PlantCards from "@/pages/Dashboard/PlantCards.tsx";
import PlantTasks from "@/pages/Dashboard/PlantTasks.tsx";

interface PlantListProps {
    username: string | undefined;
    setSelectedPlant: (plant: Plant | null) => void;
    selectedPlant: Plant | null;
}

export default function Dashboard() {
    const { user } = useUserStore.getState();
    const { count } = useCountTask(user?.username);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

    return (
        <main className="min-h-screen bg-gt-surface p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gt-surface-elevated rounded-lg p-6 border border-gt-border"
                >
                    <h1 className="text-3xl font-bold text-gt-text mb-2">
                        Bonjour, {user?.username}
                    </h1>
                    <p className="text-gt-text-muted">
                        Tu as {count} tâche{count > 1 ? 's' : ''} en attente aujourd'hui
                    </p>
                </motion.header>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <article className="lg:col-span-1">
                        <PlantList
                            username={user?.username}
                            setSelectedPlant={setSelectedPlant}
                            selectedPlant={selectedPlant}
                        />
                    </article>

                    <article className="lg:col-span-2 space-y-6">
                        <PlantHealth plant={selectedPlant} />
                        <PlantTasks plant={selectedPlant} />
                    </article>
                </section>
            </div>
        </main>
    );
}

function PlantList({ username, setSelectedPlant, selectedPlant }: PlantListProps) {
    return (
        <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gt-surface-elevated rounded-lg border border-gt-border overflow-hidden"
        >
            <header className="bg-gt-primary p-4">
                <h2 className="text-xl font-semibold text-gt-primary-foreground flex items-center gap-2">
                    🌱 Liste des plantes
                </h2>
            </header>

            <article className="p-4">
                <PlantCards
                    username={username}
                    setSelectedPlant={setSelectedPlant}
                    selectedPlant={selectedPlant}
                />

                <button className="w-full mt-4 bg-gt-primary hover:bg-gt-primary-hover text-gt-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                    ➕ Ajouter une plante
                </button>
            </article>
        </motion.section>
    );
}

function PlantHealth({ plant }: { plant: Plant | null }) {
    return (
        <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gt-surface-elevated rounded-lg border border-gt-border overflow-hidden"
        >
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
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <img
                                src={plant.imageUrl}
                                alt={plant.commonName}
                                className="w-24 h-24 rounded-lg object-cover border-2 border-gt-border flex-shrink-0"
                            />
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gt-text mb-1">
                                    {plant.commonName}
                                </h3>
                                <p className="text-gt-text-muted italic">
                                    {plant.scientificName}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </article>
        </motion.section>
    );
}

