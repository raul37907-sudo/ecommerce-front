import { Component, inject, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ProductService, Product } from '../product.service'; // Importa interfaz y servicio

interface UserAction {
  id: string;
  link?: string;
  lottieSrc: string;
  size: string;
  label: string;
  badge?: number;
  action?: () => void;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, FormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  private router = inject(Router);
  private authService = inject(AuthService);
  private productService = inject(ProductService); // <--- Inyección correcta

  isLoggedIn: boolean = false;
  searchQuery: string = '';
  selectedCategory: string = 'todas';

  allProducts: Product[] = []; // Se llena desde el servicio

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });

    // Obtenemos los productos del servicio centralizado
    this.allProducts = this.productService.getProducts();
  }

  get userActions(): UserAction[] {
    if (this.isLoggedIn) {
      return [
        {
          id: 'products',
          link: '/mis-productos',
          lottieSrc: 'https://lottie.host/1b104763-d355-49d4-80b5-b353ef8ef968/AjG0rF13jb.json',
          size: '48px',
          label: 'Mis Productos',
          badge: 2
        },
        {
          id: 'logout',
          lottieSrc: 'https://lottie.host/3bc557ce-3d20-4641-9fc9-43d74aa36a50/FEQIimLo00.json',
          size: '58px',
          label: 'Cerrar sesión',
          action: () => this.logout()
        }
      ];
    } else {
      return [
        {
          id: 'login',
          link: '/app-login',
          lottieSrc: 'https://lottie.host/119020a7-3389-4758-b1fc-0e59c0cb4a25/xOQRMNyGnn.json',
          size: '88px',
          label: 'Iniciar sesión'
        }
      ];
    }
  }

  stars: number[] = [1, 2, 3, 4, 5];

  get filteredProducts(): Product[] {
    const query = this.searchQuery.toLowerCase().trim();
    return this.allProducts.filter(p => {
      const matchesCategory = query.length > 0 ||
        this.selectedCategory === 'todas' ||
        p.category === this.selectedCategory;

      const matchesQuery = !query ||
        p.title.toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }

  selectCategory(categoryKey: string): void {
    this.selectedCategory = categoryKey;
    this.searchQuery = '';
  }

  handleAction(item: UserAction): void {
    if (item.action) {
      item.action();
    } else if (item.link) {
      this.router.navigate([item.link]);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
