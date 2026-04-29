import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Korpa } from './components/korpa/korpa';
import { Login } from './components/login/login';
import { Registracija } from './components/registracija/registracija';
import { Profil } from './components/profil/profil';
import { Narudzbine } from './components/narudzbine/narudzbine';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'korpa', component: Korpa },
  { path: 'login', component: Login },
  { path: 'registracija', component: Registracija },
  { path: 'profil', component: Profil },
  {path:'narudzbine', component:Narudzbine},
  { path: '**', redirectTo: '' }
];