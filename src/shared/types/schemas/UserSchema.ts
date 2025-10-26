import * as z from 'zod'

export const UserCreationSchema = z
    .object({
        username: z.string().min(1, "Le nom d'utilisateur est obligatoire"),
        firstname: z.string().min(1, "Le prénom est obligatoire"),
        lastname: z.string().min(1, "Le nom de famille est obligatoire"),
        password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
        confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
        email: z.email("L'email n'est pas valide").min(1, "L'email est obligatoire"),
        phoneNumber: z
            .string()
            .min(1, "Le téléphone est obligatoire")
            .regex(/^\d{10,}$/, "Le téléphone doit contenir uniquement des chiffres"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    })

export type UserCreationPost = z.infer<typeof UserCreationSchema>