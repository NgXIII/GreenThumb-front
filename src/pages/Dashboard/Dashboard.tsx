import {useUserStore} from "@/app/stores/userStore.ts";

export default function Dashboard() {
    const { user } = useUserStore.getState();
    return (
        <>
            <h1>Bonjour, {user?.username}</h1>
            <p>Tu a 3 tâches en attente aujourd'hui</p>
        </>
    )
}