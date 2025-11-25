export default function TermsOfUsePage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Conditions Générales d’Utilisation (CGU)</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Utilisation du service</h2>
        <p>
          GreenThumb permet de gérer son jardin, d’ajouter des plantes, de planifier des tâches et de partager des conseils. L’utilisateur s’engage à fournir des informations exactes.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Règles et comportement</h2>
        <ul className="list-disc pl-6">
          <li>Respecter les autres membres</li>
          <li>Ne pas publier de contenus illicites ou offensants</li>
          <li>Pas d’utilisation commerciale sans autorisation</li>
          <li>Respecter la propriété intellectuelle</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Modération et sanctions</h2>
        <p>
          L’équipe peut modérer ou supprimer tout contenu non conforme. En cas d’abus, le compte pourra être suspendu ou supprimé.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Responsabilité</h2>
        <p>
          GreenThumb n’est pas responsable en cas de panne, perte de données ou indisponibilité. L’utilisateur doit sauvegarder ses données.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Propriété du contenu</h2>
        <p>
          Les contenus publiés restent la propriété de l’utilisateur, mais GreenThumb dispose d’une licence d’affichage sur la plateforme.
        </p>
      </section>
    </main>
  );
}