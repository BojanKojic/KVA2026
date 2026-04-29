import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Korisnik } from '../../models/korisnik.model';

@Component({
  selector: 'app-registracija',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, ReactiveFormsModule, RouterLink
  ],
  templateUrl: './registracija.html',
  styleUrl: './registracija.css'
})
export class Registracija {
  forma: FormGroup;

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
      adresa: ['', [Validators.required, Validators.minLength(5)]],
      lozinka: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)
      ]],
      lozinka2: ['', Validators.required]
    }, { validators: this.lozinkeSePodudaraju });
  }

  lozinkeSePodudaraju(group: AbstractControl) {
    const l1 = group.get('lozinka')?.value;
    const l2 = group.get('lozinka2')?.value;
    return l1 === l2 ? null : { lozinkeRazlicite: true };
  }

  greska(polje: string): string {
    const f = this.forma.get(polje);
    if (!f || !f.touched || !f.errors) return '';
    if (f.errors['required']) return 'Polje je obavezno!';
    if (f.errors['minlength']) return `Minimum ${f.errors['minlength'].requiredLength} karaktera!`;
    if (f.errors['email']) return 'Unesite ispravan email!';
    if (f.errors['pattern']) {
      if (polje === 'telefon') return 'Format: 06xxxxxxxx ili +381xxxxxxxx';
      if (polje === 'lozinka') return 'Mora imati veliko, malo slovo i broj!';
    }
    return '';
  }

  registruj() {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      return;
    }
    const v = this.forma.value;
    const korisnik: Korisnik = {
      id: 0,
      ime: v.ime,
      prezime: v.prezime,
      email: v.email,
      telefon: v.telefon,
      adresa: v.adresa,
      omiljene_vrste: [],
      lozinka: v.lozinka,
      balans: 12000
    };
    this.authService.registruj(korisnik);
    this.router.navigate(['/']);
  }
}