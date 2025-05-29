import { Component,input,inject } from '@angular/core';
import { TriggerAnimationService } from "../../../services/trigger-animation.service";

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  scrollTo =input.required<(id: string) => void>();
  TriggerAnimationService=inject(TriggerAnimationService); //trigger animation of about me

  handleClick(){
    this.scrollTo()('page2');
    this.TriggerAnimationService.triggerAnimation(); //trigger animation of about me
  }

 
}
