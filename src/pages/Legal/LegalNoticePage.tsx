import { Mail } from "lucide-react";
export default function LegalNoticePage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Mentions légales</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Éditeur du site</h2>
        <p>
          <strong>GreenThumb</strong><br />
          Société fictive pour projet pédagogique<br />
          123 rue des Plantes, 4000 Liège, Belgique
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-green-600" />
          <a href="mailto:contact@greenthumb.fr" className="underline">contact@greenthumb.fr</a>
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Propriété intellectuelle</h2>
        <p>
          Tous les contenus (textes, images, code, logo) sont la propriété exclusive de GreenThumb ou de leurs auteurs. Toute reproduction est interdite sans autorisation.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Responsabilité</h2>
        <p>
          GreenThumb s’efforce de fournir des informations fiables mais ne peut garantir l’exactitude ou l’exhaustivité. L’utilisation du site se fait sous la seule responsabilité de l’utilisateur.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Identité officielle</h2>
        <p>
          GreenThumb est une application web dédiée à la gestion de jardin et au partage d’expériences entre passionnés.
        </p>
      </section>
    </main>
  );
}