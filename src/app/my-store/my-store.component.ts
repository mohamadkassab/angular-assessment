import { Component } from '@angular/core';
import { Product, MyStoreService } from '../services/my-store/my-store.service';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from "../components/product-card/product-card.component";
@Component({
  selector: 'app-my-store',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './my-store.component.html',
  styleUrl: './my-store.component.css'
})
export class MyStoreComponent {
  products: Product[] = [];

  constructor(private myStoreService: MyStoreService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.myStoreService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
      complete: () => {
        console.log('Product fetching completed.');
      }
    });
  }
}
