import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServiceCard } from './service-card.model';
import { CartService, CartItem } from '../../../services/cart.service';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.css'
})
export class ServiceCardComponent {
  @Input() service!: ServiceCard;
  
  router = inject(Router);
  cartService = inject(CartService);

  onSelectPackage(pricing: any) {
    const cartItem: CartItem = {
      id: `${this.service.title}-${pricing.name}`,
      title: this.service.title,
      package: pricing.name,
      price: pricing.price,
      features: pricing.features,
      serviceIcon: this.service.icon
    };
    
    this.cartService.addToCart(cartItem);
    
    // Navigate to checkout page
    this.router.navigate(['/checkout']);
  }
}
