import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CartItem } from './cart.service';

export interface BasketItem {
  service_type_id: string;
  quantity: number;
}

export interface CheckoutRequest {
  basket: BasketItem[];
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  card_number: string;
  expiry_date: string;
  cvv: string;
  status: string | null;
  description: string;
}

export interface CheckoutResponse {
  id?: string;
  message?: string;
  success?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = 'http://127.0.0.1:8000/api/transactions/';

  constructor(private http: HttpClient) {}
  submitCheckout(checkoutData: CheckoutRequest): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(this.apiUrl, checkoutData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    console.error('Checkout API Error:', errorMessage);
    return throwError(errorMessage);
  }  transformCartToBasket(cartItems: CartItem[]): BasketItem[] {
    return cartItems.map(item => ({
      service_type_id: item.serviceTypeId, // Use explicit serviceTypeId field
      quantity: item.quantity || 1
    }));
  }
}
