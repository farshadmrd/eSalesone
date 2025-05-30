import { Component,input,inject } from '@angular/core';
import { Router } from '@angular/router';
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
  router = inject(Router);
  
  handleClick(){
    // Check if we're on home page for scrolling, otherwise navigate
    if (this.router.url === '/home') {
      this.scrollToService.scrollTo('page2');
      this.TriggerAnimationService.triggerAnimation(); //trigger animation of about me
    } else {
      this.router.navigate(['/home'], { fragment: 'page2' });
    }
  }

  handleServicesClick(sectionId: string){
    // Navigate to services or checkout pages
    if (sectionId === 'page3') {
      if (this.router.url === '/home') {
        this.scrollToService.scrollTo(sectionId);
      } else {
        this.router.navigate(['/home'], { fragment: 'page3' });
      }
    } else if (sectionId === 'checkout') {
      this.router.navigate(['/checkout']);
    }
  }

 
}
