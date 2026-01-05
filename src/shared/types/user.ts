export type UserAccount = {
    username: string
    firstname: string
    lastname: string
    email: string
    avatar: string | undefined
    phoneNumber: string
    biography: string | undefined
    messageCount: number
    tier: Tier
    countCreatedThread: number
    role: string
    tasksCompleted: number
    isPrivate: boolean
}

export type Tier = {
    name: string
    messageRequired: number
    threadUnlocked: number
}

export type UserAuthentification = {
    token: string
}

export type UserConnection = {
    login: string // email | username
    password: string
    rememberMe?: boolean
}

export type UserStatsUpdate = {
    username: string
    messageCount: number
    tier: Tier
    countCreatedThread: number
}

export interface TierUpgradeNotification {
    type: 'TIER_UPGRADE';
    tierName: string;
    tierLevel: number;
    threadsUnlocked: number;
    messageRequired: number;
    timestamp: string;
}