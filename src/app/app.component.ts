import { Component, ElementRef, ViewChild } from '@angular/core';
import { MainComponent } from "./components/pages/main/main.component";
import { AboutMeComponent } from "./components/pages/about-me/about-me.component";
import { CursorComponent } from './components/sections/cursor/cursor.component';
import { MyServicesComponent } from "./components/pages/my-services/my-services.component";

@Component({
  selector: 'app-root',
  imports: [MainComponent, AboutMeComponent, CursorComponent, MyServicesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}

