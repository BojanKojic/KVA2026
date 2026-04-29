import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, FormsModule,RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  lozinka = '';
  greska = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  prijavi() {
    if (!this.email || !this.lozinka) {
      this.greska = 'Unesite email i lozinku!';
      return;
    }
    const uspeh = this.authService.login(this.email, this.lozinka);
    if (uspeh) {
      this.router.navigate(['/']);
    } else {
      this.greska = 'Pogrešan email ili lozinka!';
    }
  }
}