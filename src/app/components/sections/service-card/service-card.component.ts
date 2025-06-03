import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServiceCard, ServiceType } from './service-card.model';
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
  onSelectPackage(serviceType: ServiceType) {
    if (this.isProcessing || this.isModalVisible) return;
    
    this.isProcessing = true;
    
    // Use batch update to minimize change detection cycles
    requestAnimationFrame(() => {
      this.selectedServiceData = {
        serviceTitle: this.service.title,
        packageName: serviceType.name,
        price: parseFloat(serviceType.price), // Convert string to number
        features: [...serviceType.description], // Create new array reference
        serviceIcon: this.service.logo // Use logo instead of icon
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
  trackByServiceType(index: number, serviceType: ServiceType): string {
    return serviceType.id || serviceType.name || index.toString();
  }
  
  trackByFeature(index: number, feature: string): string {
    return feature || index.toString();
  }

  // Method to get only active service types
  getActiveServiceTypes(): ServiceType[] {
    return this.service.types?.filter(serviceType => serviceType.is_active === true) || [];
  }
}
