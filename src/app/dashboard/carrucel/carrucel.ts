import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-carrucel',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule],
  templateUrl: './carrucel.html',
  styleUrls: ['./carrucel.css']
})
export class CarrucelComponent implements OnInit, OnDestroy {

  carouselProducts: any[] = [];
  banner1Products: any[] = []; // <--- Cambiado a arreglo para carrusel
  banner2Products: any[] = []; // <--- Cambiado a arreglo para carrusel

  currentIndex = 0;
  currentIndexBanner1 = 0; // <--- Índice para el banner 1
  currentIndexBanner2 = 0; // <--- Índice para el banner 2

  private intervalId: any;
  private intervalBanner1: any;
  private intervalBanner2: any;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const allProducts = this.productService.getProducts();

    this.carouselProducts = allProducts.slice(10, 21);
    this.banner1Products = allProducts.slice(33, 41); // <--- Rango para el carrusel lateral 1
    this.banner2Products = allProducts.slice(50, 61); // <--- Rango para el carrusel lateral 2

    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.intervalBanner1) clearInterval(this.intervalBanner1);
    if (this.intervalBanner2) clearInterval(this.intervalBanner2);
  }

  startAutoPlay() {
    // Carrusel Principal (cada 1.5s como lo tenías)
    this.intervalId = setInterval(() => {
      if (this.carouselProducts.length > 0) {
        this.currentIndex = (this.currentIndex + 1) % this.carouselProducts.length;
        this.cdr.detectChanges();
      }
    }, 1500);

    // Carrusel Lateral 1 (puedes ajustar el tiempo, ej. 2500ms)
    this.intervalBanner1 = setInterval(() => {
      if (this.banner1Products.length > 0) {
        this.currentIndexBanner1 = (this.currentIndexBanner1 + 1) % this.banner1Products.length;
        this.cdr.detectChanges();
      }
    }, 2000);

    // Carrusel Lateral 2 (ej. 3500ms)
    this.intervalBanner2 = setInterval(() => {
      if (this.banner2Products.length > 0) {
        this.currentIndexBanner2 = (this.currentIndexBanner2 + 1) % this.banner2Products.length;
        this.cdr.detectChanges();
      }
    }, 1800);
  }

  setCurrentSlide(index: number) {
    this.currentIndex = index;
    this.cdr.detectChanges();
  }

  setCurrentSlideBanner1(index: number) {
    this.currentIndexBanner1 = index;
    this.cdr.detectChanges();
  }

  setCurrentSlideBanner2(index: number) {
    this.currentIndexBanner2 = index;
    this.cdr.detectChanges();
  }
}
