import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Logos } from './logo-bar.model';

@Component({
  selector: 'app-logo-bar',
  templateUrl: './logo-bar.component.html',
  styleUrls: ['./logo-bar.component.css'],
  imports: [CommonModule],
})
export class LogoBarComponent implements AfterViewInit {
  logos = Logos;

  @ViewChild('track') trackRef!: ElementRef;
  @ViewChild('carousel') carouselRef!: ElementRef;

  ngAfterViewInit() {
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
}
