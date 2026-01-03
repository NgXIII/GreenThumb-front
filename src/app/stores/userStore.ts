import {create} from "zustand";
import {combine, persist} from "zustand/middleware";
import type {UserAccount, UserAuthentification} from "@/shared/types/user.ts";
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

interface UserStore {
    user: UserAccount | null
    setUser: (user: UserAccount | null) => void;
    clearUser: () => void;
    incrementTasksCompleted: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
    incrementTasksCompleted: () => set((state) => ({
        user: state.user ? { ...state.user, tasksCompleted: (state.user.tasksCompleted ?? 0) + 1 } : null
    })),
}));
