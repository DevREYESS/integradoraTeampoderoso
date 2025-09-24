import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Inicio } from './inicio/inicio/inicio'; 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,Inicio],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front');
}
