/*-- -----dir: src/app/app.ts*/
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartComponent } from './cart/cart';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CartComponent],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('angular-front-login');
}
