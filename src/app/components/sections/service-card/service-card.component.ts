import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServiceCard } from './service-card.model';
import { CartService, CartItem } from '../../../services/cart.service';
import { PurchaseModalComponent } from '../purchase-modal/purchase-modal.component';

interface ServiceData {
  serviceTitle: string;
  packageName: string;
  price: number;
  features: string[];
  serviceIcon: string;
}

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, PurchaseModalComponent],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceCardComponent {
  @Input() service!: ServiceCard;
  
  router = inject(Router);
  cartService = inject(CartService);
    // Modal state
  isModalVisible = false;
  selectedServiceData: ServiceData | null = null;
  private isProcessing = false; // Prevent double-clicks

  onSelectPackage(pricing: any) {
    if (this.isProcessing || this.isModalVisible) return;
    
    this.isProcessing = true;
    
    // Use batch update to minimize change detection cycles
    requestAnimationFrame(() => {
      this.selectedServiceData = {
        serviceTitle: this.service.title,
        packageName: pricing.name,
        price: pricing.price,
        features: [...pricing.features], // Create new array reference
        serviceIcon: this.service.icon
      };
      
      this.isModalVisible = true;
      this.isProcessing = false;
    });
  }
  
  onCloseModal() {
    this.isModalVisible = false;
    // Delay clearing data to avoid abrupt modal close
    setTimeout(() => {
      this.selectedServiceData = null;
    }, 300);
  }
  
  onConfirmPurchase(cartItem: CartItem) {
    // Additional logic if needed after purchase confirmation
    console.log('Item added to cart:', cartItem);
  }

  // TrackBy functions for performance optimization
  trackByPrice(index: number, pricing: any): any {
    return pricing.name || index;
  }
  trackByFeature(index: number, feature: string): string {
    return feature || index.toString();
  }
}
