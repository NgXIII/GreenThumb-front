import type {UserAccount} from "@/shared/types/user";
import type {Stat} from "@/shared/types/stat";
import {StatCard} from "./StatCard";
import {Mail, Phone, User, FileText, Lock, SquarePen} from "lucide-react";
import {Button} from "@/shared/components/ui/button.tsx";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Form} from "@/shared/components/ui/form.tsx";
import InputForm from "@/shared/components/ui/customs/InputForm.tsx";
import {toast} from "sonner";
import {type UserEditPost, UserEditSchema} from "@/shared/types/schemas/UserSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import InputEditAvatar from "@/shared/components/ui/customs/InputEditAvatar.tsx";
import {fileToBase64} from "@/shared/utils/FileIntoBase64.ts";
import {AxiosError} from "axios";
import {useEditUser} from "@/shared/hooks/useUser.ts";
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
    user: UserAccount
    isEditMode: boolean
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>
    previewAvatar: string
    defaultAvatar: string
    onAvatarChange: (file: File | null) => void
}

type PersonalInfoProps = {
    user: UserAccount
    isEditMode: boolean
}

type BiographyProps = {
    user: UserAccount
    isEditMode: boolean
}

type StatsProps = {
    stats: Stat
}

export default function ProfilePage(){
    const user = mockUser
    const [isEditMode, setEditMode] = useState<boolean>(false)
    const { editUser } = useEditUser();

    const form = useForm<UserEditPost>({
        resolver: zodResolver(UserEditSchema),
        mode: "all",
        defaultValues: {
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            biography: user.biography,
            avatar: user.avatar
        }
    })

    const handleAvatarChange = (file: File | null) => {
        form.setValue('avatar', file, { shouldValidate: true })
    }

    const handleCancel = () => {
        form.reset()
        setEditMode(false)
    }

    const onSubmit = async (values: UserEditPost) => {
        try {
            if (values.avatar instanceof File) {
                values.avatar = await fileToBase64(values.avatar)
            }

            const response = await editUser(user.username, values)

            toast.success(response.message)
            setEditMode(false)

        } catch (error) {
            console.error(error)

            if (error instanceof AxiosError) {
                if (error.response?.data?.message) {
                    toast.error(error.response.data.message)
                } else if (error.message) {
                    toast.error(error.message)
                } else {
                    toast.error("Erreur lors de la mise à jour du profil")
                }
            } else if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("Erreur lors de la mise à jour du profil")
            }
        }
    };

    const avatarValue = form.watch('avatar')
    const previewAvatar = avatarValue instanceof File
        ? URL.createObjectURL(avatarValue)
        : avatarValue || ''

    return (
        <div className="min-h-screen border-gt-light-grey py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <ProfileHeader
                            user={user}
                            isEditMode={isEditMode}
                            setEditMode={setEditMode}
                            previewAvatar={previewAvatar}
                            defaultAvatar={user.avatar}
                            onAvatarChange={handleAvatarChange}
                        />
                        <PersonalInfo user={user} isEditMode={isEditMode} />
                        <Biography user={user} isEditMode={isEditMode} />

                        {isEditMode && (
                            <div className="flex flex-col sm:flex-row gap-4 justify-end mb-8">
                                <Button
                                    type="button"
                                    onClick={handleCancel}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer w-full sm:w-auto"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-gt-green hover:bg-green-700 text-white cursor-pointer w-full sm:w-auto"
                                >
                                    Sauvegarder les modifications
                                </Button>
                            </div>
                        )}
                    </form>
                </Form>

                <Stats stats={mockStats} />
            </div>
        </div>
    )
}

const ProfileHeader = ({ user, isEditMode, setEditMode, previewAvatar, defaultAvatar, onAvatarChange }: ProfileHeaderProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div
                className="bg-gt-green h-32"
                role="presentation"
                aria-hidden="true"
            />
            <div className="px-8 pb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12">
                    <InputEditAvatar
                        isEditMode={isEditMode}
                        onAvatarChange={onAvatarChange}
                        previewAvatar={previewAvatar}
                        defaultAvatar={defaultAvatar}
                    />

                    <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                            <div>
                                {isEditMode ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-10">
                                            <InputForm
                                                name="firstname"
                                                inputType="text"
                                                label="Prénom"
                                                placeholder="Emelie"
                                            />
                                            <InputForm
                                                name="lastname"
                                                inputType="text"
                                                label="Nom"
                                                placeholder="Aerts"
                                            />
                                            <InputForm
                                                name="username"
                                                inputType="text"
                                                label="Nom d'utilisateur"
                                                placeholder="PlantQueen"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            {user.firstname} {user.lastname}
                                        </h1>
                                        <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                                            <User className="w-4 h-4" aria-hidden="true"/>
                                            <span>@{user.username}</span>
                                        </p>
                                    </>
                                )}
                            </div>

                            {!isEditMode && (
                                <Button
                                    type="button"
                                    className="bg-orange-50 hover:bg-orange-100 border border-orange-500 text-orange-700 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 whitespace-nowrap"
                                    onClick={() => setEditMode(true)}
                                >
                                    Éditer votre profil
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PersonalInfo = ({ user, isEditMode }: PersonalInfoProps) => (
    <section className="bg-white rounded-2xl shadow-xl p-8 mb-8" aria-labelledby="personal-info-title">
        <h2 id="personal-info-title" className="text-2xl font-bold text-gray-900 mb-6">
            Informations personnelles
        </h2>
        <div className="space-y-4">
            {isEditMode ? (
                <>
                    <InputForm
                        name="email"
                        inputType="email"
                        label="Email*"
                        placeholder="votre.email@example.com"
                    />
                    <InputForm
                        name="phoneNumber"
                        inputType="tel"
                        label="Téléphone*"
                        placeholder="0123456789"
                    />
                </>
            ) : (
                <>
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
                </>
            )}

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

                <Button
                    type="button"
                    className="bg-orange-50 hover:bg-orange-100 border border-orange-500 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                    <SquarePen className="text-orange-700" />
                </Button>
            </div>
        </div>
    </section>
)

const Biography = ({ user, isEditMode }: BiographyProps) => (
    <section className="bg-white rounded-2xl shadow-xl p-8 mb-8" aria-labelledby="biography-title">
        <h2 id="biography-title" className="text-2xl font-bold text-gray-900 mb-6">
            Biographie
        </h2>
        {isEditMode ? (
            <InputForm
                name="biography"
                inputType="textarea"
                label="Email*"
                placeholder="votre.email@example.com"
            />
        ) : (
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FileText className="hidden lg:block w-5 h-5 text-green-600 mt-1 flex-shrink-0" aria-hidden="true" />
                <div className="flex-1">
                    <p className="text-gray-900 leading-relaxed">
                        {user.biography || "Aucune biographie renseignée."}
                    </p>
                </div>
            </div>
        )}
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
);