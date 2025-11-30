import { useAuth } from "@/shared/hooks/useAuth.ts";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { Mail, CheckCircle, Loader2, Clock } from "lucide-react";
import { AxiosError } from "axios";

const ERROR_MESSAGES = {
    INVALID_CODE: "Code de vérification invalide, expiré ou nombre maximum de tentatives dépassé",
    ALREADY_VERIFIED: "Votre compte est déjà vérifié. Vous pouvez vous connecter normalement.",
    RATE_LIMIT_EXCEEDED: "Vous avez atteint le nombre maximum de demandes de code. Veuillez réessayer dans une heure.",
    INVALID_FORMAT: "Le code doit contenir exactement 6 chiffres",
    NETWORK_ERROR: "Erreur de connexion. Veuillez réessayer.",
    SUCCESS: "Votre compte a été vérifié avec succès. Vous pouvez maintenant vous connecter.",
    RESEND_SUCCESS: "Un nouvel email de vérification a été envoyé",
    EMAIL_REQUIRED: "Veuillez entrer votre adresse e-mail",
    CODE_REQUIRED: "Veuillez entrer le code de vérification",
    CODE_EXPIRED: "Le code a expiré. Veuillez en demander un nouveau.",
};

const CODE_REGEX = /^\d{6}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TIMER_DURATION = 15 * 60;
const RESEND_COOLDOWN = 60;

export default function VerifyEmailForm() {
    const { verify, resendVerification } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [verificationComplete, setVerificationComplete] = useState(false);

    const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
    const [resendCooldown, setResendCooldown] = useState(0);

    const [emailError, setEmailError] = useState("");
    const [codeError, setCodeError] = useState("");

    const codeInputRef = useRef<HTMLInputElement>(null);
    // @ts-ignore
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    // @ts-ignore
    const resendIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const emailFromParams = searchParams.get("email");
        const emailFromStorage = localStorage.getItem("pendingVerificationEmail");

        if (emailFromParams) {
            setEmail(emailFromParams);
            localStorage.setItem("pendingVerificationEmail", emailFromParams);
        } else if (emailFromStorage) {
            setEmail(emailFromStorage);
        }

        if (codeInputRef.current) {
            codeInputRef.current.focus();
        }
    }, [searchParams]);

    useEffect(() => {
        timerIntervalRef.current = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    if (timerIntervalRef.current) {
                        clearInterval(timerIntervalRef.current);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (resendCooldown > 0) {
            resendIntervalRef.current = setInterval(() => {
                setResendCooldown((prev) => {
                    if (prev <= 1) {
                        if (resendIntervalRef.current) {
                            clearInterval(resendIntervalRef.current);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (resendIntervalRef.current) {
                clearInterval(resendIntervalRef.current);
            }
        };
    }, [resendCooldown]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const validateEmail = useCallback((value: string): boolean => {
        if (!value) {
            setEmailError(ERROR_MESSAGES.EMAIL_REQUIRED);
            return false;
        }
        if (!EMAIL_REGEX.test(value)) {
            setEmailError("Veuillez entrer une adresse e-mail valide");
            return false;
        }
        setEmailError("");
        return true;
    }, []);

    const validateCode = useCallback((value: string): boolean => {
        if (!value) {
            setCodeError(ERROR_MESSAGES.CODE_REQUIRED);
            return false;
        }
        if (!CODE_REGEX.test(value)) {
            setCodeError(ERROR_MESSAGES.INVALID_FORMAT);
            return false;
        }
        setCodeError("");
        return true;
    }, []);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (emailError) {
            validateEmail(value);
        }
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 6) {
            setCode(value);
            if (codeError && value.length === 6) {
                validateCode(value);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isEmailValid = validateEmail(email);
        const isCodeValid = validateCode(code);

        if (!isEmailValid || !isCodeValid) {
            return;
        }

        if (timeRemaining === 0) {
            toast.error(ERROR_MESSAGES.CODE_EXPIRED);
            return;
        }

        setIsVerifying(true);

        try {
            const response = await verify(email, code);

            if (response.verified) {
                setVerificationComplete(true);
                toast.success(ERROR_MESSAGES.SUCCESS);

                localStorage.removeItem("pendingVerificationEmail");

                setTimeout(() => {
                    navigate("/connexion");
                }, 3000);
            }
        } catch (error) {
            setCode("");
            if (codeInputRef.current) {
                codeInputRef.current.focus();
            }

            if (error instanceof AxiosError) {
                const errorMessage = error?.response?.data?.message || error?.response?.data?.error || "";

                if (errorMessage.includes("déjà vérifié") || errorMessage.includes("already verified")) {
                    toast.info(ERROR_MESSAGES.ALREADY_VERIFIED);
                    setTimeout(() => navigate("/connexion"), 2000);
                } else if (errorMessage.includes("rate limit") || errorMessage.includes("trop de tentatives")) {
                    toast.error(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
                } else if (errorMessage.includes("invalide") || errorMessage.includes("expiré") || errorMessage.includes("invalid") || errorMessage.includes("expired")) {
                    toast.error(ERROR_MESSAGES.INVALID_CODE);
                } else {
                    toast.error(ERROR_MESSAGES.NETWORK_ERROR);
                }
            } else {
                toast.error(ERROR_MESSAGES.NETWORK_ERROR);
            }
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (!validateEmail(email)) {
            return;
        }

        if (resendCooldown > 0) {
            return;
        }

        setIsResending(true);

        try {
            await resendVerification(email);
            toast.success(ERROR_MESSAGES.RESEND_SUCCESS);

            setTimeRemaining(TIMER_DURATION);

            setResendCooldown(RESEND_COOLDOWN);

            setCode("");
            if (codeInputRef.current) {
                codeInputRef.current.focus();
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error?.response?.data?.message || error?.response?.data?.error || "";

                if (errorMessage.includes("rate limit") || errorMessage.includes("trop de")) {
                    toast.error(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
                } else if (errorMessage.includes("déjà vérifié") || errorMessage.includes("already verified")) {
                    toast.info(ERROR_MESSAGES.ALREADY_VERIFIED);
                    setTimeout(() => navigate("/connexion"), 2000);
                } else {
                    toast.error("Erreur lors de l'envoi du code. Veuillez réessayer.");
                }
            } else {
                toast.error(ERROR_MESSAGES.NETWORK_ERROR);
            }
        } finally {
            setIsResending(false);
        }
    };

    const isFormValid = EMAIL_REGEX.test(email) && CODE_REGEX.test(code) && timeRemaining > 0;

    if (verificationComplete) {
        return (
            <div className="flex flex-col items-center justify-center py-8 gap-6">
                <CheckCircle className="w-16 h-16 text-gt-green" />
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gt-green mb-2">
                        Compte vérifié avec succès !
                    </h2>
                    <p className="text-gt-text-secondary">
                        Redirection vers la page de connexion...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex justify-center mb-2">
                <Mail className="w-16 h-16 text-gt-green" />
            </div>

            <div className="text-center space-y-2">
                <p className="text-base text-gt-text">
                    Un code de vérification à 6 chiffres a été envoyé à votre adresse e-mail.
                </p>
                <p className="text-sm text-gt-text-secondary">
                    Veuillez entrer ce code ci-dessous pour activer votre compte.
                </p>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center justify-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gt-text-secondary" />
                <span className={`font-mono ${timeRemaining < 60 ? "text-red-500 font-semibold" : "text-gt-text-secondary"}`}>
                    Temps restant : {formatTime(timeRemaining)}
                </span>
            </div>

            {timeRemaining === 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-center">
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {ERROR_MESSAGES.CODE_EXPIRED}
                    </p>
                </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gt-text">
                    Adresse e-mail
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => validateEmail(email)}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gt-green
                        bg-gt-surface text-gt-text transition-colors
                        ${emailError ? "border-red-500" : "border-gt-border"}`}
                    placeholder="votre@email.com"
                    aria-label="Adresse e-mail"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                    disabled={isVerifying}
                />
                {emailError && (
                    <p id="email-error" className="text-sm text-red-500 dark:text-red-400" role="alert">
                        {emailError}
                    </p>
                )}
            </div>

            {/* 6-Digit Code Input */}
            <div className="space-y-2">
                <label htmlFor="code" className="block text-sm font-medium text-gt-text">
                    Code de vérification (6 chiffres)
                </label>
                <input
                    ref={codeInputRef}
                    type="text"
                    id="code"
                    name="code"
                    value={code}
                    onChange={handleCodeChange}
                    onBlur={() => validateCode(code)}
                    className={`w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border rounded-md
                        focus:outline-none focus:ring-2 focus:ring-gt-green
                        bg-gt-surface text-gt-text transition-colors
                        ${codeError ? "border-red-500" : "border-gt-border"}`}
                    placeholder="123456"
                    maxLength={6}
                    inputMode="numeric"
                    pattern="\d{6}"
                    aria-label="Code de vérification à 6 chiffres"
                    aria-invalid={!!codeError}
                    aria-describedby={codeError ? "code-error" : undefined}
                    disabled={isVerifying || timeRemaining === 0}
                    autoComplete="off"
                />
                {codeError && (
                    <p id="code-error" className="text-sm text-red-500 dark:text-red-400" role="alert">
                        {codeError}
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!isFormValid || isVerifying}
                className="w-full py-3 rounded-md bg-gt-green hover:bg-green-700 text-white font-semibold
                    cursor-pointer hover:shadow-md transform transition duration-200 hover:scale-105
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                    flex items-center justify-center gap-2"
                aria-label="Vérifier le code"
            >
                {isVerifying ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Vérification en cours...</span>
                    </>
                ) : (
                    <span>Vérifier mon compte</span>
                )}
            </button>

            {/* Resend Code Section */}
            <div className="border-t border-gt-border pt-6 mt-4">
                <p className="text-sm text-gt-text-secondary mb-4 text-center">
                    Vous n'avez pas reçu le code ?
                </p>
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending || resendCooldown > 0 || !email}
                    className="w-full py-2 rounded-md bg-gt-yellow hover:bg-yellow-500
                        text-gt-white cursor-pointer hover:shadow-md transform transition duration-200 hover:scale-105
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                        flex items-center justify-center gap-2"
                    aria-label="Renvoyer le code de vérification"
                >
                    {isResending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Envoi en cours...</span>
                        </>
                    ) : resendCooldown > 0 ? (
                        <span>Renvoyer le code ({resendCooldown}s)</span>
                    ) : (
                        <span>Renvoyer le code de vérification</span>
                    )}
                </button>
            </div>
        </form>
    );
}