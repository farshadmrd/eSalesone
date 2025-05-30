import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CursorComponent } from './components/sections/cursor/cursor.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CursorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}

