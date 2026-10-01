import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; //  Necesario para formatear números/moneda
import { MatButtonModule } from '@angular/material/button';

// Interfaz para definir la estructura de cada producto (Buena práctica de TypeScript)
interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,     //  Permite usar pipes de formato como | number
    MatButtonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  private router = inject(Router);

  // Arreglo de 1 a 5 para renderizar el bucle de estrellas
  stars: number[] = [1, 2, 3, 4, 5];

  // Lista dinámica de productos que consume tu HTML
  products: Product[] = [
    {
      id: 1,
      title: 'Audífonos Bluetooth',
      price: 899.00,
      rating: 4.5,
      reviewsCount: 245,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'
    },
    {
      id: 2,
      title: 'Smartphone Pro',
      price: 12999.00,
      rating: 5.0,
      reviewsCount: 93,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80'
    },
    {
      id: 3,
      title: 'Smartwatch Sport',
      price: 1599.00,
      rating: 4.0,
      reviewsCount: 120,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'
    },
    {
      id: 4,
      title: 'Laptop Ultra',
      price: 18999.00,
      rating: 4.5,
      reviewsCount: 87,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80'
    }
  ];

  logout(): void {
    localStorage.removeItem('loggedInUser'); // Limpia la sesión
    this.router.navigate(['/app-login']);     // Redirige al login
  }
}
