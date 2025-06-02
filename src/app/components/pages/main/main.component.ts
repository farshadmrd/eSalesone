import { Component,inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../sections/header/header.component";
import { CommonModule } from '@angular/common';
import { TriggerAnimationService } from "../../../services/trigger-animation.service";
import { ScrollToService } from "../../../services/scroll-to.services";
import { ProfilesService, Profile } from "../../../services/profiles.service";


@Component({
  selector: 'app-main',
  imports: [HeaderComponent,CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {    TriggerAnimationService=inject(TriggerAnimationService); //trigger animation of about me
    scrollToService = inject(ScrollToService); // scroll to service
    profilesService = inject(ProfilesService); // profiles service

    lastProfile: Profile | null = null; // single object to store the last profile

    ngOnInit() {
      this.getLastProfile();
    }

    // GET method to fetch the last profile from API
    getLastProfile() {
      this.profilesService.getLastProfile().subscribe({
        next: (data: Profile | null) => {
          this.lastProfile = data;
          console.log('Last profile fetched successfully:', this.lastProfile);
        },
        error: (error) => {
          console.error('Error fetching last profile:', error);
        }
      });
    }

  handleClick = (sectionId: string) => {
    this.scrollToService.scrollTo(sectionId);
    this.TriggerAnimationService.triggerAnimation(); //trigger animation of about me

  };
}

