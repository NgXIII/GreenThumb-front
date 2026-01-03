import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { useAuth } from "@/shared/hooks/useAuth"
import apiClient from "@/services/http/apiClient"

interface DeactivateAccountModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function DeactivateAccountModal({
    open,
    onOpenChange
}: DeactivateAccountModalProps) {
    const [confirmText, setConfirmText] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { logout } = useAuth()

    const handleClose = () => {
        setConfirmText("")
        onOpenChange(false)
    }

    const handleConfirmDeactivate = async () => {
        if (confirmText !== "SUPPRIMER MON COMPTE") {
            toast.error("Veuillez saisir correctement le texte de confirmation")
            return
        }

        setIsLoading(true)

        try {
            const response = await apiClient.delete('/users/me')

            toast.warning(response.data.message || "Compte désactivé définitivement", {
                description: "Vous allez être déconnecté.",
                duration: 5000,
            })

            handleClose()

            // Attendre 2 secondes avant de déconnecter
            setTimeout(async () => {
                await logout()
                navigate('/')
            }, 2000)

        } catch (error) {
            if (error instanceof AxiosError) {
                const status = error.response?.status
                const message = error.response?.data?.message

                if (status === 403) {
                    toast.error("Action interdite", {
                        description: message || "Les administrateurs ne peuvent pas se désactiver",
                    })
                } else if (status === 409) {
                    toast.error("Compte déjà désactivé", {
                        description: message || "Ce compte est déjà désactivé",
                    })
                } else {
                    toast.error("Erreur lors de la désactivation", {
                        description: message || "Une erreur est survenue",
                    })
                }
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl bg-gt-surface-elevated">
                <DialogTitle className="text-xl font-semibold text-gt-text">
                    Confirmation de désactivation
                </DialogTitle>

                <DialogDescription className="text-gt-text-muted mt-1">
                    Cette action est <strong className="text-red-600 dark:text-red-400">irréversible</strong> et <strong className="text-red-600 dark:text-red-400">définitive</strong>
                </DialogDescription>

                {/* Bloc d'avertissement */}
                <div className="mt-5 border-l-4 border-red-500 bg-red-50/30 dark:bg-red-950/10 p-4 rounded-r-lg">
                    <p className="text-sm font-medium text-gt-text mb-3">Effets immédiats :</p>
                    <ul className="space-y-2.5 text-sm text-gt-text-muted">
                        <li className="flex items-start gap-2 leading-relaxed">
                            <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                            <span>
                                Vos données personnelles (nom, email, téléphone) seront{" "}
                                <strong className="text-red-600 dark:text-red-400">anonymisées à jamais</strong>
                            </span>
                        </li>
                        <li className="flex items-start gap-2 leading-relaxed">
                            <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                            <span>
                                Reconnexion <strong className="text-red-600 dark:text-red-400">impossible</strong> après désactivation
                            </span>
                        </li>
                        <li className="flex items-start gap-2 leading-relaxed">
                            <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                            <span>
                                Restauration du compte <strong className="text-red-600 dark:text-red-400">impossible</strong>
                            </span>
                        </li>
                        <li className="flex items-start gap-2 leading-relaxed">
                            <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                            <span className="text-gt-text-muted">
                                Vos contributions restent visibles (anonymes)
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Champ de confirmation */}
                <div className="mt-5">
                    <label className="block text-sm font-medium text-gt-text mb-2.5">
                        Pour confirmer, tapez exactement :{" "}
                        <code className="bg-gt-surface-hover px-2 py-1 rounded text-red-600 dark:text-red-400 font-mono text-xs">
                            SUPPRIMER MON COMPTE
                        </code>
                    </label>
                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="SUPPRIMER MON COMPTE"
                        className="w-full px-3 py-2.5 border border-gt-border bg-gt-surface text-gt-text rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono text-sm"
                        autoComplete="off"
                    />
                    {confirmText && confirmText !== "SUPPRIMER MON COMPTE" && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                            Le texte doit correspondre exactement
                        </p>
                    )}
                </div>

                {/* Boutons */}
                <DialogFooter className="mt-6 gap-3">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirmDeactivate}
                        disabled={confirmText !== "SUPPRIMER MON COMPTE" || isLoading}
                        className="flex-1"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Désactivation...
                            </>
                        ) : (
                            "Confirmer la désactivation"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
