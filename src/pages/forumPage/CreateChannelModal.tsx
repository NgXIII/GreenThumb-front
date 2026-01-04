import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Form } from "@/shared/components/ui/form";
import { Button } from "@/shared/components/ui/button";
import InputForm from "@/shared/components/ui/customs/InputForm";
import { useCreateChannel } from "@/shared/hooks/forum/useCreateChannel";
import { createChannelSchema, type CreateChannelFormData } from "@/shared/schemas/channelSchema";
import type {ChannelPost} from "@/shared/types/channel";
import {toast} from "sonner";

interface CreateChannelModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onChannelCreated?: () => void;
}

export default function CreateChannelModal({
    open,
    onOpenChange,
    onChannelCreated,
}: CreateChannelModalProps) {
    const { createChannel, isLoading, error } = useCreateChannel();

    const form = useForm<CreateChannelFormData>({
        resolver: zodResolver(createChannelSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const onSubmit = async (data: CreateChannelFormData) => {
        try {
            const newChannel: ChannelPost = {
                name: data.name,
                description: data.description,
            };

            await createChannel(newChannel);

            form.reset();
            onOpenChange(false);
            onChannelCreated?.();
        } catch {
            toast.error(error?.response?.data);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Créer un nouveau channel</DialogTitle>
                    <DialogDescription>
                        Ajoutez un nouveau channel de discussion pour la communauté GreenThumb.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <InputForm<CreateChannelFormData>
                            name="name"
                            label="Nom du channel"
                            placeholder="ex: Jardinage, Plantes d'intérieur..."
                            inputType="text"
                        />

                        <InputForm<CreateChannelFormData>
                            name="description"
                            label="Description"
                            placeholder="Décrivez le sujet de discussion de ce channel..."
                            inputType="textarea"
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Création..." : "Créer le channel"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
