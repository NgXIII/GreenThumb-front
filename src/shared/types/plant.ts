export type Plant = {
    scientificName: string,
    commonName: string,
    imageUrl: string,
    tasks: Task[],
}

export type Task = {
    name: string,
    description: string,
    endDate: string,
    color: string,
}