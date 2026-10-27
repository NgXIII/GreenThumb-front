# GreenThumb — Front

Interface web de **GreenThumb**, une application communautaire autour du jardinage et de l'entretien des plantes :

- **Tableau de bord** : ajout, édition et suivi de ses plantes, avec tâches d'entretien (arrosage, etc.).
- **Ressources** : articles / fiches de conseils (création et modification réservées aux admins).
- **Forum** : canaux, fils de discussion, réactions, envoi de médias, signalements, système d'XP et de paliers (tiers).
- **Notifications temps réel** via WebSocket (STOMP + SockJS).
- **Profil** : profil privé et public, statistiques, confidentialité, changement de mot de passe, désactivation du compte.
- **Authentification** : inscription, connexion, vérification d'e-mail, mot de passe oublié, refresh token automatique.
- **Administration** : tableau de bord, modération, gestion des utilisateurs, e-mails groupés, gestion des rôles (super admin).
- Pages légales (mentions légales, RGPD, CGU), thème clair/sombre, animations saisonnières.

Ce dépôt ne contient que le front. Il consomme une API back-end (par défaut sur `http://localhost:8080`).

## Stack

| Domaine | Outils |
|---|---|
| Framework | React 19, TypeScript, Vite 7 |
| Routing | React Router 7 (`createBrowserRouter` + loaders) |
| Données | TanStack Query, Axios |
| État global | Zustand (compte persisté dans `localStorage`) |
| Formulaires | React Hook Form + Zod |
| UI | Tailwind CSS 4, composants shadcn/ui (Radix), lucide-react, framer-motion, sonner |
| Temps réel | @stomp/stompjs + sockjs-client |
| Tests | Vitest, Testing Library, jsdom |

## Prérequis

- **Node.js 22** (version utilisée par la CI ; 18 minimum) et npm
- L'**API back-end GreenThumb** lancée et accessible (par défaut `http://localhost:8080`)

## Installation et lancement

```bash
npm install
```

```bash
npm run dev
```

L'application est disponible sur http://localhost:5173.

### Configuration

Une seule variable d'environnement, lue au moment du build par Vite :

| Variable | Rôle | Défaut (`.env`) |
|---|---|---|
| `VITE_API_URL` | URL de base de l'API. Le client HTTP appelle `${VITE_API_URL}/api` et le WebSocket `${VITE_API_URL}/ws`. | `http://localhost:8080` |

Pour surcharger localement sans toucher au `.env` versionné, créez un `.env.local` :

```env
VITE_API_URL=http://localhost:8080
```

`.env.production` est utilisé par `npm run build`.

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement Vite (HMR) |
| `npm run build` | Vérification TypeScript puis build de production dans `dist/` |
| `npm run preview` | Sert le build de production localement |
| `npm run lint` | ESLint |
| `npm test` | Vitest en mode watch (`npm test -- run` pour une seule exécution, comme en CI) |
| `npm run covorage` | Tests + couverture (rapport HTML dans `coverage/`) |
| `npm run test:ui` | Interface Vitest |
| `npm run test:ui:coverage` | Interface Vitest avec couverture |

Les tests se trouvent dans `src/tests/` (`*.test.ts` / `*.test.tsx`), la configuration Vitest est dans `vite.config.ts`.

## Structure du projet

```
src/
├── app/                # Point d'entrée (main.tsx, App.tsx), routeur et loaders, stores Zustand
├── pages/              # Une page = un dossier (Dashboard, forumPage, adminPage, profilePage, Resource, ...)
├── services/
│   ├── http/           # apiClient Axios (token Bearer + refresh automatique sur 401)
│   ├── auth/           # Authentification / vérification de token
│   ├── notifications/  # API des notifications + service WebSocket
│   └── repos/          # Appels API par domaine (plantes, forum, ressources, admin, ...)
├── shared/
│   ├── components/     # Layout (NavBar, Footer, guards Require*), ui/ (shadcn + composants maison)
│   ├── hooks/          # Hooks React Query par domaine
│   ├── schemas/ types/ utils/ lib/
│   └── styles/         # CSS global Tailwind
├── mocks/              # Handlers de mock pour les tests
└── tests/              # Tests unitaires (setupTests.ts)
```

L'alias `@` pointe vers `src/` (ex. `@/shared/hooks/useAuth`).

### Routes principales

| Accès | Routes |
|---|---|
| Public | `/legal-notice`, `/rgpd`, `/cgu`, `/verifier-email` |
| Invité uniquement | `/` (accueil), `/inscription`, `/connexion`, `/connexion/forgetPassword`, `/connexion/reset-password` |
| Connecté | `/dashboard`, `/profil`, `/profil/:username`, `/modification-mot-de-passe`, `/creation-plante/:plantSlug?`, `/edition-plante/:plantSlug`, `/ressources`, `/ressources/:slug`, `/forum` |
| Admin | `/ressources/ajouter`, `/ressources/:slug/modifier`, `/admin/users`, `/admin/communications` |
| Admin ou modérateur | `/admin`, `/admin/moderation` |
| Super admin | `/admin/roles` |

L'accès est contrôlé par les composants `RequireGuest`, `RequireAuth`, `RequireAdmin`, `RequireAdminOrModerator` et `RequireSuperAdmin` (`src/shared/components/layout/`).

## Déploiement

### Docker

Le `Dockerfile` build l'application puis la sert avec `serve` sur le port 80. L'URL de l'API est injectée au build :

```bash
docker build --build-arg VITE_API_URL=https://api.example.com -t greenthumb-front .
```

```bash
docker run -p 8081:80 greenthumb-front
```

Un exemple de configuration nginx (avec fallback SPA vers `index.html`) est fourni dans `nginx-frontend.conf`.

### CI/CD (GitLab)

`.gitlab-ci.yml` définit deux étapes :

1. **test** : `npm ci` puis `npm run test -- run` (image `node:22`).
2. **build** (branche `main` uniquement) : build de l'image Docker avec `VITE_API_URL` (variable CI) et push vers le registre GitLab avec les tags `<sha>` et `latest`.
