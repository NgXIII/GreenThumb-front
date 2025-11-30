import {useForm, useFormContext} from "react-hook-form";
import {type UserCreationPost, UserCreationSchema} from "@/shared/types/schemas/UserSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField, FormItem} from "@/shared/components/ui/form.tsx";
import InputForm from "@/shared/components/ui/customs/InputForm.tsx";
import InputFile from "@/shared/components/ui/customs/InputFile.tsx";
import {useAuth} from "@/shared/hooks/useAuth.ts";
import {fileToBase64} from "@/shared/utils/FileIntoBase64.ts";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";

export default function RegisterForm() {
    const {register} = useAuth()
    const navigate = useNavigate()
    const form = useForm<UserCreationPost>({
        resolver: zodResolver(UserCreationSchema),
        mode: "all",
        defaultValues: {
            username: "",
            firstname: "",
            lastname: "",
            password: "",
            confirmPassword: "",
            email: "",
            phoneNumber: "",
        }
    })

    const submit = async (values: UserCreationPost) => {
        if (values.avatar instanceof File) {
            values.avatar = await fileToBase64(values.avatar);
        }

        try {
            await register(values)
            toast.success("Inscription réussie ! Veuillez vérifier votre adresse e-mail.")
            navigate(`/verify-email?email=${encodeURIComponent(values.email)}`)
        } catch {
            toast.error("Erreur lors de l'inscription. Veuillez réessayer.")
        }
    }

    return (
        <Form {...form}>
            <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(submit)}>
                <div className="flex flex-col gap-5 lg:flex-row lg:gap-10">
                    <LeftColumn />

                    <Separator />

                    <RightColumn />
                </div>

                <TermsCheckbox />

                <SubmitButton />
            </form>
        </Form>
    )
}

function LeftColumn() {
    return (
        <section className="flex flex-col gap-5 lg:flex-1">
            <InputForm name="username" inputType="text" placeholder="PlantQueen" label="Nom d'utilisateur*" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputForm name="lastname" inputType="text" placeholder="Aerts" label="Nom*" />
                <InputForm name="firstname" inputType="text" placeholder="Emelie" label="Prénom*" />
            </div>
            <InputForm name="password" inputType="password" label="Mot de passe*" placeholder="*********" />
            <InputForm name="confirmPassword" inputType="password" label="Confirmer le mot de passe*" placeholder="*********" />
        </section>
    );
}

function Separator() {
    return (
        <>
            <div className="hidden lg:block border-l border-gt-border self-stretch" />
            <div className="lg:hidden border-t border-gt-border mt-1" />
        </>
    );
}

function RightColumn() {
    return (
        <section className="flex flex-col gap-5 lg:flex-1">
            <InputFile label="Photo de profil" name="avatar" />
            <InputForm name="email" inputType="email" label="E-mail*" placeholder="emilie.aerts@gmail.com" />
            <InputForm name="phoneNumber" inputType="tel" label="Téléphone*" placeholder="0123456789" />
        </section>
    );
}

function TermsCheckbox() {
    const form = useFormContext<UserCreationPost>();

    return (
        <FormField
            control={form.control}
            name="terms"
            render={({ field, fieldState }) => (
                <FormItem>
                    <div className="flex items-start gap-2">
                        <div className="checkbox-wrapper-19">
                            <input
                                id="cb-terms"
                                type="checkbox"
                                checked={!!field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                            />
                            <label htmlFor="cb-terms" className="check-box" />
                        </div>
                        {fieldState.error ? (
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-sm text-red-500">
                                    J'accepte les{" "}
                                    <a href="#" className="underline">
                                        Conditions générales d'utilisation
                                    </a>{" "}
                                    et la{" "}
                                    <a href="#" className="underline">
                                        Politique de Confidentialité
                                    </a>
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm text-gt-text">
                                    J'accepte les{" "}
                                    <a href="#" className="underline text-gt-text-accent hover:text-gt-primary transition-colors">
                                        Conditions générales d'utilisation
                                    </a>{" "}
                                    et la{" "}
                                    <a href="#" className="underline text-gt-text-accent hover:text-gt-primary transition-colors">
                                        Politique de Confidentialité
                                    </a>
                                </p>
                            </div>
                        )}
                    </div>
                </FormItem>
            )}
        />
    )
}

function SubmitButton() {
    return (
        <div className="lg:flex lg:justify-center">
            <button
                type="submit"
                className="w-full lg:w-auto lg:px-12 lg:text-xl py-2 rounded-md bg-gt-yellow hover:bg-gt-yellow-dark
                text-gt-black mb-4 cursor-pointer hover:shadow-md transform transition duration-200 hover:scale-105 font-medium"
            >
                S'inscrire
            </button>
        </div>
    );
}