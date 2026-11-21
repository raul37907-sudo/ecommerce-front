import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

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
  private readonly cartStorageKey = 'cart_items';
  private cartItems: CartItem[] = [];

  private cartSubject = new BehaviorSubject<CartItem[]>(this.cartItems);
  cart$ = this.cartSubject.asObservable();

  // Control global del Modal
  private isOpenSubject = new BehaviorSubject<boolean>(false);
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

  setAllSelected(selected: boolean): void {
    this.cartItems = this.cartItems.map(item => ({
      ...item,
      selected
    }));
    this.cartSubject.next([...this.cartItems]);
  }

  removeItem(id: string | number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    this.cartSubject.next([...this.cartItems]);
  }

  /** Limpia el carrito en localStorage y en memoria (ideal al cerrar sesión) */
  clearCart(): void {
    this.cartItems = [];

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.cartStorageKey);
    }

    this.cartSubject.next([]);
    this.isOpenSubject.next(false);
  }

  /** Permite cargar items frescos desde el backend al iniciar sesión */
  setCartItems(items: CartItem[]): void {
    this.cartItems = [...items];
    this.cartSubject.next([...this.cartItems]);
  }

  get totalCount(): number {
    return this.cartItems.length;
  }

  get totalCost(): number {
    return this.cartItems
      .filter(item => item.selected)
      .reduce((acc, item) => acc + (item.price * item.quantity), 0.00);
  }
}
