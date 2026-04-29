import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../services/auth';
import { KorpaService } from '../../services/korpa';

@Component({
  selector: 'app-navigacija',
  standalone: true,
  imports: [
    RouterLink, RouterLinkActive,
    MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule,RouterLinkActive
  ],
  templateUrl: './navigacija.html',
  styleUrl: './navigacija.css'
})
export class Navigacija implements OnInit {
  jeUlogovan = false;
  brojStavki = 0;

  constructor(
    private authService: AuthService,
    private korpaService: KorpaService
  ) {}

  ngOnInit() {
    this.authService.trenutniKorisnik$.subscribe(k => {
      this.jeUlogovan = k !== null;
    });
    this.korpaService.korpa$.subscribe(k => {
      this.brojStavki = k.stavke.length;
    });
  }

  logout() {
    this.authService.logout();
  }
}