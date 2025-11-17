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
}

export type UserConnection = {
    login: string // email | username
    password: string
}