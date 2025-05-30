import { Component } from '@angular/core';
import { MainComponent } from '../main/main.component';
import { AboutMeComponent } from '../about-me/about-me.component';
import { MyServicesComponent } from '../my-services/my-services.component';

@Component({
  selector: 'app-home',
  imports: [MainComponent, AboutMeComponent, MyServicesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
