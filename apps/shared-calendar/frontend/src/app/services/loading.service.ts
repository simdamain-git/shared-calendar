import { Injectable } from '@angular/core';
import { IonLoading } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingModal: IonLoading | null = null;

  constructor() {}

  public connect(loadingModal: IonLoading) {
    this.loadingModal = loadingModal;
  }

  public show() {
    this.loadingModal?.present();
  }

  public hide() {
    this.loadingModal?.dismiss();
  }
}
