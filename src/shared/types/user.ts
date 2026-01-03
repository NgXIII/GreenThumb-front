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