import { Component,inject  } from '@angular/core';
import { LogoBarComponent } from "../../sections/logo-bar/logo-bar.component";
import { TriggerAnimationService } from "../../../services/trigger-animation.service";

@Component({
  selector: 'app-about-me',
  imports: [LogoBarComponent],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.css'
})
export class AboutMeComponent {
TriggerAnimationService=inject(TriggerAnimationService); //trigger animation of about me

}
