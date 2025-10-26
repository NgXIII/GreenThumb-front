import FallingLeaves from "../shared/components/ui/FallingLeaves.tsx";
import {useSeason} from "../shared/hooks/useSeason.ts";
import Snowflakes from "../shared/components/ui/Snowflakes.tsx";
import SakuraPetals from "../shared/components/ui/SakuraPetals.tsx";
import Tag from "../shared/components/ui/Tag.tsx";
import type {Message} from "../shared/types/message.ts";
import {formatDateFr, formatTimeAgo} from "../shared/utils/date.ts";
import { motion } from "framer-motion";
import {type JSX} from "react";
import type {Tutorial} from "../shared/types/tutorial.ts";
import {ArrowRight} from "lucide-react";
import * as React from "react";
import useTopMessages from "../shared/hooks/useTopMessages.ts";
import {useUserCount} from "../shared/hooks/useUserCount.ts";

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
            <CallToActionSection />
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
    const season = useSeason();
    const { userCount, error, loading } = useUserCount();

    const plural = userCount && userCount > 1 ? "s" : "";

    return (
        <header
            className="w-screen relative bg-gradient-to-b from-green-50 to-green-100 px-6 sm:px-10 md:px-20 lg:px-32 xl:px-48 py-10 sm:py-14 md:py-20 lg:py-28 text-center flex flex-col items-center overflow-hidden">
            {getSeasonUI(season)}

            {error && <p className="text-red-500">Erreur : {error}</p>}
            <div className="flex flex-col items-center gap-4 max-w-xl">
                <h2 className="text-sm font-medium text-green-700 bg-green-100/70 border border-green-200 px-4 py-1 rounded-full [animation:circle-reveal_2s_ease-in-out_forwards]">
                    {loading
                        ? "Chargement des jardiniers..."
                        : `🌿 Rejoignez plus de ${userCount ?? 0} jardinier${plural} passionnés`}
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
    const { messages, error, loading } = useTopMessages();

    return (
        <section className="bg-gradient-to-b py-12 px-4 sm:px-6 md:px-10 text-center">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    Rejoignez la conversion
                </h2>

                <p className="text-gray-600 text-sm sm:text-base mb-10">
                    Découvrez ce que la communauté partage en ce moment
                </p>

                {loading && <p>Chargement...</p>}
                {error && <p className="text-red-500">Erreur : {error}</p>}
                {!loading && !error && <CommunityCards data={messages} />}
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

function CommunityCards({ data }: { data: Message[]}) {
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

function CardBase({ children }: { children: React.ReactNode }) {
    return (
        <motion.article
            whileHover={{ y: -6, scale: 1.03, boxShadow: "0 12px 20px rgba(0,0,0,0.08)" }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer flex flex-col text-left shadow-sm hover:shadow-md"
        >
            {children}
        </motion.article>
    );
}
function AboutArticle({icon, title, description}: {icon: string, title: string; description: string}) {

    return (
        <CardBase>
            <div className="p-3 sm:p-4">
                <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg text-white text-2xl mr-4">
                        {icon}
                    </div>
                    <h3 className="text-lg font-semibold text-green-700">{title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </div>
        </CardBase>
    );
}

function TutorialCard({ tag, title, date, imageUrl }: Tutorial) {
    return (
        <CardBase>
            <div className="relative w-full h-44 sm:h-48 bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center overflow-hidden">
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

            <div className="p-5 sm:p-6 flex flex-col flex-1 items-center">
                <div className="mb-3">
                    <Tag tag={tag} color="amber" />
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                    {title}
                </h3>

                <TutorialCardFooter date={date} />
            </div>
        </CardBase>
    );
}

function CommunityCard({tags, title, author, likeCount, date}: Message) {
    return (
        <CardBase>
            <div className="p-3 sm:p-4">
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {
                        tags.map((tag, index) => (
                        <Tag key={index} tag={tag} color="green" />
                    ))
                    }
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 line-clamp-2">
                    {title}
                </h3>

                <CommunityCardFooter author={author} commentsCount={likeCount} time={date} />
            </div>
        </CardBase>
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
                     className="w-5 h-5 text-green-600 hover:text-green-700 transition-colors duration-200"
                 >
                    <path d="M12 2a1 1 0 0 1 1 1v3c1.933 0 3.5 1.567 3.5 3.5S14.933 13 13 13h-2v8a1 1 0 1 1-2 0v-8H7c-1.933 0-3.5-1.567-3.5-3.5S5.067 6 7 6V3a1 1 0 0 1 1-1h4zm0 2h-2v2h2V4zM7 8C6.172 8 5.5 8.672 5.5 9.5S6.172 11 7 11h6c.828 0 1.5-.672 1.5-1.5S13.828 8 13 8H7z" />
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