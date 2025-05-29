import { Component,inject } from '@angular/core';
import { HeaderComponent } from "../../sections/header/header.component";
import { CommonModule } from '@angular/common';
import { TriggerAnimationService } from "../../../services/trigger-animation.service";


@Component({
  selector: 'app-main',
  imports: [HeaderComponent,CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

    TriggerAnimationService=inject(TriggerAnimationService); //trigger animation of about me


  scrollTo = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  handleClick = (sectionId: string) => {
    this.scrollTo(sectionId);
    this.TriggerAnimationService.triggerAnimation(); //trigger animation of about me

  };
}

