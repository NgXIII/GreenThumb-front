export type Plant = {
    scientificName: string,
    commonName: string,
    imageUrl: string,
    description: string,
    lifeCycle: string,
    waterNeed: string,
    lightLevel: string,
    soilType: string,
    soilPhMin: number,
    soilPhMax: number,
    temperatureMin: number,
    temperatureMax: number,
    humidityNeed: boolean,
    bloomMonth: string,
    petToxic: boolean,
    humanToxic: boolean,
    indoorFriendly: boolean,
    tasks: Task[],
}

export type Task = {
    title: string,
    description: string,
    endDate: string,
    color: string,
    statusDisplay: string,
}

export interface PlantPage {
    content: Plant[];
    totalPages: number;
    number: number;
}

export type PlantSearchResult = {
    commonName: string
    scientificName: string
    slug: string
    imageUrl: string
}

export interface PlantSearchPage {
    content: PlantSearchResult[]
    totalPages: number
    totalElements: number
    number: number
    size: number
}

//======== Plant form =========//

export const LIFE_CYCLE_OPTIONS = [
    { value: "Annuelle", label: "Annuelle" },
    { value: "Bisannuelle", label: "Bisannuelle" },
    { value: "Vivace", label: "Vivace" },
]

export const WATER_NEED_OPTIONS = [
    { value: "Faible", label: "Faible" },
    { value: "Modéré", label: "Modéré" },
    { value: "Élevé", label: "Élevé" },
]

export const LIGHT_OPTIONS = [
    { value: "Ombre", label: "🌑 Ombre" },
    { value: "Mi-ombre", label: "🌤 Mi-ombre" },
    { value: "Plein soleil", label: "☀️ Plein soleil" },
]

export const SOIL_TYPE_OPTIONS = [
    { value: "Drainant", label: "Drainant" },
    { value: "Sableux", label: "Sableux" },
    { value: "Argileux", label: "Argileux" },
    { value: "Terreau", label: "Terreau" },
    { value: "Calcaire", label: "Calcaire" },
]

export const MONTH_OPTIONS = [
    { value: "Janvier", label: "Janvier" },
    { value: "Février", label: "Février" },
    { value: "Mars", label: "Mars" },
    { value: "Avril", label: "Avril" },
    { value: "Mai", label: "Mai" },
    { value: "Juin", label: "Juin" },
    { value: "Juillet", label: "Juillet" },
    { value: "Août", label: "Août" },
    { value: "Septembre", label: "Septembre" },
    { value: "Octobre", label: "Octobre" },
    { value: "Novembre", label: "Novembre" },
    { value: "Décembre", label: "Décembre" },
]

//=========================//