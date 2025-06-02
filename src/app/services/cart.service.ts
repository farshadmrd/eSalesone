import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: string;
  title: string;
  package: string;
  price: number;
  features: string[];
  serviceIcon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadCartFromStorage();
  }
  addToCart(item: CartItem) {
    // Use requestAnimationFrame to batch DOM updates
    requestAnimationFrame(() => {
      const currentItems = [...this.cartItemsSubject.value]; // Create new array reference
      const existingItemIndex = currentItems.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex > -1) {
        // Replace existing item
        currentItems[existingItemIndex] = item;
      } else {
        // Add new item
        currentItems.push(item);
      }
      
      this.cartItemsSubject.next(currentItems);
      this.saveCartToStorage();
    });
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
    return this.cartItemsSubject.value.reduce((total, item) => total + item.price, 0);
  }

  getItemCount(): number {
    return this.cartItemsSubject.value.length;
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
}
