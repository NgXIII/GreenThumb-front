import { useEffect, useState } from "react";
import { getUserCount } from "@/services/repos/getUserCount.ts";
import {patchEditPassword, patchEditUser} from "@/services/repos/patchEditUser.ts";
import type {PasswordEditPost, UserEditPost} from "@/shared/types/schemas/UserSchema.ts";

export function useUser() {
    const [userCount, setUserCount] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getUserCount()
            .then((count) => setUserCount(count))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, []);

    return { userCount, error, loading }
}

export function useEditUser() {
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const editUser = async (oldUsername: string | undefined, data: UserEditPost) => {
        setLoading(true)

        try {
            const response = await patchEditUser(oldUsername, data);
            setMessage(response.message)
            return response
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur inconnue"
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { editUser, message, error, loading };
}

export function useEditPassword() {
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const editPassword = async (oldUsername: string | undefined, data: PasswordEditPost) => {
        setLoading(true)

        try {
            const response = await patchEditPassword(oldUsername, data);
            setMessage(response.message)
            return response
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur inconnue"
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { editPassword, message, error, loading };
}