import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigacija } from './components/navigacija/navigacija';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navigacija],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'igracke-shop';
}