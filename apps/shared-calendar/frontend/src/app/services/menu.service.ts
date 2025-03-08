import { Injectable } from '@angular/core';

interface Page {
  title: string;
  url: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  public appPages: Page[] = [
    { title: 'menu.calendar', url: '/agenda/calendar', icon: 'calendar' },
    { title: 'menu.notes', url: '/notes', icon: 'clipboard' },
    // { title: 'menu.rappel', url: '/rappel', icon: 'alarm' },
    // { title: 'menu.courses', url: '/courses', icon: 'cart' }
  ];

  public settingsPages: Page[] = [
    { title: 'menu.group', url: '/group', icon: 'people' }
  ];

  constructor() {}

  getPageByUrl(url: string): Page | undefined {
    return this.appPages.find(page => url.includes(page.url)) || this.settingsPages.find(page => url.includes(page.url));
  }
}
