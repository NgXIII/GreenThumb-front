export type UserAccount = {
    username: string
    firstname: string
    lastname: string
    email: string
    avatar: string
    phoneNumber: string
}

export type UserAuthentification = {
    token: string
    user: UserAccount
}