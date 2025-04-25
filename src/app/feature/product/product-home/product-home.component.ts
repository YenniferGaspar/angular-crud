import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ProductService } from '../../../core/services/product.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { SaveProductDlgComponent } from '../save-product-dlg/save-product-dlg.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Product } from '../../../core/interfaces/product';

@Component({
  selector: 'app-product-home',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './product-home.component.html',
  styleUrls: ['./product-home.component.scss']
})
export class ProductHomeComponent implements OnInit {
  columns: string[] = ['image', 'name', 'currency', 'price', 'state', 'action'];
  dataSource: Product[] = [];
  allProducts: Product[] = []; // Para almacenar todos los productos originales

  productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.productService.getAll().subscribe(res => {
      console.log('Api response:', res.data);
      this.dataSource = res.data;
      this.allProducts = [...res.data]; // Guardar copia de todos los productos
    });
  }

  // Método para manejar el evento input
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const searchText = input.value.toLowerCase();
    
    if (!searchText) {
      // Si el campo está vacío, mostrar todos los productos
      this.dataSource = [...this.allProducts];
      return;
    }
    
    // Filtrar productos solo por nombre y estado
    this.dataSource = this.allProducts.filter((product: Product) => {
      return product.name?.toLowerCase().includes(searchText) || 
             product.state.toString().toLowerCase().includes(searchText); // Convertir 'state' a cadena y buscar
    });
  }

  openProductDlg(product?: Product): void {
    const dialogRef = this.dialog.open(SaveProductDlgComponent, {
      width: '500px',
      data: product
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getAll();
      }
    });
  }

  inactiveProduct(id: number) {
    this.productService.inactive(id).subscribe(res => {
      if (res.status) {
        this.getAll();
        this.snackbar.open('Se inactivo el producto', 'Aceptar');
      }
    });
  }
}
