import { z } from "zod";

export const createChannelSchema = z.object({
    name: z.string()
        .min(1, "Le nom du channel est requis")
        .min(3, "Le nom doit contenir au moins 3 caractères")
        .max(50, "Le nom ne peut pas dépasser 50 caractères"),
    description: z.string()
        .min(1, "La description est requise")
        .min(10, "La description doit contenir au moins 10 caractères")
        .max(500, "La description ne peut pas dépasser 500 caractères"),
});

export type CreateChannelFormData = z.infer<typeof createChannelSchema>;

export const createThreadSchema = z.object({
    title: z.string()
        .min(1, "Le titre du thread est requis")
        .min(5, "Le titre doit contenir au moins 5 caractères")
        .max(100, "Le titre ne peut pas dépasser 100 caractères"),
});

export type CreateThreadFormData = z.infer<typeof createThreadSchema>;
