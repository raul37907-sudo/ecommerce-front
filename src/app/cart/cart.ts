/* ------    dir: src/app/cart/cart.ts------------------------ */


import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CartService, CartItem } from '../cart.service';
import { Subscription } from 'rxjs';
import { jsPDF } from 'jspdf';

export interface PuntoEntrega {
  label: string;
  value: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit, OnDestroy {
  readonly puntosEntrega: PuntoEntrega[] = [
    {
      label: 'Metro Tláhuac torniquetes sur',
      value: 'Metro Tláhuac torniquetes sur, vista hacia cetram , del lado del elevador'
    },
    {
      label: 'San José, parque',
      value: 'San José, parque esquina de la calle 12 y Juventino Rosas'
    },
    {
      label: 'San José, sur 9 esquina Chava Flores',
      value: 'San José, Sur 9 (Cancionero) esquina Ote 18 (Chava Flores)'
    },
    {
      label: 'Tláhuac, centro, iglesia',
      value: 'Tláhuac, entre la entrada principal de la iglesia y la fuente'
    }
  ];

  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  private subscriptions = new Subscription();
  private whatsappTabRef: Window | null = null;

  quickBuyItem: CartItem | null = null;
  cartItems: CartItem[] = [];
  isOpen = false;
  showConfirmModal = false;

  fechaEntrega = '';
  minFechaEntrega = '';
  errorEntrega = '';
  lugarEntrega = '';
  errorLugar = '';

  private readonly dummyWhatsappPhone = '+525561706017';
  private readonly dummyClientName = 'Cliente de Prueba';

  ngOnInit(): void {
    this.subscriptions.add(
      this.cartService.cart$.subscribe((items: CartItem[]) => {
        this.cartItems = items;
        this.cdr.detectChanges();
      })
    );

    this.subscriptions.add(
      this.cartService.quickBuy$.subscribe((item: CartItem | null) => {
        this.quickBuyItem = item;
        this.cdr.detectChanges();
      })
    );

    this.subscriptions.add(
      this.cartService.isOpen$.subscribe((isOpen: boolean) => {
        this.isOpen = isOpen;
        this.cdr.detectChanges();
      })
    );

    this.subscriptions.add(
      this.cartService.isConfirmOpen$.subscribe((isOpen: boolean) => {
        if (isOpen) {
          this.actualizarMinimo();
          this.fechaEntrega = '';
          this.errorEntrega = '';
          this.lugarEntrega = '';
          this.errorLugar = '';
          this.showConfirmModal = true;
          if (this.isOpen) {
            this.cartService.closeModal();
          }
        } else {
          this.showConfirmModal = false;
        }
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /** True solo si hay productos en el carrito y TODOS están seleccionados */
  get allSelected(): boolean {
    return this.cartItems.length > 0 && this.cartItems.every(item => item.selected);
  }

  /** Productos seleccionados dentro del carrito general */
  get selectedItems(): CartItem[] {
    return this.cartItems.filter(item => item.selected);
  }

  /** Ítems que verá el modal de confirmación: solo "Comprar ahora" si existe, o los seleccionados del carrito */
  get modalItems(): CartItem[] {
    if (this.quickBuyItem) {
      return [this.quickBuyItem];
    }
    return this.selectedItems;
  }

  get modalTotal(): number {
    return this.modalItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }

  get totalCost(): number {
    return this.selectedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }

  get badgeCount(): number {
    return this.cartService.totalCount;
  }

  onToggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.cartService.setAllSelected(checked);
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

  // ==========================================
  // LÓGICA DE VALIDACIÓN DE FECHA Y HORA
  // ==========================================

  private obtenerFechaMinimaValida(): Date {
    const HORAS_ANTICIPACION = 2;
    const HORA_APERTURA = 10; // 10:00 AM
    const HORA_CIERRE = 20;   // 8:00 PM

    const fecha = new Date();
    fecha.setMinutes(fecha.getMinutes() + HORAS_ANTICIPACION * 60);

    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();

    if (hora < HORA_APERTURA) {
      fecha.setHours(HORA_APERTURA, 0, 0, 0);
    } else if (hora > HORA_CIERRE || (hora === HORA_CIERRE && minutos > 0)) {
      fecha.setDate(fecha.getDate() + 1);
      fecha.setHours(HORA_APERTURA, 0, 0, 0);
    }

    return fecha;
  }

  private actualizarMinimo(): void {
    const fechaMin = this.obtenerFechaMinimaValida();
    const copiaLocal = new Date(fechaMin.getTime() - fechaMin.getTimezoneOffset() * 60000);
    this.minFechaEntrega = copiaLocal.toISOString().slice(0, 16);
  }

  validarFechaEntrega(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.errorEntrega = '';

    if (!input.value) {
      this.fechaEntrega = '';
      this.cdr.detectChanges();
      return;
    }

    const seleccionada = new Date(input.value);
    const minima = this.obtenerFechaMinimaValida();
    const hora = seleccionada.getHours();
    const minutos = seleccionada.getMinutes();

    if (seleccionada < minima) {
      this.errorEntrega = 'El pedido requiere al menos 2 horas de anticipación dentro del horario de servicio.';
      input.value = '';
      this.fechaEntrega = '';
      this.cdr.detectChanges();
      return;
    }

    if (hora < 10 || hora > 20 || (hora === 20 && minutos > 0)) {
      this.errorEntrega = 'El horario de entrega es únicamente de 10:00 a.m. a 8:00 p.m.';
      input.value = '';
      this.fechaEntrega = '';
      this.cdr.detectChanges();
      return;
    }

    this.fechaEntrega = input.value;
    this.cdr.detectChanges();
  }

  onLugarChange(event: Event): void {
    this.lugarEntrega = (event.target as HTMLSelectElement).value;
    if (this.lugarEntrega) {
      this.errorLugar = '';
    }
    this.cdr.detectChanges();
  }

  incrementQuantity(id: string | number): void {
    this.cartService.updateQuantity(id, 1);
  }

  decrementQuantity(id: string | number): void {
    this.cartService.updateQuantity(id, -1);
  }

  // ==========================================
  // CONTROL DEL MODAL DE CONFIRMACIÓN
  // ==========================================

  openConfirmModal(): void {
    if (this.modalItems.length === 0) return;
    this.actualizarMinimo();
    this.fechaEntrega = '';
    this.errorEntrega = '';
    this.lugarEntrega = '';
    this.errorLugar = '';
    this.showConfirmModal = true;
    if (this.isOpen) {
      this.cartService.closeModal();
    }
    this.cdr.detectChanges();
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.cartService.clearQuickBuy();
    this.cartService.closeConfirmModal();
    this.cdr.detectChanges();
  }

  private formatearFechaLegible(isoString: string): string {
    if (!isoString) return 'No especificada';
    return new Date(isoString).toLocaleString('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  }

  private generateDummyPdf(items: CartItem[], total: number): string {
    const doc = new jsPDF();
    const folioDummy = `DUMMY-${Math.floor(100000 + Math.random() * 900000)}`;
    const fecha = new Date().toLocaleString('es-MX');
    const fechaEntregaTexto = this.formatearFechaLegible(this.fechaEntrega);
    const lugarTexto = this.lugarEntrega || 'No especificado';

    doc.setFontSize(15);
    doc.text('Comprobante de Pedido - K\'onol Kalli', 50, 18);

    doc.setFontSize(11);
    doc.text(`Folio: ${folioDummy}`, 14, 26);
    doc.text(`Cliente: ${this.dummyClientName}`, 14, 32);
    doc.text(`Fecha de pedido: ${fecha}`, 14, 38);
    doc.text(`Fecha de entrega: ${fechaEntregaTexto}`, 14, 44);
    doc.text(`Lugar de entrega: ${lugarTexto}`, 14, 50);
    doc.text('-----------------------------------------------------------------------', 14, 59);

    let y = 70;
    items.forEach((item, index) => {
      const subtotal = item.price * item.quantity;
      const line = `${index + 1}.- ${item.name} | Cant: ${item.quantity} | Unit: $${item.price.toFixed(2)} | Sub: $${subtotal.toFixed(2)}`;
      const wrapped = doc.splitTextToSize(line, 180);
      doc.text(wrapped, 14, y);
      y += wrapped.length * 7;
    });

    y += 4;
    doc.text('-----------------------------------------------------------------------', 14, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`TOTAL A PAGAR: $${total.toFixed(2)}`, 14, y);

    const fileName = `pedido-${folioDummy}.pdf`;
    doc.save(fileName);
    return fileName;
  }

  private sendDummyWhatsApp(items: CartItem[], total: number, pdfFileName: string): void {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

    const cleanPhone = this.dummyWhatsappPhone.replace(/\D/g, '');
    const fechaEntregaTexto = this.formatearFechaLegible(this.fechaEntrega);
    const lugarTexto = this.lugarEntrega || 'No especificado';

    const mensaje = [
      'Hola, confirmo mi pedido.',
      `Productos seleccionados: ${items.length}`,
      `Fecha y hora de entrega: ${fechaEntregaTexto}`,
      `Lugar de entrega: ${lugarTexto}`,
      `Total: $${total.toFixed(2)}`,
      `Adjunto el folio del archivo PDF generado: ${pdfFileName}`
    ].join('\n');

    const encodedText = encodeURIComponent(mensaje);
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const url = isMobile
      ? `https://wa.me/${cleanPhone}?text=${encodedText}`
      : `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;

    if (this.whatsappTabRef && !this.whatsappTabRef.closed) {
      this.whatsappTabRef.location.href = url;
      this.whatsappTabRef.focus();
    } else {
      this.whatsappTabRef = window.open(url, 'whatsapp_order_tab', 'noopener,noreferrer');
    }
  }

  confirmOrder(): void {
    const items = this.modalItems;
    if (items.length === 0) return;

    let hayError = false;

    if (!this.fechaEntrega) {
      this.errorEntrega = 'Selecciona una fecha y hora válida de entrega (10:00 a.m. a 8:00 p.m.).';
      hayError = true;
    }

    if (!this.lugarEntrega) {
      this.errorLugar = 'Por favor selecciona un punto de entrega.';
      hayError = true;
    }

    if (hayError) {
      this.cdr.detectChanges();
      return;
    }

    const total = this.modalTotal;
    const pdfFileName = this.generateDummyPdf(items, total);
    this.sendDummyWhatsApp(items, total, pdfFileName);

    if (!this.quickBuyItem) {
      this.cartService.clearCart();
    }

    this.showConfirmModal = false;
    this.cartService.clearQuickBuy();
    this.cartService.closeConfirmModal();
    this.cdr.detectChanges();
  }
}
