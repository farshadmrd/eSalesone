import { Component } from '@angular/core';
import { ServiceCardsComponent } from '../../sections/service-cards/service-cards.component';

@Component({
  selector: 'app-my-services',
  standalone: true,
  imports: [ServiceCardsComponent],
  templateUrl: './my-services.component.html',
  styleUrl: './my-services.component.css'
})
export class MyServicesComponent {

}
