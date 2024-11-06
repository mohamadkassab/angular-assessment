import { Component, effect } from '@angular/core';
import { MyStoreService } from '../../services/my-store/my-store.service';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { ProductModel } from '../../models/product.model';
import { SignalService } from '../../services/signal/signal.service';
import { StatusModel } from '../../models/status.model';
import { PagesModel } from '../../models/pages.model';

@Component({
  selector: 'app-my-store',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './my-store.component.html',
  styleUrl: './my-store.component.css'
})
export class MyStoreComponent {
  products: ProductModel[] = [];

  constructor(private myStoreService: MyStoreService, private signalService: SignalService) {
    effect(() => {
      const _products = this.signalService._myStoreData();
      if (_products.length > 0) {
        this.products = _products;
      }
    });
   }

  ngOnInit(): void {
    this.signalService.updateCurrentPage$(PagesModel.MyStore);
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.myStoreService.getProducts();
  }
}
