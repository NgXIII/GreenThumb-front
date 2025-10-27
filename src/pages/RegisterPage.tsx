import logo from "../assets/logo.png"
import {Link} from "react-router-dom";
import InputFile from "@/shared/components/ui/customs/InputFile.tsx";
import QuartetLeaves from "@/shared/components/ui/customs/QuartetLeaves.tsx";
import {useForm, useFormContext} from "react-hook-form";
import {Form, FormField, FormItem} from "@/shared/components/ui/form";
import {type UserCreationPost, UserCreationSchema} from "../shared/types/schemas/UserSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import InputForm from "@/shared/components/ui/customs/InputForm.tsx";

export default function RegisterPage() {
    return (
        <main className="min-h-screen flex flex-col text-black bg-[linear-gradient(to_bottom,#faf8f5,#f9f8f4,#f6f8f3,#f3f9f3,#f0f9f4)] overflow-hidden">
            <div className="w-full px-4 py-4">
                <Link to="/" className="block mx-auto lg:mx-0 w-24">
                    <img
                        src={logo}
                        alt="Logo"
                        className="max-w-full h-auto w-24 transition-transform duration-300 ease-out hover:scale-105"
                    />
                </Link>
            </div>

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
    );
}

function RegisterForm() {
    const form = useForm<UserCreationPost>({
        resolver: zodResolver(UserCreationSchema),
        mode: "all",
        defaultValues: {
            username: "",
            firstname: "",
            lastname: "",
            password: "",
            confirmPassword: "",
            email: "",
            phoneNumber: "",
        }
    })

    const submit = (values: UserCreationPost) => {
        console.log(values)
    }

    return (
        <Form {...form}>
            <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(submit)}>
                <div className="flex flex-col gap-5 lg:flex-row lg:gap-10">
                    <LeftColumn />

                    <Separator />

                    <RightColumn />
                </div>

                <TermsCheckbox />

                <SubmitButton />
            </form>
        </Form>
    )
}

function LeftColumn() {
    return (
        <section className="flex flex-col gap-5 lg:flex-1">
            <InputForm name="username" inputType="text" placeholder="PlantQueen" label="Nom d'utilisateur*" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputForm name="lastname" inputType="text" placeholder="Aerts" label="Nom*" />
                <InputForm name="firstname" inputType="text" placeholder="Emelie" label="Prénom*" />
            </div>
            <InputForm name="password" inputType="password" label="Mot de passe*" placeholder="*********" />
            <InputForm name="confirmPassword" inputType="password" label="Confirmer le mot de passe*" placeholder="*********" />
        </section>
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
        <section className="flex flex-col gap-5 lg:flex-1">
            <InputFile label="Photo de profil" name="avatar" />
            <InputForm name="email" inputType="email" label="E-mail*" placeholder="emilie.aerts@gmail.com" />
            <InputForm name="phoneNumber" inputType="number" label="Téléphone*" placeholder="0123456789" />
        </section>
    );
}

function TermsCheckbox() {
    const form = useFormContext<UserCreationPost>();

    return (
        <FormField
            control={form.control}
            name="terms"
            render={({ field, fieldState }) => (
                <FormItem>
                    <div className="flex items-start gap-2">
                        <div className="checkbox-wrapper-19">
                            <input
                                id="cb-terms"
                                type="checkbox"
                                checked={!!field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                            />
                            <label htmlFor="cb-terms" className="check-box" />
                        </div>
                        {fieldState.error ? (
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-sm text-red-500">
                                    J'accepte les{" "}
                                    <a href="#" className="underline">
                                        Conditions générales d'utilisation
                                    </a>{" "}
                                    et la{" "}
                                    <a href="#" className="underline">
                                        Politique de Confidentialité
                                    </a>
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm">
                                    J'accepte les{" "}
                                    <a href="#" className="underline text-gt-green">
                                        Conditions générales d'utilisation
                                    </a>{" "}
                                    et la{" "}
                                    <a href="#" className="underline text-gt-green">
                                        Politique de Confidentialité
                                    </a>
                                </p>
                            </div>
                        )}
                    </div>
                </FormItem>
            )}
        />
    )
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