import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceCard } from './service-card.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.css'
})
export class ServiceCardComponent {
  @Input() service!: ServiceCard;
}
