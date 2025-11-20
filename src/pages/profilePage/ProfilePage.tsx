import type {UserAccount} from "@/shared/types/user";
import type {Stat} from "@/shared/types/stat";
import {StatCard} from "./StatCard";
import {Mail, Phone, User} from "lucide-react";
import type {FC} from "react";

// Mock data - À remplacer par un hook useUser() ou un contexte
const mockUser: UserAccount = {
    username: "johndoe",
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    phoneNumber: "+33 6 12 34 56 78"
};

const mockStats: Stat = {
    plants: 12,
    tasksCompleted: 45,
    discussions: 23
};

type ProfileHeaderProps = {
    user: UserAccount;
};

const ProfileHeader: FC<ProfileHeaderProps> = ({ user }) => (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div
            className="bg-gt-green h-32"
            role="presentation"
            aria-hidden="true"
        />
        <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12">
                <img
                    src={user.avatar}
                    alt={`Avatar de ${user.firstname} ${user.lastname}`}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white"
                    loading="lazy"
                />
                <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {user.firstname} {user.lastname}
                    </h1>
                    <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-1">
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
    <section className="bg-white rounded-2xl shadow-xl p-8 mb-8" aria-labelledby="personal-info-title">
        <h2 id="personal-info-title" className="text-2xl font-bold text-gray-900 mb-6">
            Informations personnelles
        </h2>
        <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-green-600" aria-hidden="true" />
                <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900 font-medium">
                        <a href={`mailto:${user.email}`} className="hover:underline">
                            {user.email}
                        </a>
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-green-600" aria-hidden="true" />
                <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="text-gray-900 font-medium">
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
    <section className="bg-white rounded-2xl shadow-xl p-8" aria-labelledby="stats-title">
        <h2 id="stats-title" className="text-2xl font-bold text-gray-900 mb-6">
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
    // TODO: Remplacer par un hook personnalisé
    // const { user, isLoading, error } = useUser();
    // const { stats } = useUserStats(user?.id);

    const user = mockUser;
    return (
        <div className="min-h-screen border-gt-light-grey py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <ProfileHeader user={user} />
                <PersonalInfo user={user} />
                <Stats stats={mockStats} />
            </div>
        </div>
    );
};