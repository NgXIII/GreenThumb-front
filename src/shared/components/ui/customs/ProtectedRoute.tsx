import {type ReactNode, useEffect, useState} from "react";
import {useAccountStore} from "@/app/stores/userStore.ts";
import {Navigate} from "react-router-dom";
import {verifyToken} from "@/services/auth/verifyToken.ts";

interface ProtectedRouteProps {
    children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const account = useAccountStore((state) => state.account);
    const setAccount = useAccountStore((state) => state.setAccount);
    const [isValid, setIsValid] = useState<boolean | null>(null);

    useEffect(() => {
        const checkToken = async () => {
            const valid = await verifyToken(account?.token);
            if (!valid ) {
                console.log("Account not valid!");
                setAccount(null);
                setIsValid(false);
            } else {
                setIsValid(true);
            }
        };

        checkToken();
    }, [account, setAccount]);

    if (isValid === null) {
        return <div>Vérification du compte...</div>
    }

    if (!isValid) {
        return <Navigate to="/connexion" replace />
    }

    return <>{children}</>;
}