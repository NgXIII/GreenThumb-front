import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { User, Loader2 } from "lucide-react"
import { getUserByUsername } from "@/services/repos/getUserPublic"
import { getPlants } from "@/services/repos/getPlants"
import type { UserAccount } from "@/shared/types/user"
import type { Plant } from "@/shared/types/plant"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { Button } from "@/shared/components/ui/button"

type PublicProfileHeaderProps = {
    user: UserAccount
}

type PlantCardProps = {
    plant: Plant
}

export default function PublicProfilePage() {
    const { username } = useParams<{ username: string }>()
    const navigate = useNavigate()
    const [user, setUser] = useState<UserAccount | null>(null)
    const [plants, setPlants] = useState<Plant[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [plantsLoading, setPlantsLoading] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            if (!username) {
                navigate("/dashboard")
                return
            }

            setIsLoading(true)
            try {
                const userData = await getUserByUsername(username)

                if (userData.isPrivate) {
                    toast.error("Ce profil est privé")
                    navigate("/dashboard")
                    return
                }

                setUser(userData)

                setPlantsLoading(true)
                try {
                    const plantsData = await getPlants(username, 0, 20)
                    setPlants(plantsData.content || [])
                } catch (error) {
                    console.error("Erreur lors du chargement des plantes:", error)
                } finally {
                    setPlantsLoading(false)
                }
            } catch (error) {
                console.error(error)

                if (error instanceof AxiosError) {
                    if (error.response?.status === 404) {
                        toast.error("Utilisateur non trouvé")
                    } else if (error.response?.data?.message) {
                        toast.error(error.response.data.message)
                    } else {
                        toast.error("Erreur lors du chargement du profil")
                    }
                } else {
                    toast.error("Erreur lors du chargement du profil")
                }

                navigate("/dashboard")
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserData()
    }, [username, navigate])

    if (isLoading) {
        return (
            <main className="min-h-screen bg-gt-surface flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-gt-green animate-spin" />
                    <p className="text-gt-text-muted">Chargement du profil...</p>
                </div>
            </main>
        )
    }

    if (!user) {
        return null
    }

    return (
        <main className="min-h-screen bg-gt-surface py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <PublicProfileHeader user={user} />

                <section className="bg-gt-surface-elevated rounded-2xl shadow-xl p-8 mb-8 transition-colors duration-300">
                    <h2 className="text-2xl font-bold text-gt-text mb-6">
                        Plantes de {user.firstname}
                    </h2>

                    {plantsLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-gt-green animate-spin" />
                        </div>
                    ) : plants.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gt-text-muted">
                                Aucune plante pour le moment
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {plants.map((plant, index) => (
                                <PlantCard key={plant.scientificName + index} plant={plant} />
                            ))}
                        </div>
                    )}
                </section>

                <div className="flex justify-center">
                    <Button
                        onClick={() => navigate("/dashboard")}
                        className="bg-gt-green hover:bg-green-700 text-white"
                    >
                        Retour au tableau de bord
                    </Button>
                </div>
            </div>
        </main>
    )
}

const PublicProfileHeader = ({ user }: PublicProfileHeaderProps) => {
    const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.username

    return (
        <div className="bg-gt-surface-elevated rounded-2xl shadow-xl overflow-hidden mb-8 transition-colors duration-300">
            <div
                className="bg-gt-green h-32"
                role="presentation"
                aria-hidden="true"
            />
            <div className="px-8 pb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12">
                    <div className="relative">
                        <img
                            src={user.avatar || defaultAvatar}
                            alt={`Avatar de ${user.firstname} ${user.lastname}`}
                            className="w-32 h-32 rounded-full border-4 border-gt-surface-elevated object-cover"
                        />
                    </div>

                    <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                        <h1 className="text-3xl font-bold text-gt-text">
                            {user.firstname} {user.lastname}
                        </h1>
                        <p className="text-gt-text-muted flex items-center justify-center sm:justify-start gap-1 mt-1">
                            <User className="w-4 h-4" aria-hidden="true"/>
                            <span>@{user.username}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PlantCard = ({ plant }: PlantCardProps) => {
    return (
        <div className="bg-gt-surface rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
            {plant.imageUrl && (
                <div className="h-48 overflow-hidden">
                    <img
                        src={plant.imageUrl}
                        alt={plant.commonName}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gt-text mb-2">
                    {plant.commonName}
                </h3>
                {plant.scientificName && (
                    <p className="text-sm text-gt-text-muted italic">
                        {plant.scientificName}
                    </p>
                )}
            </div>
        </div>
    )
}
