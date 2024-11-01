import { Component } from '@angular/core';
import { MyStoreService } from '../services/my-store/my-store.service';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from "../components/product-card/product-card.component";
import { ProductModel } from '../models/product.model';

@Component({
  selector: 'app-my-store',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './my-store.component.html',
  styleUrl: './my-store.component.css'
})
export class MyStoreComponent {
  products: ProductModel[] = [];

  constructor(private myStoreService: MyStoreService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.myStoreService.getProducts().subscribe({
      next: (data: ProductModel[]) => {
        this.products = data;
      },
      error: (eror) => {
        console.error('Error fetching products:', eror);
      },
      complete: () => {
        
      }
    });
  }
}
