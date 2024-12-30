import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { MenuService } from '../../services/menu.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, IonicModule, RouterModule, TranslateModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  public currentPage?: { title: string; url: string; icon: string };

  constructor(private router: Router, private menuService: MenuService) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setPageTitle();
    });
    
    this.setPageTitle();
  }

  private setPageTitle() {
    const currentUrl = this.router.url;
    this.currentPage = this.menuService.getPageByUrl(currentUrl);
    if (!this.currentPage) {
      this.currentPage = { title: 'menu.default', url: '', icon: '' };
    }
  }
}
