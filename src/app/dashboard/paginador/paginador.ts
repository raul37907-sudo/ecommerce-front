import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';
import { Product } from '../../product.service'; // Ajusta la ruta si tu interfaz Product está en otro directorio

@Component({
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  selector: 'app-paginador',
  styleUrl: './paginador.css',
  templateUrl: './paginador.html',
})
export class PaginadorComponent<T = Product> implements OnInit, OnChanges {
  private cdr = inject(ChangeDetectorRef);

  // Capturamos el control nativo de Angular Material para manipularlo directamente
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;

  // Uso de tipo genérico T[] en lugar de any[]
  @Input() items: T[] = [];
  @Input() pageSize = 5; // <--- Eliminada la anotación redundante : number

  @Output() paginatedItemsChange = new EventEmitter<T[]>();

  pageIndex = 0;
  totalLength = 0;
  pageSizeOptions = [5, 10, 15, 20];

  ngOnInit(): void {
    this.updatePagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      const newItems = (changes['items'].currentValue || []) as T[];

      // Sincronizamos los índices a 0
      this.pageIndex = 0;
      if (this.matPaginator) {
        this.matPaginator.pageIndex = 0;
      }

      this.totalLength = newItems.length;
      this.updatePagination();
      this.cdr.detectChanges(); // Refresco inmediato del contador e interfaz
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
    this.cdr.detectChanges();

    window.scrollTo({ top: 200, behavior: 'smooth' });
  }

  updatePagination(): void {
    if (!this.items) {
      this.paginatedItemsChange.emit([]);
      return;
    }

    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const sliceOfItems = this.items.slice(startIndex, endIndex);

    this.paginatedItemsChange.emit(sliceOfItems);
  }
}
