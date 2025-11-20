export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Politique de confidentialité (RGPD)</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Données collectées</h2>
        <ul className="list-disc pl-6">
          <li>Profil: nom, prénom, email, pseudo, photo, téléphone (optionnel)</li>
          <li>Inventaire des plantes, notes, tâches, rappels, événements</li>
          <li>Contenus partagés (photos, messages, conseils)</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Finalités</h2>
        <p>
          Gestion de votre compte, planification des tâches, notifications, partage communautaire, amélioration du service.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Stockage et durée</h2>
        <p>
          Données stockées sur serveurs sécurisés en UE, conservées tant que le compte est actif, supprimées sous 30 jours après suppression.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Accès</h2>
        <p>
          Seule l’équipe GreenThumb et ses prestataires techniques y ont accès. Vous pouvez rendre votre profil privé dans les paramètres.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Vos droits</h2>
        <p>
          Accès, modification, suppression de vos données: contactez <a href="mailto:contact@greenthumb.fr" className="underline">contact@greenthumb.fr</a>.
        </p>
      </section>
    </main>
  );
}