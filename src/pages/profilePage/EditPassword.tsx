import {useForm} from "react-hook-form";
import {Button} from "@/shared/components/ui/button.tsx";
import {
    Dialog, DialogClose,
    DialogContent, DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/shared/components/ui/dialog.tsx";
import InputForm from "@/shared/components/ui/customs/InputForm.tsx";
import {type PasswordEditPost, PasswordEditSchema} from "@/shared/types/schemas/UserSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/shared/components/ui/form.tsx";

export default function EditPassword() {
    const form = useForm<PasswordEditPost>({
        resolver: zodResolver(PasswordEditSchema),
        mode: "all",
        defaultValues: {
            password: "",
            confirmPassword: "",
        }
    })

    const onSubmit = (data: PasswordEditPost) => {
        try {
            console.log(data)
        }catch(error) {
            console.log(error)
        }
    }

    return <>
        <Dialog>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogTrigger asChild>

                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Modification du mot de passe
                            </DialogTitle>
                            <DialogDescription>
                                Entrez votre nouveau mot de passe et confirmez le
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-3">
                            <InputForm name="password" label="Mot de passe" inputType="password" placeholder="*********" />
                            <InputForm name="confirmPassword" inputType="password" label="Confirmer le mot de passe" placeholder="*********" />
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" className="cursor-pointer">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" className="cursor-pointer">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Form>
        </Dialog>
    </>
}