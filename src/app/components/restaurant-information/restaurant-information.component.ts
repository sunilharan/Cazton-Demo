/* eslint-disable max-len */
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-restaurant-information',
  templateUrl: './restaurant-information.component.html',
  styleUrls: ['./restaurant-information.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RestaurantInformationComponent implements OnInit, OnDestroy {
  @Input() restaurant = null;
  public imprintString = '';
  public loading = false;
  private shouldStopSubscription: Subject<any> = new Subject();

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    if (this.restaurant?.id) {
      this.imprintString =
        '<p>Firma: Le&#39;zzet Grill<br /><br />\nInhaber: T&uuml;rkan Ert&uuml;rk<br /><br />\nAdresse: Detmolder Str. 569, 33699 Bielefeld<br /><br />\nTelefon: 0521 93849424<br /><br />\n<br /><br />\nEmail: diclesiyarfirat@gmail.com<br /><br />\nAufsichtsbeh&ouml;rde: Ordnungsamt Bielefeld<br /><br />\nSteuernummmer: folgt</p><br />\n';
    }
  }

  ngOnDestroy() {
    this.shouldStopSubscription.next();
    this.shouldStopSubscription.complete();
    this.shouldStopSubscription.unsubscribe();
  }

  async back() {
    await this.modalController.dismiss(null, 'CLOSE');
  }
}
