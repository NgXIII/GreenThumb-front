import { Link } from "react-router-dom";
import logo from '../../../assets/logo.png'

export default function Footer() {
    return <footer className="bg-gt-surface text-gt-text py-16 border-t border-gt-border transition-colors duration-300">
        <div className="container mx-auto px-4">
            <div className="flex flex-col lg:justify-between md:flex-row gap-12 mb-12 ">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <img src={logo} className="w-10 h-auto" alt="logo"/>
                        <span className="text-xl text-gt-primary font-bold">GreenThumb</span>
                    </div>
                    <p className="text-gt-text-muted leading-relaxed max-w-md">
                        La plateforme éducative dédiée au jardinage. Cultivez vos connaissances avec une communauté
                        passionnée et des ressources expertes.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold mb-4 text-gt-text">Légal</h3>
                    <div className="space-y-3">
                        <Link to="/legal-notice" className="block hover:text-gt-black transition-colors">Mentions légales</Link>
                        <Link to="/rgpd" className="block hover:text-gt-black transition-colors">Politique de confidentialité</Link>
                        <Link to="/cgu" className="block hover:text-gt-black transition-colors">CGU</Link>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-gt-border text-center text-sm text-gt-text-muted">
                <p>© 2025 GreenThumb. Tous droits réservés. Cultivé avec 💚</p>
            </div>
        </div>
    </footer>
}