import { Component,inject, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoBarComponent } from "../../sections/logo-bar/logo-bar.component";
import { TriggerAnimationService } from "../../../services/trigger-animation.service";
import { ScrollToService } from "../../../services/scroll-to.services";
import { ProfilesService, Profile } from "../../../services/profiles.service";

@Component({
  selector: 'app-about-me',
  imports: [LogoBarComponent, CommonModule],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.css'
})
export class AboutMeComponent implements OnInit {
TriggerAnimationService=inject(TriggerAnimationService); //trigger animation of about me
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
      console.log('Last profile fetched in about-me:', this.lastProfile);
    },
    error: (error) => {
      console.error('Error fetching last profile in about-me:', error);
    }
  });
}

  handleServicesClick(sectionId: string){
    this.scrollToService.scrollTo(sectionId);
  }
}
