import QuartetLeaves from "@/shared/components/ui/customs/QuartetLeaves.tsx";
import LoginForm from "@/pages/LoginPage/LoginForm.tsx";
import LogoHeader from "@/shared/components/ui/customs/LogoHeader.tsx";
import ThemeToggle from "@/shared/components/layout/ThemeToggle.tsx";

export default function LoginPage() {
    return (
        <main className="min-h-screen flex flex-col text-gt-text bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 overflow-hidden transition-colors duration-300">
            <LogoHeader />

            {/* Theme Toggle Button - Top Right */}
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            <div className="relative w-full flex justify-center items-center px-4">
               <ContentLoginPage />
            </div>
        </main>
    )
}

function ContentLoginPage() {
    return (
        <div className="relative max-w-sm w-full">
            <QuartetLeaves
                positionLeave1="top-5 left-70"
                positionLeave2="top-60 -left-27"
                positionLeave3="-top-25 left-10"
                positionLeave4="top-105 left-10"
            />

            <section className="border border-gt-border rounded-md bg-gt-surface-elevated shadow-xs
                                     px-4 sm:px-10 py-6 mb-8 relative z-10
                                     transition-colors duration-300">
                <h1 className="text-2xl font-semibold mb-6 text-gt-text">Connexion</h1>
                <LoginForm />
            </section>
        </div>
    );
}