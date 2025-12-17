interface WaterDropIconProps {
    level: string;
}

export default function WaterDrop({level}: WaterDropIconProps) {
    const getWaterLevel = () => {
        switch (level) {
            case "Élevé":
                return "100%";
            case "Modéré":
                return "50%";
            case "Faible":
                return "20%";
            default:
                return "0%";
        }
    };

    const waterLevel = getWaterLevel();

    return (
        <div className="relative w-8 h-10 inline-block">
            <svg viewBox="0 0 24 30" className="w-full h-full">
                <path
                    d="M12 2C12 2 4 12 4 18C4 23.5 7.5 28 12 28C16.5 28 20 23.5 20 18C20 12 12 2 12 2Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-gt-border"
                />

                <defs>
                    <clipPath id={`water-clip-${level}`}>
                        <path d="M12 2C12 2 4 12 4 18C4 23.5 7.5 28 12 28C16.5 28 20 23.5 20 18C20 12 12 2 12 2Z"/>
                    </clipPath>
                </defs>
                <rect
                    x="4"
                    y={28 - (24 * parseInt(waterLevel)) / 100}
                    width="16"
                    height={(24 * parseInt(waterLevel)) / 100}
                    fill="currentColor"
                    className={`${
                        level === "Élevé"
                            ? "text-blue-500"
                            : level === "Modéré"
                                ? "text-blue-400"
                                : "text-blue-300"
                    }`}
                    clipPath={`url(#water-clip-${level})`}
                />
            </svg>
        </div>
    )
}