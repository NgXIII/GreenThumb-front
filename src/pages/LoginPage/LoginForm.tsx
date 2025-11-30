import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem} from "@/shared/components/ui/form.tsx";
import {type UserConnectionPost, UserConnectionSchema} from "@/shared/types/schemas/UserSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import InputForm from "@/shared/components/ui/customs/InputForm.tsx";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "sonner";
import {useAuth} from "@/shared/hooks/useAuth.ts";
import {AxiosError} from "axios";
import {Button} from "@/shared/components/ui/button.tsx";
import {Loader2} from "lucide-react";
import {Label} from "@/shared/components/ui/label.tsx";

export default function LoginForm() {
    const {login} = useAuth()
    const navigate = useNavigate();

    const form = useForm<UserConnectionPost>({
        resolver: zodResolver(UserConnectionSchema),
        mode: "all",
        defaultValues: {
            login: "",
            password: "",
            rememberMe: false
        }
    })

    const {
        formState: { isSubmitting },
    } = form;

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

                <div className="flex items-center justify-between mt-1">
                    <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={field.value}
                                        onChange={field.onChange}
                                        className="h-4 w-4 rounded border-gt-border text-gt-primary focus:ring-gt-primary focus:ring-offset-0 cursor-pointer"
                                    />
                                </FormControl>
                                <Label
                                    htmlFor="rememberMe"
                                    className="text-sm text-gt-text cursor-pointer font-normal"
                                >
                                    Se souvenir de moi
                                </Label>
                            </FormItem>
                        )}
                    />

                    <a
                        href="#"
                        className="text-xs text-gt-text-accent hover:underline hover:text-gt-primary transition-colors"
                    >
                        Mot de passe oublié ?
                    </a>
                </div>

                <SubmitButton isSubmitting={isSubmitting}/>
                <SeparatorWithText />
                <InscriptionLink />
            </form>
        </Form>
    );
}

function SubmitButton({isSubmitting}: {isSubmitting: boolean}) {
    return (
        <div className="flex justify-center">
            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-2 rounded-md bg-gt-primary hover:bg-gt-primary-hover
                text-gt-primary-foreground cursor-pointer hover:shadow-md transform transition duration-200 hover:scale-105"
            >
                { isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connexion...
                    </>
                ) : (
                    "Se connecter"
                )}

            </Button>
        </div>
    );
}

function SeparatorWithText() {
    return (
        <div className="flex items-center w-full my-1">
            <div className="flex-grow border-t border-gt-border" />
            <span className="mx-3 text-gt-text-muted text-sm select-none">ou</span>
            <div className="flex-grow border-t border-gt-border" />
        </div>
    );
}

function InscriptionLink() {
    return (
        <div className="flex justify-center">
            <Link
                to="/inscription"
                className="w-full px-8 py-2 rounded-md bg-gt-yellow hover:bg-gt-yellow-dark
                text-gt-black cursor-pointer hover:shadow-md transform transition duration-200 hover:scale-105 text-center font-medium"
            >
                S'inscrire
            </Link>
        </div>
    );
}
