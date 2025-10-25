import FallingLeaves from "../shared/components/ui/FallingLeaves.tsx";
import {useSeason} from "../shared/hooks/useSeason.ts";
import Snowflakes from "../shared/components/ui/Snowflakes.tsx";
import SakuraPetals from "../shared/components/ui/SakuraPetals.tsx";
import type {Discussion} from "../shared/types/discussion.ts";
import {formatDateFr, formatTimeAgo} from "../shared/utils/date.ts";
import { motion } from "framer-motion";
import type {JSX} from "react";
import type {Tutorial} from "../shared/types/tutorial.ts";
import {ArrowRight} from "lucide-react";

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

const tutorial: Tutorial[] = [
    {
        tag: "Guides",
        title: "Guide complet de l'arrosage en été",
        date: "2025-6-12",
        imageUrl: "https://images.pexels.com/photos/4503261/pexels-photo-4503261.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
        tag: "Guides",
        title: "Guide complet de l'arrosage en été",
        date: "2025-6-12",
        imageUrl: "https://images.pexels.com/photos/4503261/pexels-photo-4503261.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
        tag: "Guides",
        title: "Guide complet de l'arrosage en été",
        date: "2025-6-12",
        imageUrl: "https://images.pexels.com/photos/4503261/pexels-photo-4503261.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
]

/**
 * Base component that displays the home page.
 *
 * @component
 * @return  {JSX.Element} The rendered HomePage component.
 */
export default function HomePage(): JSX.Element {
    return (
        <main className="flex flex-col min-h-screen items-center">
            <HeaderHome />
            <AboutMe />
            <CommunitySection />
            <TutorialSession />
            <AdvantageSection />
            < CallToActionSection />
        </main>
    );
}

/**
 * Header section of the home page
 *
 * Displays a seasonal visual (based on the current season)
 * along with a headline, a subtitle, and a brief introduction
 * encouraging users to join the GreenThumb community
 *
 * @component
 * @return {JSX.Element} The rendering header for the home page
 */
function HeaderHome(): JSX.Element {
    const season = useSeason()

    return (
        <header
            className="w-screen relative bg-gradient-to-b from-green-50 to-green-100 px-6 sm:px-10 md:px-20 lg:px-32 xl:px-48 py-10 sm:py-14 md:py-20 lg:py-28 text-center flex flex-col items-center overflow-hidden">
            {getSeasonUI(season)}
            <div className="flex flex-col items-center gap-4 max-w-xl">
                <h2 className="text-sm font-medium text-green-700 bg-green-100/70 border border-green-200 px-4 py-1 rounded-full [animation:circle-reveal_2s_ease-in-out_forwards]">
                    🌿 Rejoignez plus de 1000 jardiniers passionnés
                </h2>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                    <span className="bg-gradient-to-b from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Cultivez vos
                    </span>
                    <span
                        className="block bg-gradient-to-b from-green-500 to-emerald-400 bg-clip-text text-transparent">
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

function CallToActionSection() {
    return (
      <section className="relative w-full bg-gradient-to-br from-green-400 via-emerald-500 to-amber-400 text-white text-center py-24 px-6 sm:px-10 overflow-hidden">
          <div className="max-w-3xl mx-auto flex flex-col items-center space-y-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                  Prêt à faire pousser vos <br className="hidden sm:block"/> connaissance&nbsp;?
              </h2>

              <p className="text-lg text-green-50/90 max-w-xl mx-auto">
                  Rejoignez GreenThumb gratuitement et commencez votre aventure verte dès aujourd'hui
              </p>

              <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  href="#"
                  className="inline-flex items-center justify-center gap-2 bg-white text-green-700 font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                  Créer mon compte gratuitement
                  <ArrowRight className="w-4 h-4" />
              </motion.a>

          </div>
      </section>
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

function AdvantageSection() {
    return (
        <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4 sm:px-6 lg:px-10 text-center">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-12">
                    Ce que vous obtenez avec GreenThumb
                </h2>

                <AdvantageCards />
            </div>
        </section>
    );
}

function AdvantageCards() {
    const advantages = [
        "Accès illimité à tous les guides et tutoriels",
        "Participez aux discussions de la communauté",
        "Suivez l'évolution de vos plantes",
        "Recevez des conseils personnalisés",
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {advantages.map((advantage, index) => (
                <AdvantageCard key={index} description={advantage} />
            ))}
        </div>
    );
}

function AdvantageCard({description}: { description: string }) {
    return (
        <motion.article
            whileHover={{ y: -4, scale: 1.02, boxShadow: "0 10px 18px rgba(0,0,0,0.05)" }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-white rounded-2xl border border-green-100 p-6 text-left shadow-sm hover:shadow-md cursor-pointer"
        >
            <p className="text-base sm:text-lg font-medium text-gray-800">
                {description}
            </p>
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

function TutorialSession() {
    return (
        <section className="bg-gradient-to-b py-12 px-4 sm:px-6 md:px-10 text-center">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    Guides et tutoriels experts
                </h2>

                <p className="text-gray-600 text-sm sm:text-base mb-10">
                    Apprenez de nouvelles techniques avec nos ressources détaillées
                </p>
                <TutorialCards data={tutorial}/>
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

function TutorialCards({ data }: { data: Tutorial[]}) {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {data.map((item, index) => (
                <TutorialCard key={index} {...item} />
            ))}
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

function TutorialCard({tag, title, date, imageUrl}: Tutorial) {
    return (
        <motion.article
            whileHover={{ y: -6, scale: 1.03, boxShadow: "0 12px 20px rgba(0,0,0,0.08)" }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer flex flex-col"
        >
            {/* Image section */}
            <div className="relative w-full h-32 sm:h-40 bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-4xl">🌞</span>
                )}
            </div>

            {/* Content section */}
            <div className="p-5 sm:p-6 flex flex-col flex-1">
                <span className="inline-block text-[11px] sm:text-xs font-medium bg-green-50 text-green-700 border border-green-100 px-2.5 py-0.5 rounded-full mb-3">
                    {tag}
                </span>

                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                    {title}
                </h3>

                <TutorialCardFooter date={date} />
            </div>
        </motion.article>
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

function TutorialCardFooter({date}: {date: string}) {
    return (
        <footer className="flex flex-wrap items-center gap-x-2 text-sm text-gray-500">
            <span>{formatDateFr(date)}</span>
        </footer>
    );
}

function getSeasonUI(season: string) {
    return <>
        {season === "autumn" && <FallingLeaves/>}
        {season === "winter" && <Snowflakes/>}
        {season === "spring" && <SakuraPetals/>}
    </>;
}