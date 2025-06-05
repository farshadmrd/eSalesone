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
  status?: string; // Can be 'APPROVED', 'DECLINED', 'FAILED', etc.
  error_code?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private apiBase = window.location.origin; 
  private apiUrl = `${this.apiBase}/api/transactions/`;
  
  // private apiUrl = 'http://127.0.0.1:8000/api/transactions/';

  constructor(private http: HttpClient) {}
  submitCheckout(checkoutData: CheckoutRequest): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(this.apiUrl, checkoutData).pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    let errorType = 'failed';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 402 || error.status === 403) {
        errorType = 'declined';
        errorMessage = 'Payment declined by your bank or card issuer';
      } else if (error.status >= 400 && error.status < 500) {
        errorType = 'declined';
        errorMessage = error.error?.message || 'Payment declined - please check your payment details';
      } else if (error.status >= 500) {
        errorType = 'failed';
        errorMessage = 'Server error - please try again later';
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    console.error('Checkout API Error:', errorMessage);
    
    // Return an error object with type information
    const errorObj = new Error(errorMessage) as any;
    errorObj.type = errorType;
    errorObj.status = error.status;
    
    return throwError(errorObj);
  }transformCartToBasket(cartItems: CartItem[]): BasketItem[] {
    return cartItems.map(item => ({
      service_type_id: item.serviceTypeId, // Use explicit serviceTypeId field
      quantity: item.quantity || 1
    }));
  }
}
