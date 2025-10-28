import FallingLeaves from "../../shared/components/ui/FallingLeaves.tsx";
import {useSeason} from "../../shared/hooks/useSeason.ts";
import Snowflakes from "../../shared/components/ui/Snowflakes.tsx";
import SakuraPetals from "../../shared/components/ui/SakuraPetals.tsx";
import { motion } from "framer-motion";
import {type JSX} from "react";
import {ArrowRight} from "lucide-react";
import {useUserCount} from "../../shared/hooks/useUserCount.ts";
import AboutMe from "./About.tsx";
import CommunitySection from "./Community.tsx";
import TutorialSession from "./Tutorial.tsx";

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

function getSeasonUI(season: string) {
    return <>
        {season === "autumn" && <FallingLeaves/>}
        {season === "winter" && <Snowflakes/>}
        {season === "spring" && <SakuraPetals/>}
    </>;
}