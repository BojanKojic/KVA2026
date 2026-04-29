import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Korpa as KorpaModel, StavkaKorpe } from '../models/korpa.model';
import { Igracka } from '../models/igracka.model';

@Injectable({ providedIn: 'root' })
export class KorpaService {

  private korpa: KorpaModel = { stavke: [], ukupna_cena: 0 };
  private korpaSubject = new BehaviorSubject<KorpaModel>(this.korpa);
  korpa$ = this.korpaSubject.asObservable();

  constructor() {
    const sacuvana = localStorage.getItem('korpa');
    if (sacuvana) {
      this.korpa = JSON.parse(sacuvana);
      this.korpaSubject.next(this.korpa);
    }
  }

  dodajUKorpu(igracka: Igracka, kolicina: number = 1): void {
    const postojiVec = this.korpa.stavke.find(s => s.igracka.toyId === igracka.toyId);
    if (postojiVec) {
      postojiVec.kolicina += kolicina;
      this.izracunajUkupno();
      this.sacuvajUStorage();
      this.korpaSubject.next({ ...this.korpa });
      return;
    }
    const stavka: StavkaKorpe = {
      igracka: igracka,
      status: 'rezervisano',
      kolicina: kolicina
    };
    this.korpa.stavke.push(stavka);
    this.izracunajUkupno();
    this.sacuvajUStorage();
    this.korpaSubject.next({ ...this.korpa });
  }

  ukloniIzKorpe(igrackaId: number): void {
    this.korpa.stavke = this.korpa.stavke.filter(s => s.igracka.toyId !== igrackaId);
    this.izracunajUkupno();
    this.sacuvajUStorage();
    this.korpaSubject.next({ ...this.korpa });
  }

  promeniStatus(igrackaId: number, status: 'rezervisano' | 'otkazano' | 'pristiglo'): void {
    const stavka = this.korpa.stavke.find(s => s.igracka.toyId === igrackaId);
    if (stavka) {
      stavka.status = status;
      this.sacuvajUStorage();
      this.korpaSubject.next({ ...this.korpa });
    }
  }

  private izracunajUkupno(): void {
    this.korpa.ukupna_cena = this.korpa.stavke.reduce(
      (sum, s) => sum + s.igracka.price * s.kolicina, 0
    );
  }

  private sacuvajUStorage(): void {
    localStorage.setItem('korpa', JSON.stringify(this.korpa));
  }

  getBrojStavki(): number {
    return this.korpa.stavke.length;
  }
}