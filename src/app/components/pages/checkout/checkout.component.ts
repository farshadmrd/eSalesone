import { Component, OnInit, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../sections/header/header.component';
import { CartService, CartItem } from '../../../services/cart.service';
import { CheckoutService, CheckoutRequest } from '../../../services/checkout.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  orderSummary: CartItem[] = [];
  isSubmitting = false;
  
  cartService = inject(CartService);
  checkoutService = inject(CheckoutService);

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}  ngOnInit() {
    this.initializeForm();
    this.loadCartItems();
    this.scrollToTop();
  }

  private scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  loadCartItems() {
    this.cartService.cartItems$.subscribe(items => {
      this.orderSummary = items;
    });
  }  initializeForm() {
    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email, this.emailDotValidator]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]{10,}$/)]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      cardNumber: ['', [Validators.required]],
      expiryDate: ['', [Validators.required, this.futureDateValidator]],
      cvv: ['', [Validators.required]]
    });
  }

  futureDateValidator(control: any) {
    if (!control.value) return null;
    
    const value = control.value;
    if (!value.includes('/') || value.length !== 5) {
      return { invalidFormat: true };
    }
    
    const [month, year] = value.split('/');
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    if (monthNum < 1 || monthNum > 12) {
      return { invalidMonth: true };
    }
    
    const expiry = new Date(2000 + yearNum, monthNum - 1);
    const today = new Date();
    today.setDate(1); // Set to first of current month for comparison
      return expiry >= today ? null : { pastDate: true };
  }

  emailDotValidator(control: any) {
    if (!control.value) return null;
    
    const email = control.value;
    const atIndex = email.indexOf('@');
    
    // Check if email has @ symbol and there's at least one dot after it
    if (atIndex === -1) return null; // Let the built-in email validator handle this
    
    const domainPart = email.substring(atIndex + 1);
    if (!domainPart.includes('.')) {
      return { noDotAfterAt: true };
    }
    
    return null;
  }
  formatCardNumber(event: any) {
    // Only allow numbers and spaces
    let value = event.target.value.replace(/[^\d\s]/g, '').replace(/\s/g, '');
    let formattedValue = value.replace(/(.{4})/g, '$1 ');
    event.target.value = formattedValue.trim();
    
    // Update form control with unformatted value
    this.checkoutForm.get('cardNumber')?.setValue(value);
    this.checkoutForm.get('cardNumber')?.markAsTouched();
  }

  formatExpiryDate(event: any) {
    // Only allow numbers
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
    
    // Update form control with formatted value
    this.checkoutForm.get('expiryDate')?.setValue(value);
    this.checkoutForm.get('expiryDate')?.markAsTouched();
  }

  // Add function to format ZIP code (numbers only)
  formatZipCode(event: any) {
    // Only allow numbers and hyphens
    let value = event.target.value.replace(/[^\d\-]/g, '');
    event.target.value = value;
    
    // Update form control
    this.checkoutForm.get('zipCode')?.setValue(value);
    this.checkoutForm.get('zipCode')?.markAsTouched();
  }
  // Add function to format CVV (numbers only)
  formatCVV(event: any) {
    // Only allow numbers, max 3 digits
    let value = event.target.value.replace(/\D/g, '').substring(0, 3);
    event.target.value = value;
    
    // Update form control
    this.checkoutForm.get('cvv')?.setValue(value);
    this.checkoutForm.get('cvv')?.markAsTouched();
  }

  // Add function to format phone number (numbers and phone characters only)
  formatPhoneNumber(event: any) {
    // Only allow numbers, spaces, hyphens, parentheses, and plus sign
    let value = event.target.value.replace(/[^\d\s\-\(\)\+]/g, '');
    event.target.value = value;
    
    // Update form control
    this.checkoutForm.get('phone')?.setValue(value);
    this.checkoutForm.get('phone')?.markAsTouched();
  }
  getTotal(): number {
    return this.cartService.getTotal();
  }
  removeItem(itemId: string) {
    this.cartService.removeFromCart(itemId);
  }

  updateQuantity(itemId: string, quantity: number) {
    this.cartService.updateQuantity(itemId, quantity);
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
  }  onSubmit() {
    if (this.checkoutForm.valid && !this.isSubmitting) {
      // Check if cart has items
      if (this.orderSummary.length === 0) {
        if (isPlatformBrowser(this.platformId)) {
          alert('Your cart is empty. Please add items before checkout.');
        }
        return;
      }

      this.isSubmitting = true;
      
      const formValue = this.checkoutForm.value;
      const basket = this.checkoutService.transformCartToBasket(this.orderSummary);
        // Convert expiry date from MM/YY to YYYY/MM format
      const convertExpiryDate = (expiryDate: string): string => {
        if (!expiryDate || !expiryDate.includes('/')) {
          return expiryDate; // Return as is if invalid format
        }
        const [month, year] = expiryDate.split('/');
        const fullYear = '20' + year; // Add 20 to the front of YY
        return `${month}/${fullYear}`; // Return in YYYY/MM format
      };

      const checkoutRequest: CheckoutRequest = {
        basket: basket,
        full_name: formValue.fullName,
        email: formValue.email,
        phone_number: formValue.phone,
        address: formValue.address,
        city: formValue.city,
        state: formValue.state,
        zip_code: formValue.zipCode,
        card_number: formValue.cardNumber,
        expiry_date: convertExpiryDate(formValue.expiryDate),
        cvv: formValue.cvv,
        status: "PENDING",
        description: `Order for ${basket.length} service(s) - Total: $${this.getTotal()}`
      };

      console.log('Submitting checkout request:', checkoutRequest);

      this.checkoutService.submitCheckout(checkoutRequest).subscribe({
        next: (response) => {
          console.log('Order submitted successfully:', response);
          
          // Clear cart after successful submission (only in browser)
          if (isPlatformBrowser(this.platformId)) {
            this.cartService.clearCart();
            alert('Order submitted successfully! Your transaction has been processed.');
          }
          this.isSubmitting = false;
        },        error: (error) => {
          console.error('Error submitting order:', error);
          let errorMessage = 'Error submitting order. Please try again.';
          
          if (typeof error === 'string') {
            errorMessage = error;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          if (isPlatformBrowser(this.platformId)) {
            alert(errorMessage);
          }
          this.isSubmitting = false;
        }
      });
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
  }  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (field && field.errors && field.touched) {      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['noDotAfterAt']) return 'Email must have a dot (.) after the @ symbol';
      if (field.errors['pattern']) {
        if (fieldName === 'phone') return 'Please enter a valid phone number';
      }
      if (field.errors['pastDate']) return 'Expiry date must be in the future';
      if (field.errors['invalidFormat']) return 'Please enter date in MM/YY format';
      if (field.errors['invalidMonth']) return 'Month must be between 01 and 12';
      if (field.errors['minlength']) return `${fieldName} is too short`;
    }
    return '';
  }

  clearCartStorage() {
    this.cartService.clearCart();
  }
}
