import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
@Component({
  selector: 'app-page-main',
  templateUrl: './page-main.component.html',
  styleUrls: ['./page-main.component.scss'],
  standalone: true,
  imports: [
    IonicModule, IonApp, IonRouterOutlet
  ],
})
export class PageMainComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
