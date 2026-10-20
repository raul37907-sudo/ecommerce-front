import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../product.service'; // <--- Importa servicio e interfaz



@Component({
  selector: 'app-descripcion-producto',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './descripcion-producto.html',
  styleUrl: './descripcion-producto.css'
})
export class DescripcionProductoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService); // <--- Inyección correcta de los  productos

  productId: number | null = null;
  product: Product | undefined;



  ngOnInit(): void {
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        this.productId = +idParam;
        // Busca el producto directamente usando el método centralizado del servicio
        this.product = this.productService.getProductById(this.productId);
    }
  }
}
