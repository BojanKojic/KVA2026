export interface Korisnik {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
  adresa: string;
  omiljene_vrste: string[];
  lozinka: string;
  balans: number;
}