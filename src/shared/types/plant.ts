export type Task = {
  title: string;
  description: string;
  endDate: string;
  color: string;
};

export type Plant = {
  scientificName: string;
  commonName: string;
  imageUrl: string;
  description?: string; // ajouté pour éviter les cast `any`
  tasks: Task[];
};

export interface PlantPage {
  content: Plant[];
  totalPages: number;
  number: number;
}