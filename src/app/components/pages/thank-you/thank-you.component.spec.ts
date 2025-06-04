import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { ThankYouComponent } from './thank-you.component';
import { OrderService, OrderData } from '../../../services/order.service';

describe('ThankYouComponent', () => {
  let component: ThankYouComponent;
  let fixture: ComponentFixture<ThankYouComponent>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    const orderServiceSpy = jasmine.createSpyObj('OrderService', ['getOrderData', 'getOrderStatus', 'getOrderId', 'clearOrderData']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParams: of({})
    });

    await TestBed.configureTestingModule({
      imports: [ThankYouComponent],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThankYouComponent);
    component = fixture.componentInstance;
    mockOrderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockActivatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show next steps only for approved successful transactions', () => {
    const approvedOrderData: OrderData = {
      response: {
        id: 'ORD-12345',
        status: 'APPROVED'
      },
      customerInfo: {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        city: 'Anytown',
        state: 'ST',
        zipCode: '12345'
      },
      orderSummary: {
        items: [],
        total: 100,
        itemCount: 1
      },
      timestamp: Date.now()
    };

    mockOrderService.getOrderData.and.returnValue(approvedOrderData);
    mockOrderService.getOrderStatus.and.returnValue('approved');
    mockOrderService.getOrderId.and.returnValue('ORD-12345');

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.shouldShowNextSteps()).toBe(true);
    expect(component.orderStatus).toBe('approved');
  });

  it('should NOT show next steps for declined transactions', () => {
    const declinedOrderData: OrderData = {
      response: {
        id: 'ORD-12345',
        message: 'Payment declined',
        success: false,
        status: 'DECLINED'
      },
      customerInfo: {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        city: 'Anytown',
        state: 'ST',
        zipCode: '12345'
      },
      orderSummary: {
        items: [],
        total: 100,
        itemCount: 1
      },
      timestamp: Date.now()
    };

    mockOrderService.getOrderData.and.returnValue(declinedOrderData);
    mockOrderService.getOrderStatus.and.returnValue('declined');
    mockOrderService.getOrderId.and.returnValue('ORD-12345');

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.shouldShowNextSteps()).toBe(false);
    expect(component.orderStatus).toBe('declined');
  });
  it('should NOT show next steps for approved but unsuccessful transactions', () => {
    const approvedButUnsuccessfulOrderData: OrderData = {
      response: {
        id: 'ORD-12345',
        message: 'Order needs verification',
        success: false,
        status: 'APPROVED'
      },
      customerInfo: {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        city: 'Anytown',
        state: 'ST',
        zipCode: '12345'
      },
      orderSummary: {
        items: [],
        total: 100,
        itemCount: 1
      },
      timestamp: Date.now()
    };

    mockOrderService.getOrderData.and.returnValue(approvedButUnsuccessfulOrderData);
    mockOrderService.getOrderStatus.and.returnValue('approved');
    mockOrderService.getOrderId.and.returnValue('ORD-12345');

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.shouldShowNextSteps()).toBe(false);
    expect(component.orderStatus).toBe('approved');
  });
});
