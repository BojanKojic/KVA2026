import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Narudzbina } from '../models/narudzbina.model';
import { Igracka } from '../models/igracka.model';

@Injectable({ providedIn: 'root' })
export class NarudzbineService {

  private narudzbine: Narudzbina[] = [];
  private narudzbineSubject = new BehaviorSubject<Narudzbina[]>([]);
  narudzbine$ = this.narudzbineSubject.asObservable();

  constructor() {
    const sacuvane = localStorage.getItem('narudzbine');
    if (sacuvane) {
      this.narudzbine = JSON.parse(sacuvane);
      this.narudzbineSubject.next(this.narudzbine);
    }
  }

  dodajNarudzbinu(igracka: Igracka, kolicina: number, status: 'pristiglo' | 'otkazano'): void {
    const narudzbina: Narudzbina = {
      id: this.narudzbine.length + 1,
      igracka: igracka,
      kolicina: kolicina,
      ukupno: igracka.price * kolicina,
      status: status,
      datum: new Date().toLocaleDateString('sr-RS')
    };
    this.narudzbine.push(narudzbina);
    this.sacuvajUStorage();
    this.narudzbineSubject.next([...this.narudzbine]);
  }

  ukloniNarudzbinu(id: number): void {
    this.narudzbine = this.narudzbine.filter(n => n.id !== id);
    this.sacuvajUStorage();
    this.narudzbineSubject.next([...this.narudzbine]);
  }

  private sacuvajUStorage(): void {
    localStorage.setItem('narudzbine', JSON.stringify(this.narudzbine));
  }

  getNarudzbine(): Narudzbina[] {
    return this.narudzbine;
  }
}