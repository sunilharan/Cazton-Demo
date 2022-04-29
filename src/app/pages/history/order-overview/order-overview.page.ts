/* eslint-disable eqeqeq */
import { LanguageService } from './../../../services/language.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderHistoryModel } from 'src/app/interfaces/order.model';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-order-overview',
  templateUrl: './order-overview.page.html',
  styleUrls: ['./order-overview.page.scss'],
})
export class OrderOverviewPage implements OnInit {
  public orderDetails: OrderHistoryModel;
  public subTotal = 0;
  public deliveryCharge = 0;
  public deliveryType = 'Abholung';
  public total = 0;

  constructor(
    private navigationService: NavigationService,
    private router: Router,
    private translateConfig: LanguageService
  ) {
    const extrasState = this.router.getCurrentNavigation().extras.state;
    if (extrasState) {
      this.orderDetails = extrasState?.order;
      if (this.orderDetails?.dishes?.length > 0) {
        this.subTotal = 0;
        this.total = 0;
        this.deliveryCharge = this.orderDetails?.shipping;
        this.orderDetails.dishes.forEach((dish) => {
          this.subTotal += dish.total;
        });

        this.total = this.subTotal + this.deliveryCharge;
      }
    }
    //console.log(this.orderDetails.customer.deliveryType);
    if (this.orderDetails.customer.deliveryType == 'delivery') {
      this.deliveryType = this.translateConfig.getVal('deliver');
    } else if (this.orderDetails.customer.deliveryType == 'table') {
      this.deliveryType = this.translateConfig.getVal('table');
    } else {
      this.deliveryType = this.translateConfig.getVal('pickup');
    }
  }

  ngOnInit() {}

  back() {
    this.navigationService.back(true);
  }
}
