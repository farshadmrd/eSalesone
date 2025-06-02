import { Component, OnInit, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../sections/header/header.component';
import { CartService, CartItem } from '../../../services/cart.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  orderSummary: CartItem[] = [];
  
  cartService = inject(CartService);

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngOnInit() {
    this.initializeForm();
    this.loadCartItems();
  }
  loadCartItems() {
    this.cartService.cartItems$.subscribe(items => {
      this.orderSummary = items;
    });
  }

  initializeForm() {
    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]{10,}$/)]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: ['', [Validators.required, this.futureDateValidator]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
  }

  futureDateValidator(control: any) {
    if (!control.value) return null;
    
    const [month, year] = control.value.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const today = new Date();
    
    return expiry > today ? null : { pastDate: true };
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.replace(/(.{4})/g, '$1 ');
    event.target.value = formattedValue.trim();
    this.checkoutForm.patchValue({ cardNumber: value });
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
    this.checkoutForm.patchValue({ expiryDate: value });
  }
  getTotal(): number {
    return this.cartService.getTotal();
  }

  removeItem(itemId: string) {
    this.cartService.removeFromCart(itemId);
  }
  onSubmit() {
    if (this.checkoutForm.valid) {
      console.log('Form submitted:', this.checkoutForm.value);
      
      // Clear cart after successful submission (only in browser)
      if (isPlatformBrowser(this.platformId)) {
        this.cartService.clearCart();
        alert('Order submitted successfully!');
      }
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      this.checkoutForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['pattern']) {
        if (fieldName === 'phone') return 'Please enter a valid phone number';
        if (fieldName === 'cardNumber') return 'Card number must be 16 digits';
        if (fieldName === 'cvv') return 'CVV must be 3 digits';
        if (fieldName === 'zipCode') return 'Please enter a valid zip code';
      }
      if (field.errors['pastDate']) return 'Expiry date must be in the future';
      if (field.errors['minlength']) return `${fieldName} is too short`;
    }
    return '';
  }

  clearCartStorage() {
    this.cartService.clearCart();
  }
}
