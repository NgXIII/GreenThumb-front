import { Sprout, CheckCircle2, MessageCircle, type LucideIcon } from "lucide-react";
import {type FC, memo } from "react";

type IconType = "plants" | "tasks" | "discussions";
type ColorType = "green" | "blue" | "purple";

type StatCardProps = {
    title: string;
    value: number;
    icon: IconType;
    color: ColorType;
};

type ColorScheme = {
    bg: string;
    border: string;
    text: string;
    iconBg: string;
    iconColor: string;
};

const ICONS: Record<IconType, LucideIcon> = {
    plants: Sprout,
    tasks: CheckCircle2,
    discussions: MessageCircle
} as const;

const COLORS: Record<ColorType, ColorScheme> = {
    green: {
        bg: "bg-green-50 dark:bg-green-900/20",
        border: "border-green-500 dark:border-green-600",
        text: "text-green-700 dark:text-green-400",
        iconBg: "bg-green-100 dark:bg-green-800/30",
        iconColor: "text-green-600 dark:text-green-400"
    },
    blue: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-500 dark:border-blue-600",
        text: "text-blue-700 dark:text-blue-400",
        iconBg: "bg-blue-100 dark:bg-blue-800/30",
        iconColor: "text-blue-600 dark:text-blue-400"
    },
    purple: {
        bg: "bg-purple-50 dark:bg-purple-900/20",
        border: "border-purple-500 dark:border-purple-600",
        text: "text-purple-700 dark:text-purple-400",
        iconBg: "bg-purple-100 dark:bg-purple-800/30",
        iconColor: "text-purple-600 dark:text-purple-400"
    }
} as const;

export const StatCard: FC<StatCardProps> = memo(({ title, value, icon, color }) => {
    const Icon = ICONS[icon];
    const colorScheme = COLORS[color];

    return (
        <article
            className={`relative overflow-hidden rounded-xl ${colorScheme.bg} p-6 shadow-md border-2 ${colorScheme.border} hover:shadow-lg transition-all duration-300 hover:scale-105`}
            aria-label={`${title}: ${value}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gt-text-muted mb-1">{title}</p>
                    <p className={`text-4xl font-bold ${colorScheme.text}`} aria-live="polite">
                        {value}
                    </p>
                </div>
                <div className={`${colorScheme.iconBg} p-4 rounded-full shadow-sm`} aria-hidden="true">
                    <Icon className={`w-8 h-8 ${colorScheme.iconColor}`} />
                </div>
            </div>
        </article>
    );
});

StatCard.displayName = "StatCard";