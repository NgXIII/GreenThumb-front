import LogoHeader from "@/shared/components/ui/customs/LogoHeader.tsx";
import ThemeToggle from "@/shared/components/layout/ThemeToggle.tsx";
import QuartetLeaves from "@/shared/components/ui/customs/QuartetLeaves.tsx";
import {Link, Navigate, useLocation} from "react-router-dom";
import {useForm} from "react-hook-form";
import {Form} from "@/shared/components/ui/form.tsx";
import {type ResetPasswordPost, ResetPasswordSchema} from "@/shared/types/schemas/resetPasswordSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import {ArrowLeft, KeyRound, Loader2} from "lucide-react";
import InputForm from "@/shared/components/ui/customs/InputForm.tsx";
import {Button} from "@/shared/components/ui/button.tsx";
import { useResetPassword } from "@/shared/hooks/useResetPassword";

export default function ResetPassword() {
    const location = useLocation();
    const { email } = location.state || {};

    if (!email) {
        return <Navigate to="/connexion/forgetPassword" replace />;
    }

    return (
        <main className="min-h-screen flex flex-col text-gt-text bg-gt-surface overflow-hidden transition-colors duration-300">
            <LogoHeader />

            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <ContentPage email={email} />
            </div>
        </main>
    );
}


interface ContentPageProps {
    email: string;
}


function ContentPage({ email }: ContentPageProps) {
    return (
        <section className="relative max-w-sm w-full">
            <QuartetLeaves
                positionLeave1="top-5 left-75"
                positionLeave2="top-40 -left-27"
                positionLeave3="-top-25 left-10"
                positionLeave4="top-95 left-10"
            />

            <div className="relative max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
                    <div className="w-16 h-16 rounded-full bg-gt-surface-elevated border border-gt-border flex items-center justify-center shadow-lg animate-in zoom-in duration-300 delay-200">
                        <KeyRound className="w-7 h-7 text-gt-text opacity-70" />
                    </div>
                </div>

                <section className="border border-gt-border rounded-xl bg-gt-surface-elevated shadow-sm pt-12 pb-8 px-6 sm:px-10 transition-colors duration-300">
                    <FormContent email={email} />
                </section>

                <div className="mt-6 text-center animate-in fade-in duration-500 delay-300">
                    <Link
                        to="/connexion"
                        className="inline-flex items-center gap-2 text-sm text-gt-text/60 hover:text-gt-text transition-colors duration-200 group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Retour à la connexion
                    </Link>
                </div>
            </div>
        </section>
    );
}


interface FormContentProps {
    email: string;
}

function FormContent({ email }: FormContentProps) {
    const { mutate: resetPassword, isPending, error } = useResetPassword();

    const form = useForm<ResetPasswordPost>({
        resolver: zodResolver(ResetPasswordSchema),
        mode: "all",
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: ResetPasswordPost) => {
        await resetPassword({
            password: data.password,
            confirmPassword: data.confirmPassword,
            email,
        });
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gt-text mb-3">
                    Nouveau mot de passe
                </h1>
                <p className="text-sm text-gt-text/60 leading-relaxed">
                    Choisissez un nouveau mot de passe sécurisé pour votre compte.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <InputForm
                        name="password"
                        label="Nouveau mot de passe"
                        inputType="password"
                        placeholder="••••••••"
                    />

                    <InputForm
                        name="confirmPassword"
                        label="Confirmer le mot de passe"
                        inputType="password"
                        placeholder="••••••••"
                    />

                    {error && (
                        <p className="text-sm text-red-500 text-center animate-in fade-in slide-in-from-top-2 duration-300">
                            {error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-11 font-medium transition-all duration-200 mt-2"
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Réinitialisation...
                            </span>
                        ) : (
                            "Réinitialiser le mot de passe"
                        )}
                    </Button>
                </form>
            </Form>

            <p className="text-xs text-gt-text/40 text-center mt-4">
                Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.
            </p>
        </div>
    );
}
