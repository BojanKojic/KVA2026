import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { KorpaService } from '../../services/korpa';
import { IgrackеService } from '../../services/igracke';
import { AuthService } from '../../services/auth';
import { NarudzbineService } from '../../services/narudzbine';
import { Korpa as KorpaModel, StavkaKorpe } from '../../models/korpa.model';

@Component({
  selector: 'app-korpa',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatIconModule,
    MatSelectModule, FormsModule
  ],
  templateUrl: './korpa.html',
  styleUrl: './korpa.css'
})
export class Korpa implements OnInit {
  korpa: KorpaModel = { stavke: [], ukupna_cena: 0 };
  statusi = ['rezervisano', 'otkazano', 'pristiglo'];

  constructor(
    private korpaService: KorpaService,
    private igrackеService: IgrackеService,
    private authService: AuthService,
    private narudzbineService: NarudzbineService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.korpaService.korpa$.subscribe(k => {
      this.korpa = k;
    });
  }

  ukloni(igrackaId: number) {
    this.korpaService.ukloniIzKorpe(igrackaId);
  }

  promeniStatus(igrackaId: number, status: string) {
    this.korpaService.promeniStatus(
      igrackaId,
      status as 'rezervisano' | 'otkazano' | 'pristiglo'
    );
  }

  kupi(stavka: StavkaKorpe) {
    const korisnik = this.authService.getTrenutniKorisnik();
    if (!korisnik) {
      this.router.navigate(['/login']);
      return;
    }

    const ukupno = stavka.igracka.price * stavka.kolicina;
    const status = korisnik.balans >= ukupno ? 'pristiglo' : 'otkazano';

    if (status === 'pristiglo') {
      this.authService.azurirajProfil({ balans: korisnik.balans - ukupno });
    }

    // Sačuvaj
    this.http.post('http://localhost:3000/api/kupovina', {
      korisnikEmail: korisnik.email,
      korisnikIme: `${korisnik.ime} ${korisnik.prezime}`,
      igrackaId: stavka.igracka.toyId,
      igrackaName: stavka.igracka.name,
      kolicina: stavka.kolicina,
      ukupno: ukupno,
      status: status
    }).subscribe({
      next: () => console.log(' Kupovina sacuvana u Neo4j'),
      error: (err) => console.error(' Greška:', err)
    });

    this.narudzbineService.dodajNarudzbinu(stavka.igracka, stavka.kolicina, status);
    this.korpaService.ukloniIzKorpe(stavka.igracka.toyId);
    this.router.navigate(['/narudzbine']);
  }

  getSlikaUrl(imageUrl: string): string {
    return this.igrackеService.getSlikaUrl(imageUrl);
  }
}