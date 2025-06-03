import { AfterViewInit, Component, ElementRef, ViewChild, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilesService } from '../../../services/profiles.service';

interface Logo {
  url: string;
  alt?: string;
}

@Component({
  selector: 'app-logo-bar',
  templateUrl: './logo-bar.component.html',
  styleUrls: ['./logo-bar.component.css'],
  imports: [CommonModule],
})
export class LogoBarComponent implements OnInit, AfterViewInit {
  logos: Logo[] = [];
  private profilesService = inject(ProfilesService);

  @ViewChild('track') trackRef!: ElementRef;
  @ViewChild('carousel') carouselRef!: ElementRef;

  ngOnInit() {
    this.loadLogoBarImages();
  }
  ngAfterViewInit() {
    // If logos are already loaded, initialize carousel
    if (this.logos.length > 0) {
      this.initializeCarousel();
    }
  }

  private initializeCarousel() {
    if (!this.trackRef || !this.carouselRef) return;
    
    const track = this.trackRef.nativeElement;
    const carouselWidth = this.carouselRef.nativeElement.offsetWidth;

    let totalWidth = track.scrollWidth;

    // Clone logos until they fill more than twice the container width
    while (totalWidth < carouselWidth * 2) {
      const clone = track.cloneNode(true);
      track.append(...Array.from(clone.children));
      totalWidth = track.scrollWidth;
    }
  }
  private loadLogoBarImages() {
    this.profilesService.getLogoBarImages().subscribe({
      next: (imageUrls: string[]) => {
        this.logos = imageUrls.map((url, index) => ({
          url: url,
          alt: `logo${index + 1}`
        }));
        // Initialize carousel after logos are loaded
        setTimeout(() => this.initializeCarousel(), 0);
      },
      error: (error) => {
        console.error('Error loading logo bar images:', error);
        // Fallback to empty array or default logos if needed
        this.logos = [];
      }
    });
  }
}
