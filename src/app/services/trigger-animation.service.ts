import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TriggerAnimationService {

  animate = false;

  triggerAnimation() {
  if(this.animate) return; // Prevent triggering animation if already animating
  this.animate = !this.animate;
  }

}
