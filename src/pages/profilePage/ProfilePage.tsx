// typescript
    import { useEffect } from "react";
    import type {UserAccount} from "@/shared/types/user";
    import type {Stat} from "@/shared/types/stat";
    import {StatCard} from "./StatCard";
    import {Mail, Phone, User} from "lucide-react";
    import type {FC} from "react";
    import {useUserStore} from "@/app/stores/userStore.ts";

    // Mock stats temporaire - À remplacer par un appel API si nécessaire
    const mockStats: Stat = {
        plants: 15,
        tasksCompleted: 3,
        discussions: 4
    };

    const DEFAULT_AVATAR = "/users/default.png"; // On garde le chemin relatif simple pour l'avatar par défaut

    function resolveAvatar(avatar?: string) {
        if (!avatar) return DEFAULT_AVATAR;

        // 1. Si l'avatar est déjà une URL complète (http://...) ou une chaîne data:
        if (avatar.startsWith("http") || avatar.startsWith("data:")) return avatar;

        // 🔴 HARDCODE: Définir l'URL de base de l'API ici
        const BASE_URL = "http://localhost:8080";

        // 2. Si l'avatar commence par un slash, on l'attache directement à la base.
        // Ex: avatar est "/users/avatar.jpg" -> http://localhost:8080/users/avatar.jpg
        if (avatar.startsWith("/")) {
            // base.replace(/\/$/, "") assure qu'il n'y a pas de double slash (//) si BASE_URL finissait par /
            return `${BASE_URL.replace(/\/$/, "")}${avatar}`;
        }

        // 3. L'avatar est un chemin relatif "users/b5a19de2-78a9-4175-bcdc-ac40964e8a27.jpg"
        // On ajoute l'URL de base et le chemin de l'avatar.
        // Ex: http://localhost:8080/users/b5a19de2-78a9-4175-bcdc-ac40964e8a27.jpg

        // On retire un éventuel slash en début de "avatar" avant de le joindre à la BASE_URL
        return `${BASE_URL.replace(/\/$/, "")}/${avatar.replace(/^\/+/, "")}`;
    }

    type ProfileHeaderProps = {
        user: UserAccount;
    };

    const ProfileHeader: FC<ProfileHeaderProps> = ({ user }) => (
        <div className="bg-gt-surface-elevated rounded-2xl shadow-xl overflow-hidden mb-8 text-gt-text">
            <div
                className="bg-gt-primary h-32"
                role="presentation"
                aria-hidden="true"
            />
            <div className="px-8 pb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12">
                    <img
                        src={resolveAvatar(user.avatar)}
                        alt={`Avatar de ${user.firstname} ${user.lastname}`}
                        className="w-32 h-32 rounded-full border-4 border-gt-border shadow-lg bg-gt-surface object-cover"
                        loading="lazy"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                        }}
                    />
                    <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-gt-text">
                            {user.firstname} {user.lastname}
                        </h1>
                        <p className="text-gt-text-muted flex items-center justify-center sm:justify-start gap-1">
                            <User className="w-4 h-4" aria-hidden="true" />
                            <span>@{user.username}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    type PersonalInfoProps = {
        user: UserAccount;
    };

    const PersonalInfo: FC<PersonalInfoProps> = ({ user }) => (
        <section className="bg-gt-surface-elevated rounded-2xl shadow-xl p-8 mb-8 text-gt-text" aria-labelledby="personal-info-title">
            <h2 id="personal-info-title" className="text-2xl font-bold text-gt-text mb-6">
                Informations personnelles
            </h2>
            <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gt-surface-hover rounded-lg">
                    <Mail className="w-5 h-5 text-gt-interactive" aria-hidden="true" />
                    <div>
                        <p className="text-sm text-gt-text-muted">Email</p>
                        <p className="text-gt-text font-medium">
                            <a href={`mailto:${user.email}`} className="hover:underline">
                                {user.email}
                            </a>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gt-surface-hover rounded-lg">
                    <Phone className="w-5 h-5 text-gt-interactive" aria-hidden="true" />
                    <div>
                        <p className="text-sm text-gt-text-muted">Téléphone</p>
                        <p className="text-gt-text font-medium">
                            <a href={`tel:${user.phoneNumber.replace(/\s/g, '')}`} className="hover:underline">
                                {user.phoneNumber}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );

    type StatsProps = {
        stats: Stat;
    };

    const Stats: FC<StatsProps> = ({ stats }) => (
        <section className="bg-gt-surface-elevated rounded-2xl shadow-xl p-8 text-gt-text" aria-labelledby="stats-title">
            <h2 id="stats-title" className="text-2xl font-bold text-gt-text mb-6">
                Mes statistiques
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Plantes"
                    value={stats.plants}
                    icon="plants"
                    color="green"
                />
                <StatCard
                    title="Tâches complétées"
                    value={stats.tasksCompleted}
                    icon="tasks"
                    color="blue"
                />
                <StatCard
                    title="Discussions"
                    value={stats.discussions}
                    icon="discussions"
                    color="purple"
                />
            </div>
        </section>
    );

    export const ProfilePage: FC = () => {
        const { user } = useUserStore.getState();

        console.log("avatar : ", user?.avatar);
        console.log("user : ", user);
        console.log("résolu avatar :", resolveAvatar(user?.avatar));

        useEffect(() => {
            console.log("user avatar :", user?.avatar);
        }, [user]);

        if (!user) {
            return (
                <div className="min-h-screen bg-gt-surface flex items-center justify-center">
                    <p className="text-gt-text-muted">Chargement du profil...</p>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-gt-surface py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <ProfileHeader user={user} />
                    <PersonalInfo user={user} />
                    <Stats stats={mockStats} />
                </div>
            </div>
        );
    };