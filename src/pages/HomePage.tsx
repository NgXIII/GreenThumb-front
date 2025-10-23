import FallingLeaves from "../shared/components/ui/FallingLeaves.tsx";
import {useSeason} from "../shared/hooks/useSeason.ts";
import Snowflakes from "../shared/components/ui/Snowflakes.tsx";
import SakuraPetals from "../shared/components/ui/SakuraPetals.tsx";
import type {Discussion} from "../shared/types/discussion.ts";
import {formatTimeAgo} from "../shared/utils/date.ts";
import { motion } from "framer-motion";

const discussion: Discussion[] = [
    {
        tag: "Conseils",
        title: "Meilleurs engrais naturels pour plantes d'intérieur ?",
        author: "PlantGirl",
        commentsCount: 18,
        time: "2025-10-22T14:00:00"
    },
    {
        tag: "Conseils",
        title: "Meilleurs engrais naturels pour plantes d'intérieur ?",
        author: "PlantGirl",
        commentsCount: 18,
        time: "2025-10-22T14:00:00"
    },
    {
        tag: "Conseils",
        title: "Meilleurs engrais naturels pour plantes d'intérieur ?",
        author: "PlantGirl",
        commentsCount: 18,
        time: "2025-10-23T21:46:00"
    }
]
export default function HomePage() {
    return (
        <main className="flex flex-col min-h-screen items-center">
            <HeaderHome />
            <AboutMe />
        </main>
    );
}

function HeaderHome() {
    const season = useSeason()

    return (
        <header className="w-screen relative bg-gradient-to-b from-green-50 to-green-100 px-6 sm:px-10 md:px-20 lg:px-32 xl:px-48 py-10 sm:py-14 md:py-20 lg:py-28 text-center flex flex-col items-center overflow-hidden">
            {season === "autumn" && <FallingLeaves />}
            {season === "winter" && <Snowflakes />}
            {season === "spring" && <SakuraPetals />}
            <div className="flex flex-col items-center gap-4 max-w-xl">
                <h2 className="text-sm font-medium text-green-700 bg-green-100/70 border border-green-200 px-4 py-1 rounded-full [animation:circle-reveal_2s_ease-in-out_forwards]">
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

function AboutMe() {
    return (
        <section className="w-full flex flex-col items-center text-center px-6 py-16">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl mb-3">
                Tout ce que dont vous avez besoin pour réussir
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-10">
                Une plateforme complète pensée pour les jardiniers passionnés
            </p>
            <AboutArticles />
            <CommunitySection />
        </section>
    );
}

function AboutArticles() {
    return (
        <section className="flex flex-col items-center gap-8 w-full max-w-5xl md:flex-row md:justify-center md:gap-10">
            <AboutArticle
                icon="📘"
                title="Guides experts"
                description="Des tutoriels détaillés pour tous les niveaux, du débutant au jardinier confirmé"
            />
            <AboutArticle
                icon="👥"
                title="Communauté active"
                description="Échangez avec des passionnés et partagez vos expériences de jardinage"
            />
            <AboutArticle
                icon="🌱"
                title="Pratiques durables"
                description="Apprenez des techniques écologiques respectueuses de l'environnement"
            />
        </section>
    );
}

function AboutArticle({icon, title, description}: {icon: string, title: string; description: string}) {

    return (
        <motion.article
            whileHover={{ y: -6, scale: 1.03, boxShadow: "0 12px 20px rgba(0,0,0,0.1)" }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 text-left cursor-pointer"
        >
            <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg text-white text-2xl mr-4">
                    {icon}
                </div>
                <h3 className="text-lg font-semibold text-green-700">{title}</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </motion.article>
    );
}

function CommunitySection() {
    return (
        <section className="bg-gradient-to-b py-12 px-4 sm:px-6 md:px-10 text-center">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    Rejoignez la conversion
                </h2>

                <p className="text-gray-600 text-sm sm:text-base mb-10">
                    Découvrez ce que la communauté partage en ce moment
                </p>
                <CommunityCards data={discussion}/>
            </div>
        </section>
    );
}

function CommunityCards({ data }: { data: Discussion[]}) {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {data.map((item, index) => (
                <CommunityCard key={index} {...item} />
            ))}
        </section>
    );
}

function CommunityCard({tag, title, author, commentsCount, time}: Discussion) {
    return (
        <motion.article
            whileHover={{ y: -6, scale: 1.03, boxShadow: "0 12px 20px rgba(0,0,0,0.1)" }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 text-left cursor-pointer"
        >
            <span className="inline-block text-xs sm:text-sm font-medium bg-gray-100 text-gray-800 px-3 py-1 rounded-full mb-3">
               {tag}
            </span>

            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 line-clamp-2">
                {title}
            </h3>

            <CommunityCardFooter author={author} commentsCount={commentsCount} time={time} />
        </motion.article>
    );

}

function CommunityCardFooter({author, commentsCount, time}: {author: string, commentsCount: number, time: string}) {
    return (
        <footer className="flex flex-wrap items-center gap-x-2 text-sm text-gray-500">
            <span>{author}</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
                     <svg
                         xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 24 24"
                         fill="currentColor"
                         className="w-4 h-4 text-gray-500"
                     >
                          <path
                              fillRule="evenodd"
                              d="M4.5 4.5A2.25 2.25 0 0 0 2.25 6.75v8.25a2.25 2.25 0 0 0 2.25 2.25h2.25v3.75l4.5-3.75h6a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 17.25 4.5H4.5Zm0 1.5h12.75a.75.75 0 0 1 .75.75v8.25a.75.75 0 0 1-.75.75h-6.374a.75.75 0 0 0-.48.175L8.25 18.22v-2.195a.75.75 0 0 0-.75-.75H4.5a.75.75 0 0 1-.75-.75V6.75a.75.75 0 0 1 .75-.75Z"
                              clipRule="evenodd"
                          />
                     </svg>
                     <span>{commentsCount}</span>
                </span>
            <span>•</span>
            <span>{formatTimeAgo(time)}</span>
        </footer>
    );
}