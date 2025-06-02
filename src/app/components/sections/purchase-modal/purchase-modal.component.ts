import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../../services/cart.service';

interface ServiceData {
  serviceTitle: string;
  packageName: string;
  price: number;
  features: string[];
  serviceIcon: string;
}

@Component({
  selector: 'app-purchase-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-modal.component.html',
  styleUrl: './purchase-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurchaseModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isVisible: boolean = false;
  @Input() serviceData: ServiceData | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmPurchase = new EventEmitter<CartItem>();

  router = inject(Router);
  cartService = inject(CartService);
  
  private keydownHandler = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.onClose();
    }
  };  ngOnInit() {
    // Add escape key listener for better UX
    document.addEventListener('keydown', this.keydownHandler);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible']) {
      if (this.isVisible) {
        // Modal opened - optimize performance
        document.body.classList.add('modal-open');
        document.dispatchEvent(new CustomEvent('modalOpen'));
        
        // Temporarily disable all transitions for smoother modal opening
        document.documentElement.style.setProperty('--transition-speed', '0s');
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--transition-speed', '0.2s');
        });
      } else {
        // Modal closed - restore normal behavior  
        document.body.classList.remove('modal-open');
        document.dispatchEvent(new CustomEvent('modalClose'));
      }
    }
  }

  ngOnDestroy() {
    // Clean up event listener and body state
    document.removeEventListener('keydown', this.keydownHandler);
    document.body.classList.remove('modal-open');
    document.dispatchEvent(new CustomEvent('modalClose'));
  }onClose() {
    this.closeModal.emit();
  }

  onConfirmPurchase() {
    if (!this.serviceData) return;
    
    // Debounce to prevent double-clicks
    const cartItem: CartItem = {
      id: `${this.serviceData.serviceTitle}-${this.serviceData.packageName}`,
      title: this.serviceData.serviceTitle,
      package: this.serviceData.packageName,
      price: this.serviceData.price,
      features: [...this.serviceData.features], // Create new array reference
      serviceIcon: this.serviceData.serviceIcon
    };
    
    // Use batch operations for better performance
    requestAnimationFrame(() => {
      this.cartService.addToCart(cartItem);
      this.confirmPurchase.emit(cartItem);
      this.onClose();
      
      // Navigate after modal closes
      setTimeout(() => {
        this.router.navigate(['/checkout']);
      }, 100);
    });
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  // TrackBy function for features list
  trackByFeature(index: number, feature: string): string {
    return feature || index.toString();
  }
}
