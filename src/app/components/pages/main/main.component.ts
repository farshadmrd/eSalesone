import { Component,inject } from '@angular/core';
import { HeaderComponent } from "../../sections/header/header.component";
import { CommonModule } from '@angular/common';
import { TriggerAnimationService } from "../../../services/trigger-animation.service";
import { ScrollToService } from "../../../services/scroll-to.services";


@Component({
  selector: 'app-main',
  imports: [HeaderComponent,CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

    TriggerAnimationService=inject(TriggerAnimationService); //trigger animation of about me
    scrollToService = inject(ScrollToService); // scroll to service

  handleClick = (sectionId: string) => {
    this.scrollToService.scrollTo(sectionId);
    this.TriggerAnimationService.triggerAnimation(); //trigger animation of about me

  };
}

