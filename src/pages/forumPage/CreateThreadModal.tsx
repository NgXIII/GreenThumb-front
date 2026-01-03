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
import { useCreateThread } from "@/shared/hooks/forum/useCreateThread";
import { createThreadSchema, type CreateThreadFormData } from "@/shared/schemas/channelSchema";
import type { ThreadPost } from "@/shared/types/channel";
import { toast } from "sonner";
import { MessageCircle, Hash, User } from "lucide-react";

interface CreateThreadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    channelName: string;
    username: string;
    onThreadCreated?: () => void;
}

export default function CreateThreadModal({
    open,
    onOpenChange,
    channelName,
    username,
    onThreadCreated,
}: CreateThreadModalProps) {
    const { createThread, isLoading, error } = useCreateThread();

    const form = useForm<CreateThreadFormData>({
        resolver: zodResolver(createThreadSchema),
        mode: "all",
        defaultValues: {
            title: "",
        },
    });

    const onSubmit = async (data: CreateThreadFormData) => {
        try {
            const newThread: ThreadPost = {
                title: data.title,
                creator: username,
            };

            await createThread(newThread, channelName);

            form.reset();
            onOpenChange(false);
            onThreadCreated?.();
            toast.success("Thread créé avec succès !");
        } catch {
            toast.error(error?.response?.data?.message || "Erreur lors de la création du thread");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] bg-gt-surface-elevated/95 backdrop-blur-sm border-gt-border/50">
                <DialogHeader className="border-b border-gt-border/50 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-gt-primary/20 to-gt-primary/10 rounded-xl">
                            <MessageCircle className="w-5 h-5 text-gt-primary"/>
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-gt-text">
                                Nouveau fil de discussion
                            </DialogTitle>
                            <DialogDescription className="text-gt-text-muted text-sm">
                                Créez une nouvelle discussion pour échanger avec la communauté
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-2">
                        {/* Informations du thread */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-3 py-2.5 bg-gt-surface/60 rounded-xl border border-gt-border/30">
                                <Hash className="w-4 h-4 text-gt-primary flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gt-text-muted">Channel</p>
                                    <p className="text-sm font-semibold text-gt-text truncate">{channelName}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 px-3 py-2.5 bg-gt-surface/60 rounded-xl border border-gt-border/30">
                                <User className="w-4 h-4 text-gt-primary flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gt-text-muted">Créateur</p>
                                    <p className="text-sm font-semibold text-gt-text truncate">{username}</p>
                                </div>
                            </div>
                        </div>

                        {/* Formulaire */}
                        <div className="p-4 bg-gradient-to-br from-gt-surface/50 to-gt-surface/30 rounded-xl border border-gt-border/30">
                            <InputForm<CreateThreadFormData>
                                name="title"
                                label="Titre du fil de discussion"
                                placeholder="ex: Comment cultiver des tomates en hiver ?"
                                inputType="text"
                            />
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                                className="border-gt-border/50 hover:bg-gt-surface/50"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-gradient-to-r from-gt-primary to-gt-primary-dark hover:shadow-lg transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="animate-pulse">Création...</span>
                                    </>
                                ) : (
                                    <>
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Créer le fil
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
