import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IgrackеService } from '../../services/igracke';
import { KorpaService } from '../../services/korpa';
import { AuthService } from '../../services/auth';
import { Igracka } from '../../models/igracka.model';
import { IgrackaDetalji } from '../igracka-detalji/igracka-detalji';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDialogModule, FormsModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  igracke: Igracka[] = [];
  filtrirane: Igracka[] = [];

  pretragaNaziv = '';
  filtarTip = '';
  filtarUzrast = '';
  filtarGrupa = '';

  tipovi = ['Slagalica', 'Slikovnica', 'Figura', 'Kreativni set',
            'Vozilo', 'Plišana igračka', 'Društvena igra',
            'Konstruktorski set', 'Muzička igračka', 'Edukativna igračka'];
  uzrasti = ['0-2', '3-5', '6-9', '10+'];

  constructor(
    private igrackеService: IgrackеService,
    private korpaService: KorpaService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.igrackеService.ucitajIgracke();
    this.igrackеService.igracke$.subscribe(data => {
      if (data.length > 0) {
        this.igracke = data;
        this.filtrirane = [...data];
      }
    });
  }

  pretrazi() {
    this.filtrirane = this.igracke.filter(i => {
      const nazivOk = this.pretragaNaziv ?
        i.name.toLowerCase().includes(this.pretragaNaziv.toLowerCase()) : true;
      const tipOk = this.filtarTip ?
        i.type.name === this.filtarTip : true;
      const uzrastOk = this.filtarUzrast ?
        i.ageGroup.name === this.filtarUzrast : true;
      const ciljnaOk = this.filtarGrupa ?
        i.targetGroup === this.filtarGrupa : true;
      return nazivOk && tipOk && uzrastOk && ciljnaOk;
    });
  }

  resetuj() {
    this.pretragaNaziv = '';
    this.filtarTip = '';
    this.filtarUzrast = '';
    this.filtarGrupa = '';
    this.filtrirane = [...this.igracke];
  }

  otvoriDetalje(igracka: Igracka) {
    this.dialog.open(IgrackaDetalji, {
      width: '600px',
      data: igracka
    });
  }

  dodajUKorpu(igracka: Igracka) {
    if (!this.authService.jeUlogovan()) {
      this.router.navigate(['/login']);
      return;
    }
    const kolicina = prompt('Unesite količinu:', '1');
    if (!kolicina || isNaN(+kolicina) || +kolicina < 1) return;
    this.korpaService.dodajUKorpu(igracka, +kolicina);
  }

  getSlikaUrl(imageUrl: string): string {
    return this.igrackеService.getSlikaUrl(imageUrl);
  }
}