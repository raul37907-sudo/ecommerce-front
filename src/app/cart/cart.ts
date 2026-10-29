import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CartService, CartItem } from '../cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  private cartSub!: Subscription;
  private modalSub!: Subscription;

  cartItems: CartItem[] = [];
  isOpen = false;

  ngOnInit(): void {
    this.cartSub = this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.cdr.detectChanges();
    });

    this.modalSub = this.cartService.isOpen$.subscribe(open => {
      this.isOpen = open;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.cartSub) this.cartSub.unsubscribe();
    if (this.modalSub) this.modalSub.unsubscribe();
  }

  toggleModal(): void {
    this.cartService.toggleModal();
  }

  toggleSelect(id: string | number): void {
    this.cartService.toggleSelect(id);
  }

  removeItem(id: string | number): void {
    this.cartService.removeItem(id);
  }

  get totalCost(): number {
    return this.cartService.totalCost;
  }

  get badgeCount(): number {
    return this.cartService.totalCount;
  }
}
