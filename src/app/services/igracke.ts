import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Igracka } from '../models/igracka.model';

@Injectable({ providedIn: 'root' })
export class IgrackеService {

  private apiUrl = 'https://toy.pequla.com/api/toy';
  private igrackeSubject = new BehaviorSubject<Igracka[]>([]);
  igracke$ = this.igrackeSubject.asObservable();

  constructor(private http: HttpClient) {
    this.ucitajIgracke();
  }

  ucitajIgracke() {
    this.http.get<Igracka[]>(this.apiUrl).subscribe(data => {
      const igracke = data.map(i => ({
        ...i,
        status: 'pristiglo' as const,
        recenzije: []
      }));
      this.igrackeSubject.next(igracke);
    });
  }

  getIgracke(): Igracka[] {
    return this.igrackeSubject.value;
  }

  getIgrackaById(id: number): Igracka | undefined {
    return this.igrackeSubject.value.find(i => i.toyId === id);
  }

  getSlikaUrl(imageUrl: string): string {
    return `https://toy.pequla.com${imageUrl}`;
  }

  pretraziIgracke(naziv?: string, tip?: string, uzrast?: string, ciljna_grupa?: string): Igracka[] {
    return this.igrackeSubject.value.filter(i => {
      const nazivOk = naziv ? i.name.toLowerCase().includes(naziv.toLowerCase()) : true;
      const tipOk = tip ? i.type.name === tip : true;
      const uzrastOk = uzrast ? i.ageGroup.name === uzrast : true;
      const ciljnaOk = ciljna_grupa ? i.targetGroup === ciljna_grupa : true;
      return nazivOk && tipOk && uzrastOk && ciljnaOk;
    });
  }
}