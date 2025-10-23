import FallingLeaves from "../shared/components/ui/FallingLeaves.tsx";
import {useSeason} from "../shared/hooks/useSeason.ts";
import Snowflakes from "../shared/components/ui/Snowflakes.tsx";
import SakuraPetals from "../shared/components/ui/SakuraPetals.tsx";

export default function HomePage() {
    return (
        <main className="flex flex-col min-h-screen items-center">
            <HeaderHome />
            <h1>Salut</h1>
        </main>
    );
}

function HeaderHome() {
    const season = useSeason()

    return (
        <header className="relative bg-gradient-to-b from-green-50 to-green-100 px-6 py-12 text-center">
            {season === "autumn" && <FallingLeaves />}
            {season === "winter" && <Snowflakes />}
            {season === "spring" && <SakuraPetals />}
            <div className="flex flex-col items-center gap-4 max-w-xl">
                <h2 className="text-sm font-medium text-green-700 bg-green-100/70 border border-green-200 px-4 py-1 rounded-full">
                    🌿 Rejoignez plus de 1000 jardiniers passionnés
                </h2>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                    <span className="bg-gradient-to-b from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Cultivez vos
                    </span>
                    <span className="block bg-gradient-to-b from-green-500 to-emerald-400 bg-clip-text text-transparent">
                        connaissances vertes
                    </span>
                </h1>

                <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md">
                    GreenThumb vous accompagne pour apprendre, partager et grandir dans un
                    monde plus vert.
                </p>
            </div>
        </header>
    );
}