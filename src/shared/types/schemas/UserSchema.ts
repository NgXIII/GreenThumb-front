import * as z from "zod";

const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg"]

export const UserCreationSchema = z
    .object({
        username: z.string().min(1, "Le nom d'utilisateur est obligatoire"),
        firstname: z.string().min(1, "Le prénom est obligatoire"),
        lastname: z.string().min(1, "Le nom de famille est obligatoire"),
        password: z.string()
            .min(8, "Le mot de passe doit faire au moins 8 caractères")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
                "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
            ),
        confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
        email: z.email("L'email n'est pas valide").min(1, "L'email est obligatoire"),
        phoneNumber: z
            .string()
            .min(1, "Le numéro de téléphone est obligatoire")
            .regex(/^\d{10,}$/, "Veuillez encoder un numéro de téléphone valide"),
        terms: z.literal(true, "Vous devez accepter les conditions pour continuer"),
        avatar: z
            .any()
            .optional()
            .refine((file) => !file || file instanceof File, {
                message: "Fichier invalide",
                path: ["avatar"],
            })
            .refine((file?: File) => !file || allowedImageTypes.includes(file.type), {
                message: "L'image doit être PNG, JPG ou JPEG",
                path: ["avatar"],
            }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    })

export type UserCreationPost = z.infer<typeof UserCreationSchema>

export const UserConnectionSchema = z
    .object({
        login: z
            .string()
            .min(1, "le login est requis"),
        password: z.string()
            .min(8, "Le mot de passe doit faire au moins 8 caractères")
    })

export type UserConnectionPost = z.infer<typeof UserConnectionSchema>

export const UserEditSchema = z
    .object({
        username: z.string().min(1, "Le nom d'utilisateur est obligatoire"),
        firstname: z.string().min(1, "Le prénom est obligatoire"),
        lastname: z.string().min(1, "Le nom de famille est obligatoire"),
        email: z.email("L'email n'est pas valide").min(1, "L'email est obligatoire"),
        phoneNumber: z
            .string()
            .min(1, "Le numéro de téléphone est obligatoire")
            .regex(/^\d{10,}$/, "Veuillez encoder un numéro de téléphone valide"),
        biography: z
            .string()
            .refine(
                (value) => value.trim().split(/\s+/).length <= 45,
                {
                    message: "La biographie ne peut pas dépasser 45 mots.",
                }
            ),
        avatar: z
            .union([
                z.url(),
                z.instanceof(File),
            ])
            .optional()
            .refine(
                (file) => {
                    if (!file || typeof file === 'string') return true;
                    return allowedImageTypes.includes(file.type);
                },
                {
                    message: "L'image doit être PNG, JPG ou JPEG",
                }
            ),
    })

export type UserEditPost = z.infer<typeof UserEditSchema>
