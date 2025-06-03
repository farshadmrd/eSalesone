import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CursorComponent } from './components/sections/cursor/cursor.component';
import { MiniBasketComponent } from './components/sections/mini-basket/mini-basket.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CursorComponent, MiniBasketComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}

