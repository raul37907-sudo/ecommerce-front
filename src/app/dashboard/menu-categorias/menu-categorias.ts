import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule} from '@angular/common';

 @Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-menu-categorias',
  styleUrl: './menu-categorias.css',
  templateUrl: './menu-categorias.html',
})
export class MenuCategoriasComponent  {
    // resive la categoria actual  desde el componente  padre para saber  cual  marca  como  activa
    @Input() selectedCategory = 'todas';

    //Emite la categoria seleccionada hacia el  componente dashboard
    @Output() categoryChange = new EventEmitter<string>();

    selectCategory(categoryKey: string) : void{
      this.categoryChange.emit(categoryKey);
      }
  }
