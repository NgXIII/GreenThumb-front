export type Resource = {
    slug: string,
    title: string,
    summary: string,
    like: number,
    pictureUrl: string
    description: string,
    creationDate: string,
    username: string,
}

export type LikeResponse = {
    likedCount: number,
    isLiked: boolean,
}