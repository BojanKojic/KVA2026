import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { NarudzbineService } from '../../services/narudzbine';
import { IgrackеService } from '../../services/igracke';
import { Narudzbina } from '../../models/narudzbina.model';

@Component({
  selector: 'app-narudzbine',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './narudzbine.html',
  styleUrl: './narudzbine.css'
})
export class Narudzbine implements OnInit {
  narudzbine: Narudzbina[] = [];

  constructor(
    private narudzbineService: NarudzbineService,
    private igrackеService: IgrackеService
  ) {}

  ngOnInit() {
    this.narudzbineService.narudzbine$.subscribe(data => {
      this.narudzbine = data;
    });
  }

  ukloni(id: number) {
    this.narudzbineService.ukloniNarudzbinu(id);
  }

  getSlikaUrl(imageUrl: string): string {
    return this.igrackеService.getSlikaUrl(imageUrl);
  }
}