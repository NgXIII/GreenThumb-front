import QuartetLeaves from "@/shared/components/ui/customs/QuartetLeaves.tsx";
import LoginForm from "@/pages/LoginPage/LoginForm.tsx";
import LogoHeader from "@/shared/components/ui/customs/LogoHeader.tsx";

export default function LoginPage() {
    return (
        <main className="min-h-screen flex flex-col text-black bg-[linear-gradient(to_bottom,#faf8f5,#f9f8f4,#f6f8f3,#f3f9f3,#f0f9f4)] overflow-hidden">
            <LogoHeader />

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

            <section className="border border-input rounded-md bg-white shadow-xs
                                     px-4 sm:px-10 py-6 mb-8 relative z-10
                                     transition-[color,box-shadow]">
                <h1 className="text-2xl font-semibold mb-6">Connexion</h1>
                <LoginForm />
            </section>
        </div>
    );
}