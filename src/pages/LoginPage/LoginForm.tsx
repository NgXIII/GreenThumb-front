import {useForm} from "react-hook-form";
import {Form} from "@/shared/components/ui/form.tsx";
import {type UserConnectionPost, UserConnectionSchema} from "@/shared/types/schemas/UserSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import InputForm from "@/shared/components/ui/customs/InputForm.tsx";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "sonner";
import {useAuth} from "@/shared/hooks/useAuth.ts";
import {AxiosError} from "axios";

export default function LoginForm() {
    const {login} = useAuth()
    const navigate = useNavigate();
    const form = useForm<UserConnectionPost>({
        resolver: zodResolver(UserConnectionSchema),
        mode: "all",
        defaultValues: {
            login: "",
            password: ""
        }
    })

    const submit = async (values: UserConnectionPost) => {
        try {
            await login(values);
            toast.success("Connexion réussie !", { duration: 2000 });
            navigate("/");
        } catch (error: unknown) {
            const message = (error instanceof AxiosError ? error.response?.data.error: "Erreur de connexion.");
            toast.error(message, { duration: 2000 });
        }
    }
    /**/
    return (
        <Form {...form}>
            <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(submit)}>
                <div className="flex flex-col gap-4">
                    <section className="flex flex-col gap-4">
                        <InputForm<UserConnectionPost>
                            name="login"
                            inputType="text"
                            placeholder="Adresse mail ou nom d'utilisateur"
                            label="Adresse mail ou nom d'utilisateur"
                        />
                        <InputForm<UserConnectionPost>
                            name="password"
                            inputType="password"
                            placeholder="Mot de passe"
                            label="Mot de passe"
                        />
                    </section>
                </div>

                <a
                    href="#"
                    className="text-xs text-gt-green text-left mt-1 hover:underline"
                >
                    Mot de passe oublié ?
                </a>

                <SubmitButton />
                <SeparatorWithText />
                <InscriptionLink />
            </form>
        </Form>
    );
}

function SubmitButton() {
    return (
        <div className="flex justify-center">
            <button
                type="submit"
                className="w-full px-8 py-2 rounded-md bg-gt-green hover:bg-green-500
                text-gt-white cursor-pointer hover:shadow-md transform transition duration-200 hover:scale-105"
            >
                Se connecter
            </button>
        </div>
    );
}

function SeparatorWithText() {
    return (
        <div className="flex items-center w-full my-1">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-3 text-gray-500 text-sm select-none">ou</span>
            <div className="flex-grow border-t border-gray-300" />
        </div>
    );
}

function InscriptionLink() {
    return (
        <div className="flex justify-center">
            <Link
                to="/inscription"
                className="w-full px-8 py-2 rounded-md bg-gt-yellow hover:bg-yellow-400
                text-gt-white cursor-pointer hover:shadow-md transform transition duration-200 hover:scale-105 text-center"
            >
                S’inscrire
            </Link>
        </div>
    );
}
