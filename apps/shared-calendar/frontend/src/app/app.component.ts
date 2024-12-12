import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconLoader } from './utils/icon-loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor() {
    IconLoader.load();
  }
}
