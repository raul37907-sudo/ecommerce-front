import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';

@Component({
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  selector: 'app-paginador',
  styleUrl: './paginador.css',
  templateUrl: './paginador.html',
})
export class Paginador implements OnInit, OnChanges {
  private cdr = inject(ChangeDetectorRef);

  // Capturamos el control nativo de Angular Material para manipularlo directamente
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;

  @Input() items: any[] = [];
  @Input() pageSize: number = 7;

  @Output() paginatedItemsChange = new EventEmitter<any[]>();

  pageIndex = 0;
  totalLength = 0;
  pageSizeOptions = [7, 14, 21, 50];

  ngOnInit(): void {
    this.updatePagination();
  }

ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      const newItems = changes['items'].currentValue || [];

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

    window.scrollTo({ top: 400, behavior: 'smooth' });
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
