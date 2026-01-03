import { useState } from "react"
import { AlertTriangle, Trash2 } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import DeactivateAccountModal from "./DeactivateAccountModal"

export default function PrivacySection() {
    const [showDeactivateModal, setShowDeactivateModal] = useState(false)

    return (
        <section className="bg-gt-surface-elevated rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gt-text mb-6">
                Confidentialité et données
            </h2>

            <div className="border-l-4 border-red-500 dark:border-red-600 bg-red-50/30 dark:bg-red-950/10 rounded-r-lg p-6">
                <div className="flex items-start gap-4 mb-5">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gt-text mb-2">
                            Désactivation du compte
                        </h3>
                        <p className="text-sm text-gt-text-muted">
                            Cette action est <strong className="text-red-600 dark:text-red-400">irréversible</strong> et <strong className="text-red-600 dark:text-red-400">définitive</strong>
                        </p>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="bg-white/50 dark:bg-gray-900/30 rounded-lg p-4 border border-red-200/50 dark:border-red-900/30">
                        <p className="text-sm font-medium text-gt-text mb-3">Conséquences de la désactivation :</p>
                        <ul className="space-y-2 text-sm text-gt-text-muted">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Anonymisation <strong className="text-gt-text">immédiate</strong> de vos données personnelles</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Connexion <strong className="text-gt-text">impossible</strong> après désactivation</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Données originales perdues <strong className="text-gt-text">à jamais</strong></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Restauration du compte <strong className="text-gt-text">impossible</strong></span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-blue-50/50 dark:bg-blue-950/10 rounded-lg border border-blue-200/50 dark:border-blue-900/30">
                        <span className="text-blue-600 dark:text-blue-400 text-sm">ℹ️</span>
                        <p className="text-sm text-gt-text-muted">
                            Vos contributions (messages, plantes) restent visibles sous le nom "Utilisateur désactivé"
                        </p>
                    </div>
                </div>

                <Button
                    variant="outline"
                    onClick={() => setShowDeactivateModal(true)}
                    className="w-full sm:w-auto border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/30"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Désactiver mon compte
                </Button>
            </div>

            <DeactivateAccountModal
                open={showDeactivateModal}
                onOpenChange={setShowDeactivateModal}
            />
        </section>
    )
}
