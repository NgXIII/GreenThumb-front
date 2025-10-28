import logo from "../../assets/logo.png"
import {Link} from "react-router-dom";
import QuartetLeaves from "@/shared/components/ui/customs/QuartetLeaves.tsx";
import RegisterForm from "@/pages/RegisterPage/RegisterForm.tsx";

export default function RegisterPage() {
    return (
        <main className="min-h-screen flex flex-col text-black bg-[linear-gradient(to_bottom,#faf8f5,#f9f8f4,#f6f8f3,#f3f9f3,#f0f9f4)] overflow-hidden">
            <header className="w-full px-4 py-4">
                <Link to="/" className="block mx-auto lg:mx-0 w-24">
                    <img
                        src={logo}
                        alt="Logo"
                        className="max-w-full h-auto w-24 transition-transform duration-300 ease-out hover:scale-105"
                    />
                </Link>
            </header>

            <div className="flex-1 flex flex-col items-center px-4 lg:mb-20">
                <div className="w-full max-w-4xl relative">
                    <QuartetLeaves
                        positionLeave1="top-5 left-202"
                        positionLeave2="top-60 -left-27"
                        positionLeave3="-top-28 left-120"
                        positionLeave4="top-126 left-30"
                    />

                    <section className="border border-input rounded-md bg-white shadow-xs
                                     px-4 sm:px-10 py-6 mb-8 relative z-10
                                     transition-[color,box-shadow]"
                    >
                        <h1 className="text-2xl font-semibold mt-4 mb-6 text-center lg:text-left lg:text-[2rem]">
                            Inscription
                        </h1>

                        <RegisterForm />
                    </section>
                </div>

                <div className="pb-4 text-center">
                    <p>
                        Déjà inscrit ?{' '}
                        <Link to="/" className="underline text-gt-green">
                            Connectez-vous
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

