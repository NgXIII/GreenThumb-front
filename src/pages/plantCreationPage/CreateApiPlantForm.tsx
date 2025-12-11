import {Form} from "@/shared/components/ui/form.tsx";
import {useForm} from "react-hook-form";
import {type PlantApiPost, PlantApiSchema} from "@/shared/types/schemas/plantSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import type {PlantSearchResult} from "@/shared/types/plant.ts";

export type CreateApiPlantFormProps = {
    selectedPlant: PlantSearchResult | undefined;
}

export default function CreateApiPlantForm({ selectedPlant }: CreateApiPlantFormProps) {
    const form = useForm<PlantApiPost>({
        resolver: zodResolver(PlantApiSchema),
        mode: "all",
        defaultValues: {
            slug: selectedPlant?.slug,
            scientificName: selectedPlant?.scientificName,
            commonName: selectedPlant?.commonName,
            imageUrl: selectedPlant?.imageUrl,
            description: "",
            lifeCycle: "",
            waterNeed: "",
            light: false,
            soilType: "",
            soilPhMin: 0,
            soilPhMax: 0,
            temperatureMin: 0,
            temperatureMax: 0,
            humidityNeed: false,
            bloomMonth: "",
            petToxic: false,
            humanToxic: false,
            indoorFriendly: false
        }
    })

    return <>
        <Form {...form}>
            <form>

            </form>
        </Form>
    </>
}