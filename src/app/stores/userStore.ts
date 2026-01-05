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
    updateStats: (messageCount: number, tier: any, countCreatedThread: number) => void;
    incrementTasksCompleted: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
    incrementTasksCompleted: () => set((state) => ({
        user: state.user ? { ...state.user, tasksCompleted: (state.user.tasksCompleted ?? 0) + 1 } : null
    })),
    updateStats: (messageCount, tier, countCreatedThread) =>
        set((state) => {
            console.log('🔄 updateStats appelé avec:', { messageCount, tier, countCreatedThread });
            console.log('🔄 État actuel:', state.user);
            const newUser = state.user ? {
                ...state.user,
                messageCount,
                tier,
                countCreatedThread
            } : null;
            console.log('🔄 Nouvel état:', newUser);
            return { user: newUser };
        }),
}));
