import * as z from "zod";

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
    temperatureMin: z.number(),
    temperatureMax: z.number(),
    humidityNeed: z.boolean().default(false),
    bloomMonthStart: z.string(),
    bloomMonthEnd: z.string(),
    petToxic: z.boolean().default(false),
    humanToxic: z.boolean().default(false),
    indoorFriendly: z.boolean().default(false),
});

export type PlantPost = z.input<typeof PlantSchema>;