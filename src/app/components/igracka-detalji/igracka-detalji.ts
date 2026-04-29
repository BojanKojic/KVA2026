import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { KorpaService } from '../../services/korpa';
import { IgrackеService } from '../../services/igracke';
import { Igracka } from '../../models/igracka.model';

@Component({
  selector: 'app-igracka-detalji',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './igracka-detalji.html',
  styleUrl: './igracka-detalji.css'
})
export class IgrackaDetalji {
  constructor(
    @Inject(MAT_DIALOG_DATA) public igracka: Igracka,
    private dialogRef: MatDialogRef<IgrackaDetalji>,
    private korpaService: KorpaService,
    private igrackеService: IgrackеService
  ) {}

  zatvori() {
    this.dialogRef.close();
  }

  rezervisi() {
    this.korpaService.dodajUKorpu(this.igracka);
    this.dialogRef.close();
  }

  getSlikaUrl(imageUrl: string): string {
    return this.igrackеService.getSlikaUrl(imageUrl);
  }

  zvezdice(ocena: number): string {
    return '⭐'.repeat(ocena);
  }
}