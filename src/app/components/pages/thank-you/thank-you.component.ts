import { Component, OnInit, OnDestroy, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../sections/header/header.component';
import { OrderService, OrderData } from '../../../services/order.service';

export type OrderStatus = 'approved' | 'declined' | 'failed';

@Component({
  selector: 'app-thank-you',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './thank-you.component.html',
  styleUrl: './thank-you.component.css'
})
export class ThankYouComponent implements OnInit, OnDestroy {
  orderStatus: OrderStatus = 'approved';
  orderId: string = '';
  customerName: string = '';
  email: string = '';
  orderData: OrderData | null = null;
  orderTotal: number = 0;
  orderItems: any[] = [];
  orderDate: string = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  ngOnInit() {
    this.scrollToTop();
    this.loadOrderData();
  }

  private scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private loadOrderData() {
    // First try to get order data from service
    this.orderData = this.orderService.getOrderData();
    
    if (this.orderData) {
      // Load data from order service
      this.orderStatus = this.orderService.getOrderStatus() || 'approved';
      this.orderId = this.orderService.getOrderId();
      this.customerName = this.orderData.customerInfo.fullName;
      this.email = this.orderData.customerInfo.email;
      this.orderTotal = this.orderData.orderSummary.total;
      this.orderItems = this.orderData.orderSummary.items;
      this.orderDate = new Date(this.orderData.timestamp).toLocaleDateString();
    } else {
      // Fallback to query parameters for backward compatibility
      this.getOrderDetailsFromQueryParams();
    }
  }

  private getOrderDetailsFromQueryParams() {
    this.route.queryParams.subscribe(params => {
      this.orderStatus = params['status'] || 'approved';
      this.orderId = params['orderId'] || this.generateOrderId();
      this.customerName = params['customerName'] || '';
      this.email = params['email'] || '';
      this.orderDate = new Date().toLocaleDateString();
    });
  }

  private generateOrderId(): string {
    return 'ORD-' + Date.now().toString().slice(-8);
  }

  getStatusIcon(): string {
    switch (this.orderStatus) {
      case 'approved':
        return '✅';
      case 'declined':
        return '❌';
      case 'failed':
        return '⚠️';
      default:
        return '✅';
    }
  }

  getStatusClass(): string {
    switch (this.orderStatus) {
      case 'approved':
        return 'status-approved';
      case 'declined':
        return 'status-declined';
      case 'failed':
        return 'status-failed';
      default:
        return 'status-approved';
    }
  }

  getStatusTitle(): string {
    switch (this.orderStatus) {
      case 'approved':
        return 'Order Confirmed!';
      case 'declined':
        return 'Order Declined';
      case 'failed':
        return 'Order Failed';
      default:
        return 'Order Confirmed!';
    }
  }
  getStatusMessage(): string {
    switch (this.orderStatus) {
      case 'approved':
        return 'Thank you for your order! Your transaction has been successfully processed.';
      case 'declined':
        return 'Unfortunately, your payment has been declined. Please check your payment details and try again.';
      case 'failed':
        return 'There was an issue processing your order. Please try again or contact support.';
      default:
        return 'Thank you for your order!';
    }
  }

  getActionText(): string {
    switch (this.orderStatus) {
      case 'approved':
        return 'Continue Shopping';
      case 'declined':
      case 'failed':
        return 'Try Again';
      default:
        return 'Continue Shopping';
    }
  }

  onActionClick() {
    switch (this.orderStatus) {
      case 'approved':
        this.router.navigate(['/services']);
        break;
      case 'declined':
      case 'failed':
        this.router.navigate(['/checkout']);
        break;
      default:
        this.router.navigate(['/home']);
    }
  }
  goHome() {
    this.router.navigate(['/home']);
  }
  onDestroy() {
    // Clear order data when leaving the page to prevent stale data
    if (this.orderData) {
      this.orderService.clearOrderData();
    }
  }

  ngOnDestroy() {
    this.onDestroy();
  }

  getOrderResponseMessage(): string {
    if (this.orderData?.response?.message) {
      return this.orderData.response.message;
    }
    return '';
  }

  getDetailedErrorInfo(): string {
    if (!this.orderData || this.orderStatus === 'approved') {
      return '';
    }

    const response = this.orderData.response;
    if (response.error_code) {
      return `Error Code: ${response.error_code}`;
    }

    return '';
  }

  hasOrderItems(): boolean {
    return this.orderItems.length > 0;
  }

  getServerResponseStatus(): string {
    if (this.orderData?.response?.status) {
      return this.orderData.response.status.toString();
    }
    return 'No status received';
  }  isServerStatusDeclined(): boolean {
    const serverStatus = this.orderData?.response?.status?.toString().toUpperCase();
    return serverStatus === 'DECLINED';
  }

  shouldShowNextSteps(): boolean {
    return this.orderStatus === 'approved' && 
           this.orderData?.response?.success !== false;
  }
}
