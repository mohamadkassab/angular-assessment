import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product: any;

  selectedProduct: any = null;

  openDetails(product: any) {
    this.selectedProduct = product;
  }

  closeModal() {
    this.selectedProduct = null;
  }
}
