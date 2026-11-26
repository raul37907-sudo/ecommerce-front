/*-- -----dir: src/app/cart.service.ts*/


import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  private platformId = inject(PLATFORM_ID);
  private readonly cartStorageKey = 'cart_items';

  private cartItems: CartItem[] = this.loadFromStorage();
  private cartSubject = new BehaviorSubject<CartItem[]>(this.cartItems);
  cart$ = this.cartSubject.asObservable();

  // Estado independiente para "Comprar ahora"
  private quickBuySubject = new BehaviorSubject<CartItem | null>(null);
  quickBuy$ = this.quickBuySubject.asObservable();

  // Control global del cajón/modal del carrito
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  // Control global del modal de confirmación (compartido entre carrito y compra rápida)
  private isConfirmOpenSubject = new BehaviorSubject<boolean>(false);
  isConfirmOpen$ = this.isConfirmOpenSubject.asObservable();

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private loadFromStorage(): CartItem[] {
    if (!this.isBrowser()) {
      return [];
    }
    try {
      const raw = localStorage.getItem(this.cartStorageKey);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private syncState(): void {
    if (this.isBrowser()) {
      try {
        localStorage.setItem(this.cartStorageKey, JSON.stringify(this.cartItems));
      } catch {
        // Ignora errores de cuota o almacenamiento bloqueado
      }
    }
    this.cartSubject.next([...this.cartItems]);
  }

  openConfirmModal(): void {
    this.isConfirmOpenSubject.next(true);
  }

  closeConfirmModal(): void {
    this.isConfirmOpenSubject.next(false);
    this.quickBuySubject.next(null);
  }

  /** Compra directa independiente del carrito */
  buyNow(product: Product): void {
    const productName = product.name ?? product.title ?? 'Producto sin nombre';
    const productImage = product.image ?? product.imageUrl ?? '';

    const quickItem: CartItem = {
      id: product.id,
      name: productName,
      price: product.price,
      quantity: 1,
      selected: true,
      image: productImage
    };

    this.quickBuySubject.next(quickItem);
    this.openConfirmModal();
  }

  clearQuickBuy(): void {
    this.quickBuySubject.next(null);
  }

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

    this.syncState();
  }

  toggleSelect(id: string | number): void {
    const item = this.cartItems.find(i => i.id === id);
    if (item) {
      item.selected = !item.selected;
      this.syncState();
    }
  }

  setAllSelected(selected: boolean): void {
    this.cartItems = this.cartItems.map(item => ({
      ...item,
      selected
    }));
    this.syncState();
  }

  updateQuantity(id: string | number, delta: number): void {
    const item = this.cartItems.find(i => i.id === id);
    if (!item) return;

    const nextQuantity = item.quantity + delta;
    if (nextQuantity < 1) return;

    item.quantity = nextQuantity;
    this.syncState();
  }

  removeItem(id: string | number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    this.syncState();
  }

  /** Limpia el carrito en localStorage y en memoria (ideal al cerrar sesión) */
  clearCart(): void {
    this.cartItems = [];

    if (this.isBrowser()) {
      try {
        localStorage.removeItem(this.cartStorageKey);
      } catch {
        // Ignora errores de almacenamiento bloqueado
      }
    }

    this.cartSubject.next([]);
    this.quickBuySubject.next(null);
    this.isConfirmOpenSubject.next(false);
    this.isOpenSubject.next(false);
  }

  /** Permite cargar items frescos desde el backend al iniciar sesión */
  setCartItems(items: CartItem[]): void {
    this.cartItems = [...items];
    this.syncState();
  }

  get totalCount(): number {
    return this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  get totalCost(): number {
    return this.cartItems
      .filter(item => item.selected)
      .reduce((acc, item) => acc + item.price * item.quantity, 0);
  }
}
