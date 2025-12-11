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

export interface PlantPage {
    content: Plant[];
    totalPages: number;
    number: number;
}

export type PlantSearchResult = {
    commonName: string;
    scientificName: string;
    family: string;
    familyCommonName: string;
    imageUrl: string;
}

export interface PlantSearchPage {
    content: PlantSearchResult[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}
