import { Component, inject, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ProductService, Product } from '../product.service';
import { CarrucelComponent } from './carrucel/carrucel';
import { Paginador } from './paginador/paginador';

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
  imports: [CommonModule, MatButtonModule, FormsModule, RouterLink, CarrucelComponent, Paginador],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  private router = inject(Router);
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  // Referencia directa al componente paginador hijo
  @ViewChild(Paginador) paginatorComponent!: Paginador;

  isLoggedIn: boolean = false;
  searchQuery: string = '';
  selectedCategory: string = 'todas';

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];

  stars: number[] = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });

    this.allProducts = this.productService.getProducts();
    this.applyFilter();
  }

  // Método para filtrar productos y actualizar el corte de inmediato
  applyFilter(): void {
    const query = this.searchQuery.toLowerCase().trim();

    this.filteredProducts = [...this.allProducts].filter(p => {
      const matchesCategory = query.length > 0 ||
        this.selectedCategory === 'todas' ||
        p.category === this.selectedCategory;

      const matchesQuery = !query ||
        p.title.toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });

    // Actualizamos la vista de forma inmediata para evitar el doble clic
    const pageSize = this.paginatorComponent ? this.paginatorComponent.pageSize : 7;
    this.paginatedProducts = this.filteredProducts.slice(0, pageSize);
  }

  // Se ejecuta al escribir en la barra de búsqueda en tiempo real
  onSearchChange(): void {
    if (this.paginatorComponent) {
      this.paginatorComponent.pageIndex = 0;
      if (this.paginatorComponent.matPaginator) {
        this.paginatorComponent.matPaginator.pageIndex = 0;
      }
    }
    this.applyFilter();
  }

  // Se ejecuta al dar clic en cualquier categoría del menú
  selectCategory(categoryKey: string): void {
    this.selectedCategory = categoryKey;
    this.searchQuery = '';

    // Reseteamos el paginador a la página 0 al instante
    if (this.paginatorComponent) {
      this.paginatorComponent.pageIndex = 0;
      if (this.paginatorComponent.matPaginator) {
        this.paginatorComponent.matPaginator.pageIndex = 0;
      }
      this.paginatorComponent.updatePagination();
    }

    // Filtramos y repintamos al primer clic
    this.applyFilter();
    this.cdr.detectChanges();
  }

  // Recibe la rebanada de productos cuando el usuario navega en el paginador
  onPageUpdated(productsSlice: Product[]): void {
    this.paginatedProducts = productsSlice;
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
