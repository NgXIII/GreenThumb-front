import * as z from "zod";

export const PlantApiSchema = z.object({
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
    lifeCycle: z.string().max(100, "Le cycle de vie est trop grand").optional(),
    waterNeed: z.string().max(100, "Le besoin d'eau est trop grand").optional(),
    light: z.boolean().default(false),
    soilType: z.string().max(100, "Le soil est trop grand").optional(),
    soilPhMin: z.number(),
    soilPhMax: z.number(),
    temperatureMin: z.number().optional(),
    temperatureMax: z.number().optional(),
    humidityNeed: z.boolean().default(false),
    bloomMonth: z.string().max(100, "Le nom bloom"),
    petToxic: z.boolean().default(false),
    humanToxic: z.boolean().default(false),
    indoorFriendly: z.boolean().default(false),
});

export type PlantApiPost = z.input<typeof PlantApiSchema>;