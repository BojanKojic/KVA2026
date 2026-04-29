import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Korisnik } from '../models/korisnik.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private korisnici: Korisnik[] = [
    {
      id: 1,
      ime: 'Marko',
      prezime: 'Markovic',
      email: 'marko@email.com',
      telefon: '0601234567',
      adresa: 'Beograd, Srbija',
      omiljene_vrste: ['Slagalica', 'Edukativna igračka'],
      lozinka: '1234',
      balans: 12000
    }
  ];

  private trenutniKorisnikSubject = new BehaviorSubject<Korisnik | null>(null);
  trenutniKorisnik$ = this.trenutniKorisnikSubject.asObservable();

  constructor() {
    const sacuvan = localStorage.getItem('korisnik');
    if (sacuvan) {
      this.trenutniKorisnikSubject.next(JSON.parse(sacuvan));
    }
  }

  login(email: string, lozinka: string): boolean {
    const korisnik = this.korisnici.find(
      k => k.email === email && k.lozinka === lozinka
    );
    if (korisnik) {
      localStorage.setItem('korisnik', JSON.stringify(korisnik));
      this.trenutniKorisnikSubject.next(korisnik);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('korisnik');
    this.trenutniKorisnikSubject.next(null);
  }

  registruj(korisnik: Korisnik): void {
    korisnik.id = this.korisnici.length + 1;
    this.korisnici.push(korisnik);
    localStorage.setItem('korisnik', JSON.stringify(korisnik));
    this.trenutniKorisnikSubject.next(korisnik);
  }

  getTrenutniKorisnik(): Korisnik | null {
    return this.trenutniKorisnikSubject.value;
  }

  jeUlogovan(): boolean {
    return this.trenutniKorisnikSubject.value !== null;
  }

  azurirajProfil(podaci: Partial<Korisnik>): void {
    const korisnik = this.getTrenutniKorisnik();
    if (korisnik) {
      Object.assign(korisnik, podaci);
      localStorage.setItem('korisnik', JSON.stringify(korisnik));
      this.trenutniKorisnikSubject.next({ ...korisnik });
    }
  }
}