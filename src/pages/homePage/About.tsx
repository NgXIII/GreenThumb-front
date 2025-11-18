import CardBase from "./CardBase.tsx";

export default function AboutMe() {
    return (
        <section className="w-full flex flex-col items-center text-center px-6 py-16 bg-gt-surface transition-colors duration-300">
            <h2 className="text-2xl font-bold text-gt-text sm:text-3xl md:text-4xl mb-3">
                Tout ce que dont vous avez besoin pour réussir
            </h2>
            <p className="text-gt-text-muted text-base sm:text-lg mb-10">
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

function AboutArticle({icon, title, description}: {icon: string, title: string; description: string}) {
    return (
        <CardBase>
            <div className="p-3 sm:p-4">
                <div className="flex items-center mb-4">
                    <div
                        className="flex items-center justify-center w-12 h-12 bg-gt-primary rounded-lg text-gt-primary-foreground text-2xl mr-4">
                        {icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gt-text-accent">{title}</h3>
                </div>
                <p className="text-gt-text-muted text-sm leading-relaxed">{description}</p>
            </div>
        </CardBase>
    );
}
