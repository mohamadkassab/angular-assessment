import { Component } from '@angular/core';
import { MyStoreService } from '../services/my-store/my-store.service';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from "../components/product-card/product-card.component";
import { ProductModel } from '../models/product.model';
import { StateService } from '../services/app-state/app-state.service';

@Component({
  selector: 'app-my-store',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './my-store.component.html',
  styleUrl: './my-store.component.css'
})
export class MyStoreComponent {
  products: ProductModel[] = [];

  constructor(private myStoreService: MyStoreService, private stateService: StateService,) { }

  ngOnInit(): void {
    this.stateService.updateCurrentPage("My Store");
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.stateService.updateStatus("loading");
    this.myStoreService.getProducts().subscribe({
      next: (data: ProductModel[]) => {
        this.products = data;
      },
      error: (eror) => {
        console.error('Error fetching products:', eror);
        this.stateService.updateStatus("idle");
      },
      complete: () => {
        this.stateService.updateStatus("idle");
      }
    });
  }
}
