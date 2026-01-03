export type UserAccount = {
    username: string
    firstname: string
    lastname: string
    email: string
    avatar: string | undefined
    phoneNumber: string
    biography: string | undefined
    role: string
    tasksCompleted: number
}

export type UserAuthentification = {
    token: string
}

export type UserConnection = {
    login: string // email | username
    password: string
    rememberMe?: boolean
}