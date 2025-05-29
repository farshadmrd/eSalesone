import { Component } from '@angular/core';
import { HeaderComponent } from "../../sections/header/header.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-main',
  imports: [HeaderComponent,CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  scrollTo = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
}

