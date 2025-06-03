import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceCardComponent } from '../service-card/service-card.component';
import { PhotoServicesService } from '../../../services/photo-services.service';
import { ServiceCard } from '../service-card/service-card.model';

@Component({
  selector: 'app-service-cards',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent],
  templateUrl: './service-cards.component.html',
  styleUrl: './service-cards.component.css'
})
export class ServiceCardsComponent implements OnInit {
  services: ServiceCard[] = [];
  constructor(private photoServicesService: PhotoServicesService) {}  ngOnInit(): void {
    console.log('ServiceCardsComponent: Starting to load services from API...');
    this.photoServicesService.getServices().subscribe({
      next: (services) => {
        console.log('ServiceCardsComponent: Services loaded successfully:', services);
        // Filter out inactive services
        this.services = services.filter(service => service.is_active === true);
        console.log('ServiceCardsComponent: Active services after filtering:', this.services);
      },
      error: (error) => {
        console.error('ServiceCardsComponent: Error loading services:', error);
        this.services = [];
      }
    });
  }
}
