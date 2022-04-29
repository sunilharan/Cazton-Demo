/* eslint-disable eqeqeq */
import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import {
  Feature,
  MapboxService,
} from 'src/app/services/mapbox-service.service';
import { CommonUiService } from 'src/app/services/common-ui.service';

@Component({
  selector: 'app-location-select',
  templateUrl: './location-select.component.html',
  styleUrls: ['./location-select.component.scss'],
})
export class LocationSelectComponent implements OnInit {
  @Input() fromPage: 'home' | 'checkout' = 'home';
  placeList: Feature[] = [];
  selectedAddress: Feature = null;
  isLoading = false;

  constructor(
    private modalController: ModalController,
    private mapboxService: MapboxService,
    private alertController: AlertController,
    private translate: TranslateService,
    private uiService: CommonUiService
  ) {}

  ngOnInit() {}

  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.placeList = this.mapboxService.locations;
    } else {
    }
  }

  onSelect(place) {
    this.selectedAddress = place;
    if (place.address) {
      if (this.fromPage == 'home') {
        this.mapboxService.currentAddress$.next(this.selectedAddress);
      }
      this.modalController.dismiss(this.selectedAddress, 'change');
    } else {
      this.alertForAddress(place);
    }
    // this.modalController.dismiss(this.selectedAddress,"change");
    // this.addresses = [];
  }

  async alertForAddress(place) {
    const alert = await this.alertController.create({
      header: await this.translate.instant('house-no-title'),
      subHeader: await this.translate.instant('house-no-sub-title'),
      inputs: [
        {
          type: 'text',
          name: 'houseno',
          placeholder: await this.translate.instant('enter-house-no'),
        },
      ],
      buttons: [
        {
          text: await this.translate.instant('cancel'),
          role: 'cancel',
        },
        {
          text: await this.translate.instant('add'),
          role: 'ok',
        },
      ],
    });

    await alert.present();
    const resp = await alert.onDidDismiss();
    if (resp && resp.role == 'ok') {
      const houseno = resp.data.values.houseno
        ? resp.data.values.houseno + ', '
        : '';
      if (!houseno) {
        return this.uiService.showToast(
          await this.translate.instant('house-number-mandatory'),
          'danger'
        );
      }

      this.selectedAddress.address = resp.data.values.houseno;
      this.selectedAddress.place_name =
        this.selectedAddress?.place_name.replace(',', ` ${houseno}`);
      // houseno + this.selectedAddress?.place_name;
      this.mapboxService.currentAddress$.next(this.selectedAddress);
      this.modalController.dismiss(this.selectedAddress, 'change');
    }
  }

  async close() {
    await this.modalController.dismiss();
  }
}
