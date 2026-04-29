import { Igracka } from './igracka.model';

export interface StavkaKorpe {
  igracka: Igracka;
  status: 'rezervisano' | 'otkazano' | 'pristiglo';
  kolicina: number;
}

export interface Korpa {
  stavke: StavkaKorpe[];
  ukupna_cena: number;
}