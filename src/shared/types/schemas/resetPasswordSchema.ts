import * as z from "zod";

export const ResetPasswordSchema = z.object({
    password: z.string()
        .min(8, "Le mot de passe doit faire au moins 8 caractères")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
            "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
        ),
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

export type ResetPasswordPost = z.infer<typeof ResetPasswordSchema>;