export interface AgeGroup {
  ageGroupId: number;
  name: string;
  description: string;
}

export interface ToyType {
  typeId: number;
  name: string;
  description: string;
}

export interface Igracka {
  toyId: number;
  name: string;
  permalink: string;
  description: string;
  targetGroup: string;
  productionDate: string;
  price: number;
  imageUrl: string;
  ageGroup: AgeGroup;
  type: ToyType;
  status?: 'pristiglo' | 'rezervisano' | 'otkazano';
  recenzije?: Recenzija[];
}

export interface Recenzija {
  autor: string;
  tekst: string;
  ocena: number;
}