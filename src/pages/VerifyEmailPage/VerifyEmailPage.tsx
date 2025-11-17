import {Link, useSearchParams} from "react-router-dom";
import QuartetLeaves from "@/shared/components/ui/customs/QuartetLeaves.tsx";
import VerifyEmailForm from "@/pages/VerifyEmailPage/VerifyEmailForm.tsx";
import LogoHeader from "@/shared/components/ui/customs/LogoHeader.tsx";

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const hasToken = searchParams.has("token");

    return (
        <main className="min-h-screen flex flex-col text-black bg-[linear-gradient(to_bottom,#faf8f5,#f9f8f4,#f6f8f3,#f3f9f3,#f0f9f4)] overflow-hidden">
            <LogoHeader />

            <div className="flex-1 flex flex-col items-center px-4">
                <div className="w-full max-w-2xl relative">
                    <QuartetLeaves
                        positionLeave1="top-5 left-120"
                        positionLeave2="top-60 -left-27"
                        positionLeave3="-top-28 left-90"
                        positionLeave4="top-126 left-20"
                    />

                    <section className="border border-input rounded-md bg-white shadow-xs
                                     px-4 sm:px-10 py-6 mb-8 relative z-10
                                     transition-[color,box-shadow]"
                    >
                        <h1 className="text-2xl font-semibold mt-4 mb-6 text-center lg:text-[2rem]">
                            {hasToken ? "Vérification en cours..." : "Vérifiez votre adresse e-mail"}
                        </h1>

                        <VerifyEmailForm />
                    </section>
                </div>

                {!hasToken && (
                    <div className="pb-4 text-center">
                        <p>
                            Vous avez déjà vérifié votre compte ?{' '}
                            <Link to="/connexion" className="underline text-gt-green">
                                Connectez-vous
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}