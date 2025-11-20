import {useAuth} from "@/shared/hooks/useAuth.ts";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useState, useEffect, useRef} from "react";
import {toast} from "sonner";
import {Mail, CheckCircle, Loader2} from "lucide-react";

export default function VerifyEmailForm() {
    const {verify, resendVerification} = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isResending, setIsResending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationComplete, setVerificationComplete] = useState(false);

    const hasVerified = useRef(false);

    const email = searchParams.get("email") || "";
    const token = searchParams.get("token");


    useEffect(() => {
        if (token && !hasVerified.current) {
            hasVerified.current = true;
            handleVerification(token);
        } else {
            console.log("🟡 Vérification ignorée:", {
                hasToken: !!token,
                hasVerified: hasVerified.current
            });
        }
    }, [token]);

    const handleVerification = async (verificationToken: string) => {
        setIsVerifying(true);
        // @ts-ignore
        try {
            await verify(verificationToken);
            setVerificationComplete(true);
            toast.success("Votre compte a été vérifié avec succès !");

            // Redirect vers la page de connexion après 2 secondes
            setTimeout(() => {
                navigate("/connexion");
            }, 2000);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message;

            if (errorMessage?.includes("déjà vérifié")) {
                toast.info("Votre compte est déjà vérifié. Redirection...");
                setTimeout(() => navigate("/connexion"), 1500);
            } else if (errorMessage?.includes("invalide") || errorMessage?.includes("expiré")) {
                toast.error("Le lien de vérification est invalide ou expiré.");
            } else {
                toast.error("Erreur lors de la vérification. Veuillez réessayer.");
            }

            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            toast.error("Impossible de renvoyer l'e-mail. Adresse e-mail manquante.");
            return;
        }

        setIsResending(true);
        try {
            await resendVerification(email);
            toast.success("Un nouvel e-mail de vérification a été envoyé !");
        } catch (error) {
            toast.error("Erreur lors de l'envoi de l'e-mail. Veuillez réessayer.");
        } finally {
            setIsResending(false);
        }
    };

    if (isVerifying || verificationComplete) {
        return (
            <div className="flex flex-col items-center justify-center py-8 gap-6">
                {verificationComplete ? (
                    <>
                        <CheckCircle className="w-16 h-16 text-gt-green" />
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-gt-green mb-2">
                                Compte vérifié avec succès !
                            </h2>
                            <p className="text-gray-600">
                                Redirection vers la page de connexion...
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <Loader2 className="w-16 h-16 text-gt-green animate-spin" />
                        <div className="text-center">
                            <h2 className="text-xl font-semibold mb-2">
                                Vérification en cours...
                            </h2>
                            <p className="text-gray-600">
                                Veuillez patienter pendant que nous validons votre compte.
                            </p>
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-center mb-4">
                <Mail className="w-16 h-16 text-gt-green" />
            </div>

            <div className="text-center space-y-3">
                <p className="text-base">
                    Un e-mail de vérification a été envoyé à{" "}
                    <span className="font-semibold text-gt-green">{email || "votre adresse e-mail"}</span>.
                </p>
                <p className="text-sm text-gray-600">
                    Cliquez sur le lien dans l'e-mail pour activer votre compte.
                </p>
                <p className="text-xs text-gray-500 italic">
                    Le lien est valide pendant 24 heures.
                </p>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-4">
                <p className="text-sm text-gray-600 mb-4 text-center">
                    Vous n'avez pas reçu l'e-mail ?
                </p>
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="w-full py-2 rounded-md bg-gt-yellow hover:bg-yellow-500
                    text-gt-white cursor-pointer hover:shadow-md transform transition duration-200 hover:scale-105
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {isResending ? "Envoi en cours..." : "Renvoyer l'e-mail de vérification"}
                </button>
            </div>
        </div>
    );
}