import {useForm} from "react-hook-form";
import InputForm from "@/shared/components/ui/customs/InputForm.tsx";
import {type PasswordEditPost, PasswordEditSchema} from "@/shared/types/schemas/UserSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/shared/components/ui/form.tsx";
import LogoHeader from "@/shared/components/ui/customs/LogoHeader.tsx";
import QuartetLeaves from "@/shared/components/ui/customs/QuartetLeaves.tsx";
import {useNavigate} from "react-router-dom";
import {ArrowLeft} from "lucide-react";
import {toast} from "sonner";
import {AxiosError} from "axios";
import {useUserStore} from "@/app/stores/userStore.ts";
import {useEditPassword} from "@/shared/hooks/useUser.ts";

export default function EditPassword() {
    const { user } = useUserStore.getState();
    const { editPassword } = useEditPassword();
    const navigate = useNavigate();
    const form = useForm<PasswordEditPost>({
        resolver: zodResolver(PasswordEditSchema),
        mode: "all",
        defaultValues: {
            password: "",
            confirmPassword: "",
        }
    })

    const onSubmit = async (values: PasswordEditPost) => {
        try {
            const response = await editPassword(user?.username, values)

            toast.success(response.message)
            navigate("/profil")
        } catch (error) {
            console.error(error)

            if (error instanceof AxiosError) {
                if (error.response?.data?.message) {
                    toast.error(error.response.data.message)
                } else if (error.message) {
                    toast.error(error.message)
                } else {
                    toast.error("Erreur lors de la mise à jour du mot de passe")
                }
            } else if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("Erreur lors de la mise à jour du mot de passe")
            }
        }
    }

    return (
        <main className="min-h-screen flex flex-col text-gt-text bg-gt-surface overflow-hidden transition-colors duration-300">
            <LogoHeader />

            <div className="flex-1 flex flex-col items-center px-4">
                <div className="w-full max-w-2xl relative">
                    <QuartetLeaves
                        positionLeave1="top-5 left-147"
                        positionLeave2="top-40 -left-27"
                        positionLeave3="-top-28 left-70"
                        positionLeave4="top-90 left-30"
                    />

                    <section className="border border-gt-border rounded-md bg-gt-surface-elevated shadow-xs
                                     px-4 sm:px-10 py-6 mb-8 relative z-10
                                     transition-colors duration-300"
                    >
                        {/* Back Button */}
                        <button
                            onClick={() => navigate('/profil')}
                            className="flex items-center gap-2 text-gt-text-accent hover:text-gt-primary transition-colors mb-4 cursor-pointer"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="text-sm">Retour</span>
                        </button>

                        <h1 className="text-2xl font-semibold mt-4 mb-6 text-center lg:text-left lg:text-[2rem] text-gt-text">
                            Modification du mot de passe
                        </h1>

                        <Form {...form}>
                            <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex flex-col gap-5">
                                    <InputForm name="password" label="Nouveau mot de passe*" inputType="password" placeholder="*********" />
                                    <InputForm name="confirmPassword" inputType="password" label="Confirmer le mot de passe*" placeholder="*********" />
                                </div>

                                <div className="lg:flex lg:justify-center">
                                    <button
                                        type="submit"
                                        className="w-full lg:w-auto lg:px-12 lg:text-xl py-2 rounded-md bg-gt-yellow hover:bg-gt-yellow-dark
                                        text-gt-black mb-4 cursor-pointer hover:shadow-md transform transition duration-200 hover:scale-105 font-medium"
                                    >
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </Form>
                    </section>
                </div>
            </div>
        </main>
    )
}