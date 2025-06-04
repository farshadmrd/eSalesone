import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CheckoutResponse } from './checkout.service';

export interface OrderData {
  response: CheckoutResponse;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  orderSummary: {
    items: any[];
    total: number;
    itemCount: number;
  };
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderDataSubject = new BehaviorSubject<OrderData | null>(null);
  public orderData$ = this.orderDataSubject.asObservable();

  constructor() {}

  setOrderData(orderData: OrderData): void {
    // Store in memory
    this.orderDataSubject.next(orderData);
    
    // Also store in sessionStorage for page refresh scenarios
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('orderData', JSON.stringify(orderData));
    }
  }

  getOrderData(): OrderData | null {
    // First try to get from memory
    const memoryData = this.orderDataSubject.value;
    if (memoryData) {
      return memoryData;
    }

    // If not in memory, try sessionStorage
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('orderData');
      if (stored) {
        try {
          const orderData = JSON.parse(stored);
          this.orderDataSubject.next(orderData);
          return orderData;
        } catch (error) {
          console.error('Error parsing stored order data:', error);
          this.clearOrderData();
        }
      }
    }

    return null;
  }

  clearOrderData(): void {
    this.orderDataSubject.next(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('orderData');
    }
  }
  getOrderStatus(): 'approved' | 'declined' | 'failed' | null {
    const orderData = this.getOrderData();
    if (!orderData) return null;

    // Check response status first - handle exact server status values
    if (orderData.response.status) {
      const serverStatus = orderData.response.status.toUpperCase();
      
      // Map server status to display status
      switch (serverStatus) {
        case 'APPROVED':
        case 'SUCCESS':
        case 'COMPLETED':
          return 'approved';
        case 'DECLINED':
        case 'REJECTED':
          return 'declined';
        case 'FAILED':
        case 'ERROR':
        default:
          return 'failed';
      }
    }

    // Fallback to success/failure detection
    if (orderData.response.success === true) {
      return 'approved';
    }

    // Determine if declined or failed based on error message
    const message = orderData.response.message?.toLowerCase() || '';
    if (message.includes('declined') || message.includes('reject')) {
      return 'declined';
    }

    return 'failed';
  }

  getOrderId(): string {
    const orderData = this.getOrderData();
    return orderData?.response.id || this.generateOrderId();
  }

  private generateOrderId(): string {
    return 'ORD-' + Date.now().toString().slice(-8);
  }
}
