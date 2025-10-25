import logo from "../assets/logo.png"
import Input from "../shared/components/ui/Input.tsx";
import {Link} from "react-router-dom";

export default function RegisterPage() {
    return <main className="w-full bg-red-700 text-black">
        <img src={logo} className="w-15 h-auto" alt="Logo" />

        <div>
            <h1>Inscription</h1>

            <form>
                <div>
                    <Input inputType="text" placeholder="PlantQueen" label="Nom d'utilisateur*" />

                    <div>
                        <Input inputType="text" placeholder="Aerts" label="Nom*" />
                        <Input inputType="text" placeholder="Emelie" label="Prénom*" />
                    </div>

                    <Input inputType="password" label="Mot de passe*" placeholder="*********" />
                    <Input inputType="password" label="Confirmer le mot de passe*" placeholder="*********" />
                </div>

                {/* Vertical */}
                <div className="hidden lg:block w-px h-full bg-gray-300"></div>
                {/* Horizontal */}
                <div className="lg:hidden h-px w-full bg-gray-300"></div>

                <div>
                    <Input inputType="file" label="Photo de profil" placeholder="(PNG, JPG, JPEG)"/>
                    <Input inputType="email" label="E-mail*" placeholder="emilie.aerts@gmail.com"/>
                    <Input inputType="number" label="Téléphone*" placeholder="0123456789" />
                </div>

                <div>
                    <input type="checkbox"/>
                    <div>
                        <p>J'accepte les </p>
                        <a href="#">Conditions générales d'utilisation </a>
                        <p>et la </p>
                        <a href="#">Politique de Confidentialité</a>
                    </div>
                </div>


                <button>S'inscrire</button>
            </form>
        </div>

        <div>
            <p>Déjà inscrit ? </p>
            <Link to="/">Connectez-vous</Link>
        </div>
    </main>
}