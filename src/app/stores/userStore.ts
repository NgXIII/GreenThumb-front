import {create} from "zustand";
import {combine, persist} from "zustand/middleware";
import type {UserAuthentification} from "@/shared/types/user.ts";

export const useAccountStore = create(
    persist(
        combine(
            {
                account: null as undefined | null | UserAuthentification,
            },
            (set) => ({
                setAccount: (account: UserAuthentification | null) => set({account}),
            })
        ),
        { name: "account" }
    )
)