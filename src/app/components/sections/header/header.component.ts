import { Component,input,inject } from '@angular/core';
import { TriggerAnimationService } from "../../../services/trigger-animation.service";
import { ScrollToService } from "../../../services/scroll-to.services";

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  TriggerAnimationService=inject(TriggerAnimationService); //trigger animation of about me
  scrollToService = inject(ScrollToService); // scroll to service
  
  handleClick(){
    this.scrollToService.scrollTo('page2');
    this.TriggerAnimationService.triggerAnimation(); //trigger animation of about me
  }

  handleServicesClick(sectionId: string){
    this.scrollToService.scrollTo(sectionId);
  }

 
}
