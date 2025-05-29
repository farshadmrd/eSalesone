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

  constructor(private photoServicesService: PhotoServicesService) {}

  ngOnInit(): void {
    this.services = this.photoServicesService.getServices();
  }
}
