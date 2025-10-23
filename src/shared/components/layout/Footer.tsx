import logo from '../../../assets/logo.png'

export default function Footer() {
    return <footer className="bg-gt-light-grey text-gt-dark-green py-16 border-t border-border">
        <div className="container mx-auto px-4">
            <div className="flex flex-col lg:justify-between md:flex-row gap-12 mb-12 ">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <img src={logo} className="w-10 h-auto text-white" alt="logo"/>
                        <span className="text-xl text-gt-green font-bold gradient-text">GreenThumb</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed max-w-md">
                        La plateforme éducative dédiée au jardinage. Cultivez vos connaissances avec une communauté
                        passionnée et des ressources expertes.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold mb-4">Légal</h3>
                    <div className="space-y-3">
                        <a href="#" className="block hover:text-gt-black transition-colors">Mentions
                            légales</a>
                        <a href="#" className="block hover:text-gt-black transition-colors">Politique
                            de confidentialité</a>
                        <a href="#"
                           className="block hover:text-gt-black transition-colors">CGU</a>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
                <p>© 2025 GreenThumb. Tous droits réservés. Cultivé avec 💚</p>
            </div>
        </div>
    </footer>
}