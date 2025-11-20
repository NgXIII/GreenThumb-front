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
        bg: "bg-green-50",
        border: "border-green-500",
        text: "text-green-700",
        iconBg: "bg-green-100",
        iconColor: "text-green-600"
    },
    blue: {
        bg: "bg-blue-50",
        border: "border-blue-500",
        text: "text-blue-700",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600"
    },
    purple: {
        bg: "bg-purple-50",
        border: "border-purple-500",
        text: "text-purple-700",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600"
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
                    <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
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