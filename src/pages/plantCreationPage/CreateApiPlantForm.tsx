import { Form } from "@/shared/components/ui/form.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    LIFE_CYCLE_OPTIONS,
    LIGHT_OPTIONS, MONTH_OPTIONS,
    type PlantSearchResult,
    SOIL_TYPE_OPTIONS,
    WATER_NEED_OPTIONS
} from "@/shared/types/plant.ts";
import InputForm from "@/shared/components/ui/customs/InputForm.tsx";
import SelectForm from "@/shared/components/ui/customs/SelectForm.tsx";
import SwitchForm from "@/shared/components/ui/customs/SwitchForm.tsx";
import InputFile from "@/shared/components/ui/customs/InputFile.tsx";
import { toast } from "sonner";
import {useNavigate} from "react-router-dom";
import {type PlantPost, PlantSchema} from "@/shared/types/schemas/plantSchema.ts";
import {useCreatePlant} from "@/shared/hooks/usePlant.ts";
import { useEffect } from "react";
import {useUserStore} from "@/app/stores/userStore.ts";

export type CreateApiPlantFormProps = {
    selectedPlant: PlantSearchResult | undefined;
    isManualCreation: boolean;
}

export default function CreateApiPlantForm({ selectedPlant, isManualCreation }: CreateApiPlantFormProps) {
    const navigate = useNavigate();
    const { user } = useUserStore.getState();
    const { createPlant, isLoading, error } = useCreatePlant();

    const form = useForm<PlantPost>({
        resolver: zodResolver(PlantSchema),
        mode: "all",
        defaultValues: {
            slug: selectedPlant?.slug || "",
            scientificName: selectedPlant?.scientificName || "",
            commonName: selectedPlant?.commonName || "",
            imageUrl: selectedPlant?.imageUrl || "",
            description: "",
            lifeCycle: "",
            waterNeed: "",
            lightLevel: "",
            soilType: "",
            soilPhMin: 6.5,
            soilPhMax: 7.0,
            username: user?.username,
            temperatureMin: 15,
            temperatureMax: 25,
            humidityNeed: false,
            bloomMonthStart: "",
            bloomMonthEnd: "",
            petToxic: false,
            humanToxic: false,
            indoorFriendly: true
        }
    })

    useEffect(() => {
        if (isManualCreation) {
            const subscription = form.watch((value, { name }) => {
                if (name === 'scientificName' && value.scientificName) {
                    const slug = value.scientificName
                        .toLowerCase()
                        .replace(/\s+/g, '-');
                    form.setValue('slug', slug);
                }
            });
            return () => subscription.unsubscribe();
        }
    }, [form, isManualCreation]);

    const submit = async (values: PlantPost) => {
        console.log(values.username)
        const success = await createPlant(values);

        if (success) {
            toast.success("Plante créée avec succès !")
            navigate("/dashboard")
        } else {
            toast.error(error || "Erreur lors de la création de la plante. Veuillez réessayer.")
        }
    }

    return (
        <Form {...form}>
            <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(submit)}>
                <PlantInfoSection
                    selectedPlant={selectedPlant}
                    isManualCreation={isManualCreation}
                />

                <Separator />

                <div className="flex flex-col gap-5 lg:flex-row lg:gap-10">
                    <LeftColumn />

                    <div className="hidden lg:block border-l border-gt-border self-stretch" />

                    <RightColumn />
                </div>

                <Separator />

                <ToxicitySection />

                <SubmitButton isLoading={isLoading} />
            </form>
        </Form>
    )
}

function PlantInfoSection({
    selectedPlant,
    isManualCreation
}: {
    selectedPlant: PlantSearchResult | undefined,
    isManualCreation: boolean
}) {
    return (
        <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gt-text">Informations de base</h2>

            {isManualCreation ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputForm<PlantPost>
                            name="scientificName"
                            inputType="text"
                            label="Nom scientifique*"
                            placeholder="Ex: Rosa damascena"
                        />

                        <InputForm<PlantPost>
                            name="commonName"
                            inputType="text"
                            label="Nom commun*"
                            placeholder="Ex: Rose de Damas"
                        />
                    </div>

                    <InputFile<PlantPost>
                        name="imageUrl"
                        label="Image de la plante*"
                    />
                </>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gt-surface-elevated p-4 rounded-md border border-gt-border">
                            <p className="text-sm text-gt-text-muted mb-1">Nom scientifique*</p>
                            <p className="text-gt-text font-medium">{selectedPlant?.scientificName || "Non défini"}</p>
                        </div>

                        <div className="bg-gt-surface-elevated p-4 rounded-md border border-gt-border">
                            <p className="text-sm text-gt-text-muted mb-1">Nom commun*</p>
                            <p className="text-gt-text font-medium">{selectedPlant?.commonName || "Non défini"}</p>
                        </div>
                    </div>

                    {selectedPlant?.imageUrl && (
                        <div className="bg-gt-surface-elevated p-4 rounded-md border border-gt-border">
                            <p className="text-sm text-gt-text-muted mb-2">Image de la plante*</p>
                            <img
                                src={selectedPlant.imageUrl}
                                alt={selectedPlant.commonName}
                                className="w-full max-w-md h-48 object-cover rounded-md"
                            />
                        </div>
                    )}
                </>
            )}

            <InputForm<PlantPost>
                name="description"
                inputType="textarea"
                label="Description"
                placeholder="Présente la plante, son origine, ses particularités..."
            />
        </section>
    )
}

function LeftColumn() {
    return (
        <section className="flex flex-col gap-5 lg:flex-1">
            <h2 className="text-xl font-semibold text-gt-text">Caractéristiques</h2>

            <SelectForm<PlantPost>
                name="lifeCycle"
                label="Cycle de vie"
                placeholder="Sélectionner un cycle"
                options={LIFE_CYCLE_OPTIONS}
            />

            <SelectForm<PlantPost>
                name="waterNeed"
                label="💧 Besoin en eau"
                placeholder="Sélectionner un besoin"
                options={WATER_NEED_OPTIONS}
                helpText="Fréquence d'arrosage recommandée"
            />

            <SelectForm<PlantPost>
                name="lightLevel"
                label="☀️ Exposition à la lumière"
                placeholder="Sélectionner une exposition"
                options={LIGHT_OPTIONS}
            />

            <SelectForm<PlantPost>
                name="soilType"
                label="🌍 Type de sol"
                placeholder="Sélectionner un type"
                options={SOIL_TYPE_OPTIONS}
                helpText="Type de sol le plus adapté"
            />

            <div className="grid grid-cols-2 gap-4">
                <InputForm<PlantPost>
                    name="soilPhMin"
                    inputType="number"
                    label="⚗️ pH min"
                    placeholder="5.5"
                />
                <InputForm<PlantPost>
                    name="soilPhMax"
                    inputType="number"
                    label="⚗️ pH max"
                    placeholder="7.0"
                />
            </div>
            <p className="text-xs text-gt-text-muted -mt-3">
                La majorité des plantes préfèrent un pH entre 5.5 et 7.
            </p>
        </section>
    )
}

function RightColumn() {
    return (
        <section className="flex flex-col gap-5 lg:flex-1">
            <h2 className="text-xl font-semibold text-gt-text">Conditions environnementales</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputForm<PlantPost>
                    name="temperatureMin"
                    inputType="number"
                    label="🌡 Temp. min (°C)"
                    placeholder="15"
                />
                <InputForm<PlantPost>
                    name="temperatureMax"
                    inputType="number"
                    label="🌡 Temp. max (°C)"
                    placeholder="25"
                />
            </div>

            <SwitchForm<PlantPost>
                name="humidityNeed"
                label="💦 Besoin en humidité élevé"
                helpText="Niveau d'humidité ambiante requis"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectForm<PlantPost>
                    name="bloomMonthStart"
                    label="🌸 Début floraison"
                    placeholder="Mois"
                    options={MONTH_OPTIONS}
                />
                <SelectForm<PlantPost>
                    name="bloomMonthEnd"
                    label="🌸 Fin floraison"
                    placeholder="Mois"
                    options={MONTH_OPTIONS}
                />
            </div>
            <p className="text-xs text-gt-text-muted -mt-3">
                Période de floraison de la plante
            </p>
        </section>
    )
}

function ToxicitySection() {
    return (
        <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gt-text">Sécurité et usage</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SwitchForm<PlantPost>
                    name="petToxic"
                    label="🐶 Toxique pour les animaux"
                    helpText="Dangereux pour chiens ou chats"
                />

                <SwitchForm<PlantPost>
                    name="humanToxic"
                    label="☠️ Toxique pour l'humain"
                    helpText="Nocive en cas d'ingestion ou contact"
                />

                <SwitchForm<PlantPost>
                    name="indoorFriendly"
                    label="🏠 Plante d'intérieur"
                    helpText="Adaptée à la culture en intérieur"
                />
            </div>
        </section>
    )
}

function Separator() {
    return <div className="border-t border-gt-border" />;
}

function SubmitButton({ isLoading }: { isLoading: boolean }) {
    return (
        <div className="lg:flex lg:justify-center">
            <button
                type="submit"
                disabled={isLoading}
                className="w-full lg:w-auto lg:px-12 lg:text-xl py-2 rounded-md bg-gt-yellow hover:bg-gt-yellow-dark
                text-gt-black mb-4 cursor-pointer hover:shadow-md transform transition duration-200 hover:scale-105 font-medium
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                {isLoading ? "Création en cours..." : "Créer la plante"}
            </button>
        </div>
    )
}