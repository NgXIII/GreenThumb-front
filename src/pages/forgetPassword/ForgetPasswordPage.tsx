import ThemeToggle from "@/shared/components/layout/ThemeToggle.tsx";
import LogoHeader from "@/shared/components/ui/customs/LogoHeader.tsx";
import {useForm} from "react-hook-form";
import {Form} from "@/shared/components/ui/form.tsx";
import InputForm from "@/shared/components/ui/customs/InputForm.tsx";
import {type UserResetPasswordEmailPost, UserResetPasswordEmailSchema} from "@/shared/types/schemas/UserSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";


export default function ForgetPasswordPage() {
    return (
        <main className="min-h-screen flex flex-col text-gt-text bg-gt-surface overflow-hidden transition-colors duration-300">
            <LogoHeader />

            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            <div className="relative w-full flex justify-center items-center px-4">
                <ContentPage />
            </div>
        </main>
    )
}

function ContentPage() {
    return (
        <div className="relative max-w-sm w-full">
            <section className="border border-gt-border rounded-md bg-gt-surface-elevated shadow-xs px-4 sm:px-10 py-6 mb-8 relative z-10 transition-colors duration-300">
                <EmailForm/>
            </section>
        </div>
    )
}

function EmailForm() {
    const form = useForm<UserResetPasswordEmailPost>({
        resolver: zodResolver(UserResetPasswordEmailSchema),
        defaultValues: {
            email: ""
        }
    })

    return (
        <Form {...form}>
            <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <InputForm<UserResetPasswordEmailPost>
                        name="email"
                        inputType="email"
                        placeholder="Adresse mail"
                        label="Adresse mail"
                    />
                </div>
            </form>
        </Form>
    )
}