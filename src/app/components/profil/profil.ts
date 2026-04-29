import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Korisnik } from '../../models/korisnik.model';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule
  ],
  templateUrl: './profil.html',
  styleUrl: './profil.css'
})
export class Profil implements OnInit {
  forma: FormGroup;
  korisnik: Korisnik | null = null;
  sacuvano = false;
  dodajSredstva = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forma = this.fb.group({
      ime: ['', [Validators.required, Validators.minLength(2)]],
      prezime: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefon: ['', [Validators.required, Validators.pattern(/^(\+381|0)[0-9]{8,9}$/)]],
      adresa: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit() {
    this.authService.trenutniKorisnik$.subscribe(k => {
      if (!k) {
        this.router.navigate(['/login']);
        return;
      }
      this.korisnik = k;
      this.forma.patchValue({
        ime: k.ime,
        prezime: k.prezime,
        email: k.email,
        telefon: k.telefon,
        adresa: k.adresa
      });
    });
  }

  greska(polje: string): string {
    const f = this.forma.get(polje);
    if (!f || !f.touched || !f.errors) return '';
    if (f.errors['required']) return 'Polje je obavezno!';
    if (f.errors['minlength']) return `Minimum ${f.errors['minlength'].requiredLength} karaktera!`;
    if (f.errors['email']) return 'Unesite ispravan email!';
    if (f.errors['pattern']) return 'Format: 06xxxxxxxx ili +381xxxxxxxx';
    return '';
  }

  sacuvaj() {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      return;
    }
    this.authService.azurirajProfil(this.forma.value);
    this.sacuvano = true;
    setTimeout(() => this.sacuvano = false, 3000);
  }

  dodajNovac() {
    if (!this.dodajSredstva || this.dodajSredstva <= 0) return;
    const noviBalans = (this.korisnik?.balans || 0) + this.dodajSredstva;
    this.authService.azurirajProfil({ balans: noviBalans });
    this.dodajSredstva = 0;
  }
}