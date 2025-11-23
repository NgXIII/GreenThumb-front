import {useUserStore} from "@/app/stores/userStore.ts";
import usePlant from "@/shared/hooks/usePlant.ts";
import type {Plant} from "@/shared/types/plant.ts";
import { motion } from "framer-motion";
import {useState} from "react";

export default function Dashboard() {
    const { user } = useUserStore.getState();
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const isPlantSelected = !!selectedPlant;

    return (
        <main className="p-6 min-h-screen">
            <h1 className="text-4xl fond-semibold flex items-center gap-2">
                Bonjour, {user?.username}
            </h1>

            <p className="text-gray-600 mt-1">
                Tu a <span className="font-semibold">3 tâches</span> en attende aujourd'hui
            </p>

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 h-full min-h-[calc(100vh-200px)] items-start
            transition-all duration-500 ${isPlantSelected 
                ? "md:grid-cols-[1fr_1fr_1fr]" 
                : "md:grid-cols-[1.5fr_0fr_0fr]"
            }`}
            >
                <PlantList username={user?.username} setSelectedPlant={setSelectedPlant} isPlantSelected={isPlantSelected} />
                <div className={`h-full transition-all duration-500 overflow-hidden ${isPlantSelected 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 -translate-y-4"}`}
                >
                    <PlantHealth plant={selectedPlant} />
                </div>

                <div
                    className={`h-full transition-all duration-500 overflow-hidden ${isPlantSelected 
                        ? "opacity-100 translate-y-0" 
                        : "opacity-0 -translate-y-4"
                    }`}
                >
                    <PlantTasks  plant={selectedPlant} />
                </div>
            </div>
        </main>
    )
}

function PlantList({ username, setSelectedPlant, isPlantSelected}
                   : {
    username: string | undefined,
    setSelectedPlant: unknown,
    isPlantSelected: boolean
}) {

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border  h-full
        overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-none">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                Liste des plantes
            </h2>

            <PlantCards username={username} setSelectedPlant={setSelectedPlant} isPlantSelected={isPlantSelected} />

            <button className="mt-4 w-full py-2 border rounded-lg flex items-center justify-center gap-1 text-sm hover:bg-gray-50">
                <span>➕</span> Ajouter une plante
            </button>
        </div>
    )
}

function PlantHealth({ plant }: { plant: Plant | null }) {
    if (!plant) {
        return (
            <div className="bg-white p-5 rounded-xl shadow-sm border flex flex-col items-center h-full">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span>💗</span> État de santé
                </h2>

                <div className="flex flex-col items-center text-center mt-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        👁️
                    </div>

                    <p className="mt-4 font-medium">Sélectionne une plante</p>
                    <p className="text-sm text-gray-500">
                        Clique sur une plante pour voir son état de santé
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border flex flex-col items-center h-full">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                Info de la plante
            </h2>

            <img
                src={plant.imageUrl}
                alt={plant.commonName}
                className="w-24 h-24 rounded-full object-cover border shadow"
            />

            <p className="mt-4 text-lg font-semibold">{plant.commonName}</p>
            <p className="text-sm italic text-gray-600">{plant.scientificName}</p>
        </div>
    );
}

function PlantTasks( { plant }: { plant: Plant | null }) {
    console.log(plant?.tasks);
    if(plant?.tasks.length == 0) {
        return (
            <div className="bg-white p-5 rounded-xl shadow-sm border flex flex-col items-center h-full">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span>☑️</span> Tâches à effectuer
                </h2>

                <div className="flex flex-col items-center text-center mt-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        ✂️
                    </div>

                    <p className="mt-4 font-medium">Sélectionne une plante</p>
                    <p className="text-sm text-gray-500">
                        Clique sur une plante pour voir ses tâches
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border flex flex-col items-center h-full">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>☑️</span> Tâches à effectuer
            </h2>
            
            {plant?.tasks.map((task, index) => (
                <div
                    key={index}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                >
                    <div
                        className="h-2"
                        style={{ backgroundColor: task.color }}
                    />
                    <div className="p-5">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {task.name}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {task.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            Date limite : {new Date(task.endDate).toLocaleDateString('fr-FR')}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )

}

function PlantCards({ username, setSelectedPlant, isPlantSelected }
                    : { username: string | undefined, setSelectedPlant: unknown, isPlantSelected: boolean }) {
    const { plants, error, loading} = usePlant(username);

    if (loading) {
        return <div className="p-5">Chargement des plantes...</div>
    }

    if (error) {
        return <div className="p-5 text-red-600">Erreur : {error}</div>;
    }

    return (
        <motion.div
            layout
            transition={{ layout: { duration: 0.35, ease: "easeInOut" } }}
            className={`
        ${isPlantSelected
                ? "flex flex-col gap-3"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            }
    `}
        >
            {plants.map((plant, index) => (
                <PlantCard
                    key={index}
                    plant={plant}
                    onClick={() => setSelectedPlant(plant)}
                    isPlantSelected={isPlantSelected}
                />
            ))}
        </motion.div>
    );
}

function PlantCard({ plant, onClick, isPlantSelected}
    : {
    plant: Plant,
    onClick: () => void,
    isPlantSelected: boolean
}) {
    return (
        <motion.div
            layout
            onClick={onClick}
            className={`
        p-4 rounded-lg border cursor-pointer transition
        bg-[var(--color-gt-light-grey)]
        active:scale-95 hover:shadow-[0_0_10px_rgba(0,0,0,0.08)]
        ${isPlantSelected
                ? "flex items-center gap-4"
                : "flex flex-col items-center text-center gap-3"
            }
    `}
            transition={{ layout: { duration: 0.35, ease: "easeInOut" } }}
        >
            <img
                src={plant.imageUrl}
                alt={plant.commonName}
                className={`
                    object-cover border rounded-full
                    ${isPlantSelected ? "w-12 h-12" : "w-20 h-20"}
                `}
            />

            <div className="flex flex-col">
                <span className="font-medium text-base">{plant.commonName}</span>
                <span className="text-sm text-gray-500 italic">{plant.scientificName}</span>
            </div>
        </motion.div>
    );
}

