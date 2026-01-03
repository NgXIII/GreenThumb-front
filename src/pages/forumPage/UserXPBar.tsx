import { Zap } from 'lucide-react';
import type { Tier } from "@/shared/types/user";

interface UserXPBarProps {
    currentMessages: number;
    currentTier: Tier;
    nextTier: Tier | null;
}

export default function UserXPBar({ currentMessages, currentTier, nextTier }: UserXPBarProps) {
    if (!nextTier) {
        // Tier maximum atteint
        return (
            <div className="px-4 pb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-gt-primary/20 to-gt-primary-dark/20 border border-gt-primary/30">
                    <div className="flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4 text-gt-primary" />
                        <p className="text-sm font-semibold text-gt-primary">
                            Tier Maximum Atteint !
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const tierStart = currentTier.messageRequired;
    const tierEnd = nextTier.messageRequired;
    const progress = ((currentMessages - tierStart) / (tierEnd - tierStart)) * 100;
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div className="px-4 pb-4">
            <div className="p-3 rounded-xl bg-gt-surface/40 border border-gt-border/30">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-gt-primary" />
                        <span className="text-xs font-semibold text-gt-text">
                            Progression
                        </span>
                    </div>
                    <span className="text-xs font-mono text-gt-text-muted">
                        {currentMessages}/{tierEnd} msg
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2.5 bg-gt-surface rounded-full overflow-hidden mb-2">
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-gt-primary to-gt-primary-dark transition-all duration-300 ease-out shadow-lg"
                        style={{ width: `${clampedProgress}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                </div>

                {/* Tier Info */}
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gt-text font-medium">
                        {currentTier.name}
                    </span>
                    <span className="flex items-center gap-1 text-gt-text-muted">
                        Prochain:
                        <span className="font-semibold text-gt-primary">
                            {nextTier.name}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}
