export type Plant = {
    scientificName: string,
    commonName: string,
    imageUrl: string,
    tasks: Task[],
}

export type Task = {
    title: string,
    description: string,
    endDate: string,
    color: string,
}