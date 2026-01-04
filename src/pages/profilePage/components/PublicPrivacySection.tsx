import { useState } from "react"
import { Globe, Lock, Info, Eye, EyeOff } from "lucide-react"
import { Switch } from "@/shared/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { patchUserPrivacy } from "@/services/repos/patchEditUser"
import { useUserStore } from "@/app/stores/userStore"
import { toast } from "sonner"
import { AxiosError } from "axios"

export default function PublicPrivacySection() {
    const { user, setUser } = useUserStore()
    const [isPrivate, setIsPrivate] = useState(user?.isPrivate ?? true)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [pendingPrivacyState, setPendingPrivacyState] = useState<boolean | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handlePrivacyToggle = (checked: boolean) => {
        const newPrivateState = !checked

        if (!newPrivateState) {
            setPendingPrivacyState(newPrivateState)
            setShowConfirmDialog(true)
        } else {
            updatePrivacy(newPrivateState)
        }
    }

    const updatePrivacy = async (newPrivateState: boolean) => {
        if (!user?.username) return

        setIsLoading(true)
        try {
            await patchUserPrivacy(user.username, newPrivateState)

            setIsPrivate(newPrivateState)
            setUser({ ...user, isPrivate: newPrivateState })

            const message = newPrivateState
                ? "Votre profil est maintenant privé"
                : "Votre profil est maintenant public"

            toast.success(message)
        } catch (error) {
            console.error(error)

            if (error instanceof AxiosError) {
                if (error.response?.data?.message) {
                    toast.error(error.response.data.message)
                } else {
                    toast.error("Erreur lors de la mise à jour de la confidentialité")
                }
            } else {
                toast.error("Erreur lors de la mise à jour de la confidentialité")
            }
        } finally {
            setIsLoading(false)
            setShowConfirmDialog(false)
            setPendingPrivacyState(null)
        }
    }

    const handleConfirm = () => {
        if (pendingPrivacyState !== null) {
            updatePrivacy(pendingPrivacyState)
        }
    }

    const handleCancel = () => {
        setShowConfirmDialog(false)
        setPendingPrivacyState(null)
    }

    return (
        <>
            <section className="bg-gt-surface-elevated rounded-2xl shadow-xl p-6 sm:p-8 mb-8 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-gt-text mb-6">
                    Visibilité du profil
                </h2>

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gt-surface rounded-lg">
                        <div className="flex items-center gap-3 flex-1">
                            {isPrivate ? (
                                <Lock className="w-5 h-5 text-orange-600" aria-hidden="true" />
                            ) : (
                                <Globe className="w-5 h-5 text-green-600" aria-hidden="true" />
                            )}
                            <div>
                                <p className="text-sm font-medium text-gt-text">
                                    {isPrivate ? "Profil privé" : "Profil public"}
                                </p>
                                <p className="text-xs text-gt-text-muted">
                                    {isPrivate
                                        ? "Seul vous pouvez voir votre profil complet"
                                        : "Votre profil est visible par tous les utilisateurs"
                                    }
                                </p>
                            </div>
                        </div>
                        <Switch
                            checked={!isPrivate}
                            onCheckedChange={handlePrivacyToggle}
                            disabled={isLoading}
                            aria-label="Rendre le profil public"
                        />
                    </div>

                    <div className="border-l-4 border-blue-500 dark:border-blue-600 bg-blue-50/30 dark:bg-blue-950/10 rounded-r-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-gt-text mb-2">
                                    {isPrivate ? "Si votre profil était public" : "Informations visibles publiquement"}
                                </h3>
                                <ul className="space-y-2 text-sm text-gt-text-muted">
                                    <li className="flex items-start gap-2">
                                        <Eye className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span><strong className="text-gt-text">Visible :</strong> Prénom, nom, nom d'utilisateur et vos plantes</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <EyeOff className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span><strong className="text-gt-text">Caché :</strong> Email, téléphone, biographie et statistiques</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="bg-gt-surface-elevated border-gt-light-grey">
                    <DialogHeader>
                        <DialogTitle className="text-gt-text flex items-center gap-2">
                            <Globe className="w-5 h-5 text-green-600" />
                            Rendre votre profil public ?
                        </DialogTitle>
                        <DialogDescription className="text-gt-text-muted">
                            Êtes-vous sûr de vouloir rendre votre profil public ?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 my-4">
                        <p className="text-sm text-gt-text">
                            Les autres utilisateurs pourront voir :
                        </p>
                        <ul className="space-y-2 text-sm text-gt-text-muted">
                            <li className="flex items-start gap-2">
                                <Eye className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Votre prénom, nom et nom d'utilisateur</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Eye className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>La liste complète de vos plantes</span>
                            </li>
                        </ul>
                        <p className="text-xs text-gt-text-muted bg-gt-surface p-3 rounded-lg mt-3">
                            Vos informations sensibles (email, téléphone, biographie) resteront privées.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="border-gt-light-grey"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="bg-gt-green hover:bg-green-700 text-white"
                        >
                            {isLoading ? "Mise à jour..." : "Confirmer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
