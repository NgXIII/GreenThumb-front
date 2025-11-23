import type {UserAccount} from "@/shared/types/user";
import type {Stat} from "@/shared/types/stat";
import {StatCard} from "./StatCard";
import {Mail, Phone, User, FileText, Lock, SquarePen} from "lucide-react";
import {Button} from "@/shared/components/ui/button.tsx";

// Mock data - À remplacer par un hook useUser() ou un contexte
const mockUser: UserAccount = {
    username: "johndoe",
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    phoneNumber: "+32478092427",
    biography: "Passionné de jardinage et de botanique depuis plus de 10 ans. J'adore partager mes connaissances sur les plantes et découvrir de nouvelles espèces. Mon objectif est de créer un jardin durable et respectueux de l'environnement."
}

const mockStats: Stat = {
    plants: 12,
    tasksCompleted: 45,
    discussions: 23
}

type ProfileHeaderProps = {
    user: UserAccount;
}

type PersonalInfoProps = {
    user: UserAccount;
}

type BiographyProps = {
    user: UserAccount;
}

type StatsProps = {
    stats: Stat;
}

export default function ProfilePage(){
    // TODO: Remplacer par un hook personnalisé
    // const { user, isLoading, error } = useUser();
    // const { stats } = useUserStats(user?.id);

    const user = mockUser;
    return (
        <div className="min-h-screen border-gt-light-grey py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <ProfileHeader user={user} />
                <PersonalInfo user={user} />
                <Biography user={user} />
                <Stats stats={mockStats} />
            </div>
        </div>
    )
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => (
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

                <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {user.firstname} {user.lastname}
                            </h1>
                            <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                                <User className="w-4 h-4" aria-hidden="true" />
                                <span>@{user.username}</span>
                            </p>
                        </div>

                        <Button className="bg-orange-50 hover:bg-orange-100 border border-orange-500 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 whitespace-nowrap">
                            <p className="text-orange-700">Editer votre profil</p>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

const PersonalInfo = ({ user }: PersonalInfoProps) => (
    <section className="bg-white rounded-2xl shadow-xl p-8 mb-8" aria-labelledby="personal-info-title">
        <h2 id="personal-info-title" className="text-2xl font-bold text-gray-900 mb-6">
            Informations personnelles
        </h2>
        <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="hidden lg:block w-5 h-5 text-green-600" aria-hidden="true" />
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
                <Phone className="hidden lg:block w-5 h-5 text-green-600" aria-hidden="true" />
                <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="text-gray-900 font-medium">
                        <a href={`tel:${user.phoneNumber.replace(/\s/g, '')}`} className="hover:underline">
                            {user.phoneNumber}
                        </a>
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                    <Lock className="hidden lg:block w-5 h-5 text-green-600" aria-hidden="true" />
                    <div>
                        <p className="text-sm text-gray-500">Mot de passe</p>
                        <div className="flex items-center gap-3">
                            <p className="text-gray-900 font-medium">
                                *************
                            </p>
                        </div>
                    </div>
                </div>
                <Button className="bg-[#fffbf0] hover:bg-[#fffbf0] border border-[#ffd043] cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <SquarePen className="text-[#ffd043]" />
                </Button>
            </div>
        </div>
    </section>
)

const Biography = ({ user }: BiographyProps) => (
    <section className="bg-white rounded-2xl shadow-xl p-8 mb-8" aria-labelledby="biography-title">
        <h2 id="biography-title" className="text-2xl font-bold text-gray-900 mb-6">
            Biographie
        </h2>
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <FileText className="hidden lg:block w-5 h-5 text-green-600 mt-1 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1">
                <p className="text-gray-900 leading-relaxed">
                    {user.biography || "Aucune biographie renseignée."}
                </p>
            </div>
        </div>
    </section>
)

const Stats = ({ stats }: StatsProps) => (
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
)