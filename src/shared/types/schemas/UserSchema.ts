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
            .string()
            .optional()
            .refine((base64) => {
                if (!base64) return true;
                return base64.startsWith('data:image/');
            }, {
                message: "L'image doit être au format base64 valide"
            })
            .refine((base64) => {
                if (!base64) return true;
                const match = base64.match(/^data:image\/(png|jpeg|jpg);base64,/);
                return match !== null;
            }, {
                message: "L'image doit être PNG, JPG ou JPEG"
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
            .min(8, "Le mot de passe doit faire au moins 8 caractères"),
        rememberMe: z.boolean().optional()
    })

export type UserConnectionPost = z.infer<typeof UserConnectionSchema>

export const UserResetPasswordEmailSchema = z
    .object({
        email: z
            .email("L'email n'est pas valide")
            .min(1, "L'email est obligatoire"),
    })

export type UserResetPasswordEmailPost = z.infer<typeof UserResetPasswordEmailSchema>
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
                (value) => {
                    if (!value || value.trim() === '') return true;
                    return value.trim().split(/\s+/).filter(word => word.length > 0).length <= 45;
                },
                {
                    message: "La biographie ne peut pas dépasser 45 mots.",
                }
            )
            .optional(),
        avatar: z
            .union([
                z.string(),
                z.instanceof(File),
                z.null()
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

export const PasswordEditSchema = z
    .object({
        password: z.string()
            .min(8, "Le mot de passe doit faire au moins 8 caractères")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
                "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
            ),
        confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    })

export type PasswordEditPost = z.infer<typeof PasswordEditSchema>
