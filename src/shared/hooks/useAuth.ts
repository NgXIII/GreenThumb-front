import {useAccountStore} from "@/app/stores/userStore.ts";
import {useCallback} from "react";
import {getAuthenticate, getConnection, getLogout, getRegister, verifyEmail, resendVerificationEmail} from "@/services/auth/getAuthentification.ts";
import type {UserConnection} from "@/shared/types/user.ts";
import type {UserCreationPost} from "@/shared/types/schemas/UserSchema.ts";
import { AxiosError } from 'axios';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum AuthStatus {
    Unknown = 0,
    Authenticated = 1,
    Guest = 2,
}

export function useAuth() {
    const {account, setAccount, clearAccount} = useAccountStore()
    let status
    switch (account) {
        case null:
            status = AuthStatus.Guest
            break

        case undefined:
            status = AuthStatus.Unknown
            break

        default:
            status = AuthStatus.Authenticated
            break
    }

    const authenticate = useCallback(() => {
        getAuthenticate()
            .then(setAccount)
            .catch(() => setAccount(null))
    }, [setAccount])

    const login = useCallback(async (data: UserConnection) => {
        try {
            const account = await getConnection(data);
            // @ts-ignore
            setAccount(account);
            return account;
        } catch (error) {
            setAccount(null);
            throw error;
        }
    }, [setAccount]);

    const register = useCallback(async (data: UserCreationPost) => {
        await getRegister(data);
    }, [setAccount])

    const logout = useCallback(async () => {
        try {
            await getLogout()
            setAccount(null)
        } catch {
            setAccount(null)
        }
    }, [setAccount])

    const verify = useCallback(async (token: string) => {
        try {
            await verifyEmail(token);
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error;
            }
            throw error;
        }
    }, []);

    const resendVerification = useCallback(async (email: string) => {
        await resendVerificationEmail(email);
    }, []);

    return {
        account,
        status,
        authenticate,
        login,
        register,
        logout,
        verify,
        resendVerification,
    }
}