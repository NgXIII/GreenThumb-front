import * as z from "zod";

const MONTHS = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const getMonthIndex = (month: string): number => {
    return MONTHS.findIndex(m => m.toLowerCase() === month.toLowerCase());
};

export const PlantSchema = z.object({
    slug: z.string().min(1, "Le slug est obligatoire"),
    scientificName: z.string().min(1, "Le nom scientifique est obligatoire"),
    commonName: z.string().min(1, "Le nom de la plante est obligatoire"),
    imageUrl: z.string().min(1, "L'image est obligatoire"),
    description: z
        .string()
        .refine(
            (value) => {
                if (!value || value.trim() === '') return true;
                return value.trim().split(/\s+/).filter(word => word.length > 0).length <= 45;
            },
            {
                message: "La description ne peut pas dépasser 45 mots.",
            }
        )
        .optional(),
    lifeCycle: z.string(),
    waterNeed: z.string(),
    lightLevel: z.string(),
    soilType: z.string(),
    soilPhMin: z.number(),
    soilPhMax: z.number(),
    username: z.string().min(1),
    temperatureMin: z.number(),
    temperatureMax: z.number(),
    humidityNeed: z.boolean().default(false),
    bloomMonthStart: z.string(),
    bloomMonthEnd: z.string(),
    petToxic: z.boolean().default(false),
    humanToxic: z.boolean().default(false),
    indoorFriendly: z.boolean().default(false),
}).refine(
    (data) => data.soilPhMax > data.soilPhMin,
    {
        message: "Le pH maximum doit être supérieur au pH minimum",
        path: ["soilPhMax"],
    }
).refine(
    (data) => data.temperatureMax > data.temperatureMin,
    {
        message: "La température maximum doit être supérieure à la température minimum",
        path: ["temperatureMax"],
    }
).refine(
    (data) => {
        const startIndex = getMonthIndex(data.bloomMonthStart);
        const endIndex = getMonthIndex(data.bloomMonthEnd);

        if (startIndex === -1 || endIndex === -1) return true;

        return endIndex > startIndex;
    },
    {
        message: "Le mois de fin de floraison doit être après le mois de début de floraison",
        path: ["bloomMonthEnd"],
    },
);

export type PlantPost = z.input<typeof PlantSchema>;