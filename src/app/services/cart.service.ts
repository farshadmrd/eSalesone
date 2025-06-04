import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';

export interface CartItem {
  id: string;
  serviceTypeId: string; // Add explicit service type ID field
  title: string;
  package: string;
  serviceTypeName: string; // Add service type name for better display
  price: number;
  features: string[];
  serviceIcon?: string;
  quantity?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();
  
  private itemAddedSubject = new Subject<CartItem>();
  public itemAdded$ = this.itemAddedSubject.asObservable();

  private miniBasketHideSubject = new Subject<void>();
  public miniBasketHide$ = this.miniBasketHideSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadCartFromStorage();
  }  addToCart(item: CartItem, showMiniBasket: boolean = true) {
    // Use requestAnimationFrame to batch DOM updates
    requestAnimationFrame(() => {
      const currentItems = [...this.cartItemsSubject.value]; // Create new array reference
      const existingItemIndex = currentItems.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex > -1) {
        // Increase quantity for existing item
        currentItems[existingItemIndex].quantity = (currentItems[existingItemIndex].quantity || 1) + 1;
      } else {
        // Add new item with quantity 1
        currentItems.push({...item, quantity: 1});
      }
      
      this.cartItemsSubject.next(currentItems);
      this.saveCartToStorage();
      
      // Only notify that an item was added if we want to show mini-basket
      if (showMiniBasket) {
        this.itemAddedSubject.next(item);
      }
    });
  }

  updateQuantity(itemId: string, quantity: number) {
    const currentItems = [...this.cartItemsSubject.value];
    const itemIndex = currentItems.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        currentItems.splice(itemIndex, 1);
      } else {
        currentItems[itemIndex].quantity = quantity;
      }
      
      this.cartItemsSubject.next(currentItems);
      this.saveCartToStorage();
    }
  }

  removeFromCart(itemId: string) {
    const currentItems = this.cartItemsSubject.value;
    const filteredItems = currentItems.filter(item => item.id !== itemId);
    this.cartItemsSubject.next(filteredItems);
    this.saveCartToStorage();
  }

  clearCart() {
    this.cartItemsSubject.next([]);
    this.saveCartToStorage();
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }
  getTotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  }

  getItemCount(): number {
    return this.cartItemsSubject.value.reduce((count, item) => count + (item.quantity || 1), 0);
  }
  private saveCartToStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cartItemsSubject.value));
    }
  }

  private loadCartFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const cartItems = JSON.parse(savedCart);
          this.cartItemsSubject.next(cartItems);
        } catch (error) {
          console.error('Error loading cart from storage:', error);
          this.cartItemsSubject.next([]);
        }
      }
    }
  }

  hideMiniBasket() {
    this.miniBasketHideSubject.next();
  }
}
