import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mini-basket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-basket.component.html',
  styleUrl: './mini-basket.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiniBasketComponent implements OnInit, OnDestroy {  cartService = inject(CartService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
    cartItems: CartItem[] = [];
  isVisible = false;  autoHideTimeout?: number;
  private cartSubscription?: Subscription;
  private itemAddedSubscription?: Subscription;
  private hideSubscription?: Subscription;  ngOnInit() {
    // Listen to cart changes
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.cdr.markForCheck(); // Manually trigger change detection
    });
    
    // Listen to item additions to show mini basket
    this.itemAddedSubscription = this.cartService.itemAdded$.subscribe((item) => {
      // Ensure we show the mini-basket after item is added
      // Use a small delay to ensure DOM is updated
      setTimeout(() => {
        this.showMiniBasket();
        this.cdr.detectChanges(); // Force change detection
      }, 50);
    });

    // Listen for hide events
    this.hideSubscription = this.cartService.miniBasketHide$.subscribe(() => {
      this.hideMiniBasket();
    });
  }
  ngOnDestroy() {
    this.cartSubscription?.unsubscribe();
    this.itemAddedSubscription?.unsubscribe();
    this.hideSubscription?.unsubscribe();
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
    }
  }showMiniBasket() {
    this.isVisible = true;
    
    // Auto-hide after 5 seconds
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
    }
    
    this.autoHideTimeout = window.setTimeout(() => {
      this.hideMiniBasket();
    }, 5000);
  }

  hideMiniBasket() {
    this.isVisible = false;
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
    }
  }

  increaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.id, (item.quantity || 1) + 1);
  }

  decreaseQuantity(item: CartItem) {
    const currentQuantity = item.quantity || 1;
    if (currentQuantity > 1) {
      this.cartService.updateQuantity(item.id, currentQuantity - 1);
    } else {
      this.removeItem(item.id);
    }
  }

  removeItem(itemId: string) {
    this.cartService.removeFromCart(itemId);
  }

  getTotalPrice(): number {
    return this.cartService.getTotal();
  }

  getTotalItems(): number {
    return this.cartService.getItemCount();
  }

  goToCheckout() {
    this.hideMiniBasket();
    this.router.navigate(['/checkout']);
  }
  continueShopping() {
    this.hideMiniBasket();
  }

  trackByItem(index: number, item: CartItem): string {
    return item.id;
  }
}
