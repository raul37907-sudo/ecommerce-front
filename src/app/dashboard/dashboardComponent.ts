import { Component, inject, CUSTOM_ELEMENTS_SCHEMA, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ProductService, Product } from '../product.service';
import { CartService } from '../cart.service';
import { CarrucelComponent } from './carrucel/carrucel';
import { PaginadorComponent } from './paginador/paginador';
import { CartComponent } from '../cart/cart';

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
  imports: [CommonModule, MatButtonModule, FormsModule, RouterLink, CarrucelComponent, PaginadorComponent, CartComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // Inyección moderna de dependencias
  private router = inject(Router);
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute);

  @ViewChild(PaginadorComponent) paginatorComponent!: PaginadorComponent;

  // Tipos inferidos limpios (sin anotaciones redundantes)
  isLoggedIn = false;
  searchQuery = '';
  selectedCategory = 'todas';

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  stars: number[] = [1, 2, 3, 4, 5];

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const fragment = this.route.snapshot.fragment;

      if (fragment === 'productos-section') {
        setTimeout(() => {
          const element = document.getElementById('productos-section');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });

            this.router.navigate([], {
              fragment: undefined,
              replaceUrl: true
            });
          }
        }, 300);
      }
    }
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });

    this.allProducts = this.productService.getProducts();
    this.applyFilter();
  }

  applyFilter(): void {
    const query = this.searchQuery.toLowerCase().trim();

    this.filteredProducts = [...this.allProducts].filter(p => {
      const matchesCategory = query.length > 0 ||
        this.selectedCategory === 'todas' ||
        p.category === this.selectedCategory;

      // Protegido con (p.title ?? '') para evitar errores si title es undefined
      const matchesQuery = !query ||
        (p.title ?? '').toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });

    const pageSize = this.paginatorComponent ? this.paginatorComponent.pageSize : 7;
    this.paginatedProducts = this.filteredProducts.slice(0, pageSize);
  }

  onSearchChange(): void {
    if (this.paginatorComponent) {
      this.paginatorComponent.pageIndex = 0;
      if (this.paginatorComponent.matPaginator) {
        this.paginatorComponent.matPaginator.pageIndex = 0;
      }
    }
    this.applyFilter();
  }

  selectCategory(categoryKey: string): void {
    this.selectedCategory = categoryKey;
    this.searchQuery = '';

    if (this.paginatorComponent) {
      this.paginatorComponent.pageIndex = 0;
      if (this.paginatorComponent.matPaginator) {
        this.paginatorComponent.matPaginator.pageIndex = 0;
      }
      this.paginatorComponent.updatePagination();
    }

    this.applyFilter();
    this.cdr.detectChanges();
  }

  onPageUpdated(productsSlice: Product[]): void {
    this.paginatedProducts = productsSlice;
  }

  get userActions(): UserAction[] {
    const cartCount = this.cartService.totalCount;
    if (this.isLoggedIn) {
      return [
        {
          id: 'cart',
          link: '/mis-productos',
          lottieSrc: 'https://lottie.host/1b104763-d355-49d4-80b5-b353ef8ef968/AjG0rF13jb.json',
          size: '48px',
          label: 'Mis Productos',
          badge: cartCount
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
    } else if (item.id === 'cart') {
      this.cartService.toggleModal();
    } else if (item.link) {
      this.router.navigate([item.link]);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
