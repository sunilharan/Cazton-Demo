import { Injectable } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { LanguageService } from './language.service';

interface ConfirmationAction {
  action: 'CONFIRM' | 'CANCEL';
}
@Injectable({
  providedIn: 'root',
})
export class CommonUiService {
  private loading: HTMLIonLoadingElement;

  constructor(
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private languageService: LanguageService,
    private alertController: AlertController
  ) {}

  public async presentLoading(message?: string) {
    message = message ? this.languageService.getVal(message) : '';
    this.loading = await this.loadingCtrl.create({
      message,
      spinner: 'dots',
      keyboardClose: true,
      cssClass: 'custom-loader',
      mode: 'ios',
    });
    return await this.loading.present();
  }

  public async dismissLoading() {
    if (this.loading) {
      return await this.loading.dismiss();
    }
  }
  public async showToast(message: string, color = 'success') {
    message = this.languageService.getVal(message);
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top',
      mode: 'ios',
    });
    toast.present();
  }
  async showConfirmationAlert(title, message): Promise<ConfirmationAction> {
    return new Promise(async (resolve, reject) => {
      try {
        const alert = await this.alertController.create({
          header: title,
          message,
          cssClass: 'remove-from-cart',
          buttons: [
            {
              text: this.languageService.getVal('okay'),
              handler: async () => {
                await alert.dismiss();
                resolve({ action: 'CONFIRM' });
              },
            },
            {
              text: this.languageService.getVal('cancel'),
              role: 'cancel',
              handler: async () => {
                await alert.dismiss();
                resolve({ action: 'CANCEL' });
              },
            },
          ],
          backdropDismiss: false,
        });
        await alert.present();
      } catch (e) {
        reject(e);
      }
    });
  }

  fixEncoding(text: string): string {
    let outT = text?.split('&quot;')?.join('"');
    // eslint-disable-next-line @typescript-eslint/quotes
    outT = outT?.split('&#039;')?.join("'");
    outT = outT?.split('&amp;')?.join('&');
    return outT;
  }
}
