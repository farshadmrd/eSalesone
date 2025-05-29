import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollToService {

  scrollTo(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

}
