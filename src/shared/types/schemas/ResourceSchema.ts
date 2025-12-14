import * as z from "zod";

const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg"];

export const ResourceCreationSchema = z.object({
    title: z.string().min(1, "Le titre est obligatoire"),
    summary: z.string().min(1, "Le résumé est obligatoire").max(255, "Le résumé ne peut pas dépasser 255 caractères"),
    content: z.string().min(1, "Le contenu est obligatoire"),
    picture: z
        .union([
            z.instanceof(File),
            z.string(),
            z.null(),
            z.undefined()
        ])
        .optional()
        .refine((file) => {
            if (!file) return true;
            if (typeof file === 'string') return true;
            if (file instanceof File) return allowedImageTypes.includes(file.type);
            return false;
        }, {
            message: "L'image doit être PNG, JPG ou JPEG",
        }),
});

export type ResourceCreationPost = z.infer<typeof ResourceCreationSchema>;
