import ThemeToggle from "@/shared/components/layout/ThemeToggle.tsx";
import LogoHeader from "@/shared/components/ui/customs/LogoHeader.tsx";
import {useForm} from "react-hook-form";
import {Form} from "@/shared/components/ui/form.tsx";
import InputForm from "@/shared/components/ui/customs/InputForm.tsx";
import {type UserResetPasswordEmailPost, UserResetPasswordEmailSchema} from "@/shared/types/schemas/UserSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {type FormEvent, useState} from "react";
import {ArrowLeft, CheckCircle2, Loader2, Mail, Send} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {Link, useNavigate} from "react-router-dom";
import useResetCode from "@/shared/hooks/useResetCode.ts";
import useCodeVerification from "@/shared/hooks/useCodeVerification.ts";
import {toast} from "sonner";
import QuartetLeaves from "@/shared/components/ui/customs/QuartetLeaves.tsx";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ForgetPasswordPage() {
    return (
        <main className="min-h-screen flex flex-col text-gt-text bg-gt-surface overflow-hidden transition-colors duration-300">
            <LogoHeader />

            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <ContentPage />
            </div>
        </main>
    )
}

function ContentPage() {
    const [formState, setFormState] = useState<FormStatus>("idle");
    const [submittedEmail, setSubmittedEmail] = useState("");

    return (
        <section className="relative max-w-sm w-full">
            <QuartetLeaves
                positionLeave1="top-5 left-70"
                positionLeave2="top-40 -left-27"
                positionLeave3="-top-25 left-10"
                positionLeave4="top-75 left-10"
            />

            <div className="relative max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

                <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
                    <div className="w-16 h-16 rounded-full bg-gt-surface-elevated border border-gt-border flex items-center justify-center shadow-lg animate-in zoom-in duration-300 delay-200">
                        <Mail className="w-7 h-7 text-gt-text opacity-70" />
                    </div>
                </div>

                <section className="border border-gt-border rounded-xl bg-gt-surface-elevated shadow-sm pt-12 pb-8 px-6 sm:px-10 transition-colors duration-300">
                    {formState === "success" ? (
                        <SuccessState email={submittedEmail} />
                    ) : (
                        <FormContent
                            formState={formState}
                            setFormState={setFormState}
                            setSubmittedEmail={setSubmittedEmail}
                        />
                    )}
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
    formState: FormStatus;
    setFormState: (state: FormStatus) => void;
    setSubmittedEmail: (email: string) => void;
}

function FormContent({ formState, setFormState, setSubmittedEmail }: FormContentProps) {
    const { sendResetCode } = useResetCode();

    const form = useForm<UserResetPasswordEmailPost>({
        resolver: zodResolver(UserResetPasswordEmailSchema),
        mode: "all",
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: UserResetPasswordEmailPost) => {
        setFormState("loading");

        const success = await sendResetCode(data.email);

        if (success) {
            setSubmittedEmail(data.email);
            setFormState("success");
        } else {
            setFormState("error");
        }
    };

    const isLoading = formState === "loading";

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gt-text mb-3">
                    Mot de passe oublié ?
                </h1>
                <p className="text-sm text-gt-text/60 leading-relaxed">
                    Entrez votre adresse e-mail et nous vous enverrons un lien pour
                    réinitialiser votre mot de passe.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    <InputForm
                        name="email"
                        label="votre email"
                        inputType="email"
                        placeholder="joe.doe@gmail.com"

                    />

                    {formState === "error" && (
                        <p className="text-sm text-red-500 text-center animate-in fade-in slide-in-from-top-2 duration-300">
                            Une erreur est survenue. Veuillez réessayer.
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 font-medium transition-all duration-200"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Envoi en cours...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Send className="w-4 h-4" />
                                Envoyer le lien
                            </span>
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

function SuccessState({ email }: { email: string }) {
    const [code, setCode] = useState("");
    const [isResending, setIsResending] = useState(false);
    const { sendResetCode } = useResetCode();
    const { verifyCode, loading: isVerifying  } = useCodeVerification();
    const navigate = useNavigate();

    const handleResendCode = async () => {
        setIsResending(true);

        const sucess = await sendResetCode(email);

        if (sucess) {
            toast.success("Code renvoyé avec succès !");
        } else {
            toast.error("Impossible de renvoyer le code. Veuillez réessayer.");
        }

        setIsResending(false);
    }

    const handleSubmitCode = async (event: FormEvent) => {
        event.preventDefault();

        if (!code.trim()) {
            toast.error("Veuillez entrer le code reçu par e-mail.");
            return;
        }

        const success = await verifyCode(code, email)

        if (success) {
            toast.success("Code vérifié avec succès !");
            navigate("/connexion/reset-password", {
                state: { email }
            });
        } else {
            toast.error("Code incorrect. Veuillez réessayer.");
        }
    }
    return (
        <div className="py-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-green-500/10 mx-auto mb-6 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold text-gt-text mb-3">
                    E-mail envoyé !
                </h2>

                <p className="text-sm text-gt-text/60 mb-2">
                    Nous avons envoyé un code de réinitialisation à :
                </p>

                <p className="text-sm font-medium text-gt-text break-all">
                    {email}
                </p>
            </div>

            <form onSubmit={handleSubmitCode} className="space-y-4 mb-6">
                <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gt-text/70 mb-2">
                        Code de vérification
                    </label>
                    <input
                        id="code"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Entrez le code reçu"
                        className="w-full h-11 px-4 rounded-lg border border-gt-border bg-gt-surface text-gt-text placeholder:text-gt-text/40 focus:outline-none focus:ring-2 focus:ring-gt-primary/50 focus:border-gt-primary transition-all duration-200"
                        maxLength={6}
                        disabled={isVerifying}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full h-11 font-medium transition-all duration-200"
                    disabled={!code.trim() || isVerifying}
                >
                    {isVerifying ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Vérification...
                        </span>
                    ) : (
                        "Vérifier le code"
                    )}
                </Button>
            </form>

            <div className="text-center pt-4 border-t border-gt-border">
                <p className="text-xs text-gt-text/50 mb-3">
                    Vous n'avez pas reçu l'e-mail ? Vérifiez vos spams ou
                </p>

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="inline-flex items-center gap-2"
                >
                    {isResending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Envoi en cours...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Renvoyer le code
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}