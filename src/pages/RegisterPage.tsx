import logo from "../assets/logo.png"

export default function RegisterPage() {
    return <main className="min-h-screen bg-gt-light-grey">
        <img src={logo} className="w-15 h-auto" alt="Logo" />

        <div>
            <h1>Inscription</h1>

            <form>
                <div>
                    <label>Nom d'utilisateur</label>
                    <input type="text" placeholder="PlantQueen" />

                    <div>
                        <label>Nom*</label>
                        <input type="text" placeholder="Aerts" />

                        <label>Prénom*</label>
                        <input type="text" placeholder="Emelie"/>
                    </div>

                    <label></label>
                </div>
            </form>
        </div>
    </main>
}