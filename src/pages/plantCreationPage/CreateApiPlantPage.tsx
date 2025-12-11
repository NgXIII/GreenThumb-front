import {useLocation, useNavigate} from "react-router-dom";
import type {PlantSearchResult} from "@/shared/types/plant.ts";
import QuartetLeaves from "@/shared/components/ui/customs/QuartetLeaves.tsx";
import {ArrowLeft} from "lucide-react";
import CreateApiPlantForm from "@/pages/plantCreationPage/CreateApiPlantForm.tsx";

export default function CreateApiPlantPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedPlant = location.state?.selectedPlant as PlantSearchResult | undefined;

    return <>
        <main className="min-h-screen text-gt-text bg-gt-surface overflow-hidden transition-colors duration-300">
            <div className="flex-1 flex flex-col items-center px-4">
                <div className="w-full max-w-4xl relative">
                    <QuartetLeaves
                        positionLeave1="top-5 left-202"
                        positionLeave2="top-60 -left-27"
                        positionLeave3="-top-28 left-120"
                        positionLeave4="top-126 left-30"
                    />

                    <section className="border border-gt-border rounded-md bg-gt-surface-elevated shadow-xs
                                     px-4 sm:px-10 py-6 mb-8 relative z-10
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
                            Détaillez votre plante
                        </h1>

                        <CreateApiPlantForm selectedPlant={selectedPlant} />
                    </section>
                </div>
            </div>
        </main>
    </>
}