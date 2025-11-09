import {useAccountStore} from "@/app/stores/userStore.ts";

export default function AccountDebugPage() {
    const account = useAccountStore((state) => state.account);

    if (!account) {
        return <div>Aucun compte connecté</div>;
    }

    return (
        <div style={{ padding: "1rem", fontFamily: "monospace"}}>
            <h2>Infos du compte</h2>
            <pre>{JSON.stringify(account, null, 2)}</pre>
            <p><strong>Access token :</strong> {account.token}</p>
        </div>
    )
}