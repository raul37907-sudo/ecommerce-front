import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html'
})
export class RatingComponent {
  // Recibimos la calificación (ej. 4.5) sin anotación redundante
  @Input() rating = 0;

  // Creamos un arreglo fijo [1, 2, 3, 4, 5] para iterar
  stars: number[] = [1, 2, 3, 4, 5];
}
