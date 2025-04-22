import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/interfaces/product';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { SaveProductDlgComponent } from '../save-product-dlg/save-product-dlg.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-product-home',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,

    FormsModule
  ],
  templateUrl: './product-home.component.html',
  styleUrl: './product-home.component.scss'
})
export class ProductHomeComponent implements OnInit {
  columns: string[] = ['image', 'name', 'description', 'currency', 'price', 'state', 'action'];
  dataSource: Product[] = [];

  productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);
  searchTerm: any;
  selectedCurrency: any;

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.productService.getAll().subscribe(res => {
      console.log('Api response:', res.data);
      this.dataSource = res.data;
    })
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
    })
  }
  filterProduct() {
    this.productService.getAll().subscribe(res => {
      const search = this.searchTerm.toLowerCase();

      this.dataSource = res.data.filter((product: any) => {
        const matchesText = (
          (product.name && product.name.toLowerCase().includes(search))

        );




        return matchesText;
      });
    });
  }

  filterProductCurrencyCode() {
    this.productService.getAll().subscribe(res => {
      const currency = this.selectedCurrency;
      this.dataSource = res.data.filter((product: any) => {
        const matchesCurrency = currency ? product.currencyCode === currency : true;

        return matchesCurrency;
      }
      )
    }
    )
  }
}