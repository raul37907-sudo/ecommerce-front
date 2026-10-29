import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../product.service';
import { Product } from '../../product.service'; // Asegúrate de ajustar la ruta si tu interfaz Product está en otro archivo o servicio

@Component({
  selector: 'app-carrucel',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule],
  templateUrl: './carrucel.html',
  styleUrls: ['./carrucel.css']
})
export class CarrucelComponent implements OnInit, OnDestroy {
  // Inyección de dependencias moderna con inject()
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  carouselProducts: Product[] = [];
  banner1Products: Product[] = [];
  banner2Products: Product[] = [];

  currentIndex = 0;
  currentIndexBanner1 = 0;
  currentIndexBanner2 = 0;

  private intervalId?: ReturnType<typeof setInterval>;
  private intervalBanner1?: ReturnType<typeof setInterval>;
  private intervalBanner2?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    const allProducts = this.productService.getProducts() as Product[];

    this.carouselProducts = allProducts.slice(10, 21);
    this.banner1Products = allProducts.slice(33, 41);
    this.banner2Products = allProducts.slice(50, 61);

    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.intervalBanner1) clearInterval(this.intervalBanner1);
    if (this.intervalBanner2) clearInterval(this.intervalBanner2);
  }

  startAutoPlay(): void {
    // Carrusel Principal
    this.intervalId = setInterval(() => {
      if (this.carouselProducts.length > 0) {
        this.currentIndex = (this.currentIndex + 1) % this.carouselProducts.length;
        this.cdr.detectChanges();
      }
    }, 1500);

    // Carrusel Lateral 1
    this.intervalBanner1 = setInterval(() => {
      if (this.banner1Products.length > 0) {
        this.currentIndexBanner1 = (this.currentIndexBanner1 + 1) % this.banner1Products.length;
        this.cdr.detectChanges();
      }
    }, 2000);

    // Carrusel Lateral 2
    this.intervalBanner2 = setInterval(() => {
      if (this.banner2Products.length > 0) {
        this.currentIndexBanner2 = (this.currentIndexBanner2 + 1) % this.banner2Products.length;
        this.cdr.detectChanges();
      }
    }, 1800);
  }

  setCurrentSlide(index: number): void {
    this.currentIndex = index;
    this.cdr.detectChanges();
  }

  setCurrentSlideBanner1(index: number): void {
    this.currentIndexBanner1 = index;
    this.cdr.detectChanges();
  }

  setCurrentSlideBanner2(index: number): void {
    this.currentIndexBanner2 = index;
    this.cdr.detectChanges();
  }
}
