import {Link} from "react-router-dom";
import QuartetLeaves from "@/shared/components/ui/customs/QuartetLeaves.tsx";
import RegisterForm from "@/pages/RegisterPage/RegisterForm.tsx";
import LogoHeader from "@/shared/components/ui/customs/LogoHeader.tsx";
import ThemeToggle from "@/shared/components/layout/ThemeToggle.tsx";

export default function RegisterPage() {
    return (
        <main className="min-h-screen flex flex-col text-gt-text bg-background overflow-hidden transition-colors duration-300">
            <LogoHeader />

            {/* Theme Toggle Button - Top Right */}
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            <div className="flex-1 flex flex-col items-center px-4">
                <div className="w-full max-w-4xl relative">
                    <QuartetLeaves
                        positionLeave1="top-5 left-202"
                        positionLeave2="top-60 -left-27"
                        positionLeave3="-top-28 left-120"
                        positionLeave4="top-126 left-30"
                    />

                    <section className="border border-gt-border rounded-md bg-gt-surface-elevated shadow-xs
                                     px-4 sm:px-10 py-6 mb-8 relative z-10
                                     transition-colors duration-300"
                    >
                        <h1 className="text-2xl font-semibold mt-4 mb-6 text-center lg:text-left lg:text-[2rem] text-gt-text">
                            Inscription
                        </h1>

                        <RegisterForm />
                    </section>
                </div>

                <div className="pb-4 text-center text-gt-text">
                    <p>
                        Déjà inscrit ?{' '}
                        <Link to="/connexion" className="underline text-gt-text-accent hover:text-gt-primary transition-colors">
                            Connectez-vous
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

