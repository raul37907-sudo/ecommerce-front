import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service'; // <--- Importamos la interfaz centralizada

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  selected: boolean;
  image: string;
}
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];

  private cartSubject = new BehaviorSubject<CartItem[]>(this.cartItems);
  cart$ = this.cartSubject.asObservable();

  // Control global del Modal
  private isOpenSubject = new BehaviorSubject(false);
  isOpen$ = this.isOpenSubject.asObservable();

  toggleModal(): void {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }

  openModal(): void {
    this.isOpenSubject.next(true);
  }

  closeModal(): void {
    this.isOpenSubject.next(false);
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({
        id: product.id,
        name: product.title || product.name || 'Producto sin nombre',
        price: product.price,
        quantity: 1,
        selected: true,
        image: product.imageUrl || product.image || ''
      });
    }
    this.cartSubject.next([...this.cartItems]);
  }

  toggleSelect(id: string | number): void {
    const item = this.cartItems.find(i => i.id === id);
    if (item) {
      item.selected = !item.selected;
      this.cartSubject.next([...this.cartItems]);
    }
  }

  removeItem(id: string | number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    this.cartSubject.next([...this.cartItems]);
  }

  get totalCount(): number {
    return this.cartItems.length;
  }

  get totalCost(): number {
    return this.cartItems
      .filter(item => item.selected)
      .reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }
}
