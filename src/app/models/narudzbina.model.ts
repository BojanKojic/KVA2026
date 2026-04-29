import { Igracka } from './igracka.model';

export interface Narudzbina {
  id: number;
  igracka: Igracka;
  kolicina: number;
  ukupno: number;
  status: 'pristiglo' | 'otkazano';
  datum: string;
}