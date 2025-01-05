import {
  ActivatedRoute,
  Params,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonMenu,
  IonMenuToggle,
  IonRouterLink,
  IonRouterOutlet,
  IonSplitPane,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, NgZone, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { IconLoader } from './utils/icon-loader';
import { LoadingService } from './services/loading.service';
import { RouterModule } from '@angular/router';
import { MenuService } from './services/menu.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    IonLoading,
    RouterModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    IonRouterOutlet,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {

  @ViewChild('loading') loading?: IonLoading;
  constructor(
    public menuService: MenuService,
    private translateSrv: TranslateService,
    private loadingService: LoadingService,
    private router: Router,
    private zone: NgZone,
    private activatedRoute: ActivatedRoute
  ) {
    this.translateSrv.addLangs(['fr', 'en']);
    this.translateSrv.use('fr');
    this.initAppListener();
    IconLoader.load();
  }
  initAppListener() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        const url = new URL(event.url);
        const slug = event.url.split('.app').pop();
        const queryParams: Params = {};
        url.searchParams.forEach((value, key) => {
          queryParams[key] = value;
        });
        if (slug) {
          this.router.navigate(['/login'], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge',
          });
        }
      });
    });
  }

  ngAfterViewInit(): void {
    if (this.loading) {
      this.loadingService.connect(this.loading);
    }
  }

  async logout() {
    sessionStorage.clear();
    setTimeout(() => {
      document.location.href = '/login';
    }, 1000);
  }
}
