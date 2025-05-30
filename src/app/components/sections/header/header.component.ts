import { Component,input,inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  route = inject(ActivatedRoute);
  
  handleClick(){
    // Check if we're on home page for scrolling, otherwise navigate
    if (this.router.url === '/home' || this.router.url === '/') {
      this.scrollToService.scrollTo('page2');
      this.TriggerAnimationService.triggerAnimation(); //trigger animation of about me
    } else {
      // Navigate to home and then scroll after navigation completes
      this.router.navigate(['/home']).then(() => {
        // Use setTimeout to ensure the DOM is updated after navigation
        setTimeout(() => {
          this.scrollToService.scrollTo('page2');
          this.TriggerAnimationService.triggerAnimation();
        }, 100);
      });
    }
  }

  handleServicesClick(sectionId: string){
    // Navigate to services or checkout pages
    if (sectionId === 'page3') {
      if (this.router.url === '/home' || this.router.url === '/') {
        this.scrollToService.scrollTo(sectionId);
      } else {
        // Navigate to home and then scroll after navigation completes
        this.router.navigate(['/home']).then(() => {
          setTimeout(() => {
            this.scrollToService.scrollTo(sectionId);
          }, 100);
        });
      }
    } else if (sectionId === 'checkout') {
      this.router.navigate(['/checkout']);
    }
  }

 
}
