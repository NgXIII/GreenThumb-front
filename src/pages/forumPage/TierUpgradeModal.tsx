import type {TierUpgradeNotification} from "@/shared/types/user.ts";
import {Sparkles, Trophy, X} from "lucide-react";
import {useEffect, useState} from "react";

interface TierUpgradeModalProps {
    notification: TierUpgradeNotification | null;
    onClose: () => void;
}

export default function TierUpgradeModal({ notification, onClose }: TierUpgradeModalProps) {
    const [isVisible, setIsVisible] = useState(false);


    useEffect(() => {
        if (notification) {
            setIsVisible(true);
        }
    }, [notification]);

    if (!notification || !isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative bg-gradient-to-br from-gt-surface to-gt-surface-elevated rounded-3xl p-8 max-w-md mx-4 shadow-2xl border-2 border-gt-primary/30 animate-scaleIn">

                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gt-surface-elevated transition-colors"
                >
                    <X className="w-5 h-5 text-gt-text-muted" />
                </button>

                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gt-primary/20 blur-2xl rounded-full animate-pulse"></div>
                        <Trophy className="relative w-24 h-24 text-gt-primary" strokeWidth={1.5} />
                        <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-spin-slow" />
                    </div>
                </div>


                <h2 className="text-3xl font-bold text-center text-gt-text mb-3">
                    Félicitations ! 🎉
                </h2>

                <div className="bg-gradient-to-r from-gt-primary/10 to-emerald-500/10 border border-gt-primary/30 rounded-xl p-4 mb-4">
                    <p className="text-center text-gt-text-muted text-sm mb-1">
                        Vous avez atteint le niveau
                    </p>
                    <p className="text-center text-2xl font-bold text-gt-primary">
                        {notification.tierName}
                    </p>
                </div>

                <div className="space-y-2 mb-6">
                    <p className="text-gt-text text-center">
                        Vous pouvez maintenant créer jusqu'à
                    </p>
                    <p className="text-4xl font-bold text-center text-gt-primary">
                        {notification.threadsUnlocked}
                    </p>
                    <p className="text-gt-text text-center">
                        fils de discussion
                    </p>
                </div>

                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-gt-primary to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-gt-primary/30 transition-all duration-300"
                >
                    Continuer
                </button>
            </div>
        </div>
    );
}