import logo from "../assets/logo.png"
import leave1 from "../assets/leave1.png"
import leave2 from "../assets/leave2.png"
import leave3 from "../assets/leave3.png"
import leave4 from "../assets/leave4.png"
import Input from "../shared/components/ui/Input.tsx";
import {Link} from "react-router-dom";
import InputFile from "../shared/components/ui/InputFile.tsx";

export default function RegisterPage() {
    return (
        <main className="min-h-screen flex flex-col text-black bg-[linear-gradient(to_bottom,#faf8f5,#f9f8f4,#f6f8f3,#f3f9f3,#f0f9f4)] overflow-hidden">
            <header className="w-full px-4 py-4">
                <Link to="/" className="block mx-auto lg:mx-0 w-24">
                    <img src={logo} className="max-w-full h-auto w-24" alt="Logo" />
                </Link>
            </header>

            <div className="flex-1 flex flex-col items-center px-4 lg:mt-20">
                <div className="w-full max-w-4xl relative">
                    <Leaves />

                    <div className="border border-gray-400 rounded-xl bg-gt-white px-4 sm:px-10 py-2 mb-8 relative z-10">
                        <h1 className="text-2xl font-semibold mt-4 mb-6 text-center lg:text-left lg:text-[2rem]">
                            Inscription
                        </h1>

                        <RegisterForm />
                    </div>
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
    );
}

function Leaves() {
    return (
        <>
            <img
                src={leave1}
                alt=""
                className="hidden lg:block absolute top-5 left-202 w-56 h-auto pointer-events-none z-0"
            />
            <img
                src={leave2}
                alt=""
                className="hidden lg:block absolute top-60 -left-27 w-40 h-auto pointer-events-none z-0"
            />
            <img
                src={leave3}
                alt=""
                className="hidden lg:block absolute -top-28 left-120 w-40 h-auto pointer-events-none z-0"
            />
            <img
                src={leave4}
                alt=""
                className="hidden lg:block absolute top-126 left-30 w-40 h-auto pointer-events-none z-0"
            />
        </>
    );
}

function RegisterForm() {
    return (
        <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:gap-10">
                <LeftColumn />

                <Separator />

                <RightColumn />
            </div>

            <TermsCheckbox />

            <SubmitButton />
        </form>
    );
}

function LeftColumn() {
    return (
        <div className="flex flex-col gap-5 lg:flex-1">
            <Input inputType="text" placeholder="PlantQueen" label="Nom d'utilisateur*" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input inputType="text" placeholder="Aerts" label="Nom*" />
                <Input inputType="text" placeholder="Emelie" label="Prénom*" />
            </div>
            <Input inputType="password" label="Mot de passe*" placeholder="*********" />
            <Input inputType="password" label="Confirmer le mot de passe*" placeholder="*********" />
        </div>
    );
}

function Separator() {
    return (
        <>
            <div className="hidden lg:block border-l border-gray-300 self-stretch" />
            <div className="lg:hidden border-t border-gray-300 mt-1" />
        </>
    );
}

function RightColumn() {
    return (
        <div className="flex flex-col gap-5 lg:flex-1">
            <InputFile label="Photo de profil" />
            <Input inputType="email" label="E-mail*" placeholder="emilie.aerts@gmail.com" />
            <Input inputType="number" label="Téléphone*" placeholder="0123456789" />
        </div>
    );
}

function TermsCheckbox() {
    return (
        <div className="flex items-start gap-1">
            <div className="checkbox-wrapper-19">
                <input type="checkbox" id="cbtest-19" />
                <label htmlFor="cbtest-19" className="check-box" />
            </div>
            <p className="text-sm">
                J'accepte les{' '}
                <a href="#" className="underline text-green-600">
                    Conditions générales d'utilisation
                </a>
                {' '}et la{' '}
                <a href="#" className="underline text-green-600">
                    Politique de Confidentialité
                </a>
            </p>
        </div>
    );
}

function SubmitButton() {
    return (
        <div className="lg:flex lg:justify-center">
            <button
                type="submit"
                className="w-full lg:w-auto lg:px-12 lg:text-xl py-2 rounded-md bg-gt-yellow hover:bg-yellow-500 text-gt-white mb-4 cursor-pointer"
            >
                S'inscrire
            </button>
        </div>
    );
}