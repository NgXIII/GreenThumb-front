import * as z from 'zod'

export const UserCreationSchema = z.object({
    username: z.string().min(1),
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    password: z.string().min(8),
    confirmpassword: z.string().min(1),
    email: z.email(),
    phoneNumber: z.number()
})

export type UserCreationPost = z.infer<typeof UserCreationSchema>