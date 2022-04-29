/* eslint-disable eqeqeq */
import { PlatformService } from './platform.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order, OrderHistoryModel } from '../interfaces/order.model';
import { ApiResponse } from '../interfaces/response.model';
import { CommonDataService } from './common-data.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  public orderHistory$: BehaviorSubject<OrderHistoryModel[]> =
    new BehaviorSubject([]);
  public orderHistoryLoading$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  constructor(
    private http: HttpClient,
    private platformService: PlatformService,
    private commonDataService: CommonDataService
  ) {
    this.orderHistory$.next(this.commonDataService.orders);
  }

  placeOrder(orderObject: Order) {
    //console.log(orderObject);
    const formData = new FormData();
    formData.append('business', orderObject.business.toString());

    formData.append('name', orderObject.name);
    formData.append('lastname', orderObject.lastname);
    formData.append('email', orderObject.email);
    formData.append('telephone', orderObject.telephone);

    formData.append('os', orderObject.os);

    formData.append('dishes', JSON.stringify(orderObject.dishes));
    formData.append('total', orderObject.total.toString());

    formData.append('deliverytype', orderObject.deliverytype);
    formData.append('payment', orderObject.payment);

    formData.append('comment', orderObject.comment);

    formData.append('platform', orderObject.platform.toString());
    formData.append('newsletter', orderObject.newsletter.toString());

    if (orderObject.tip) {
      formData.append('tip', orderObject.tip.toString());
    }

    if (orderObject?.coupon) {
      formData.append('coupon', orderObject.coupon);
    }

    if (orderObject?.preordertime) {
      formData.append('preordertime', orderObject.preordertime);
    }

    if (orderObject.deliverytype == 'delivery') {
      formData.append('shipping', orderObject.shipping.toString());
      formData.append('address', orderObject.address);
    }

    return this.http
      .post<ApiResponse>(`/connect/sendOrder`, formData)
      .toPromise();
  }

  getOrders(forceRefresh: boolean = false): Observable<OrderHistoryModel[]> {
    this.orderHistoryLoading$.next(true);
    //console.log(this.orderHistory$.getValue().length > 0);
    if (forceRefresh) {
      return this.refreshOrderHistory();
    }
    if (this.orderHistory$.getValue().length <= 0) {
      return this.refreshOrderHistory();
    } else {
      this.orderHistoryLoading$.next(false);
      return this.orderHistory$;
    }
  }

  getOrderSummary(orderId: string | number) {
    return this.http.get<ApiResponse>(`/connect/getOrderStatus/${orderId}`);
  }

  chargeCC(orderId: number, stripeToken: string) {
    //console.log("charge cc "+orderId);
    const formData = new FormData();

    formData.append('order', orderId.toString());
    formData.append('token', stripeToken);

    return this.http
      .post<ApiResponse>(`/connect/chargeCC`, formData)
      .toPromise();
  }
  private refreshOrderHistory(): Observable<OrderHistoryModel[]> {
    return this.http
      .get<ApiResponse>(
        `/connect/getOrders/` + this.platformService.getPlatformId()
      )
      .pipe(
        map((res) => {
          if (res?.success) {
            this.orderHistory$.next(res?.data?.orders || []);
          } else {
            this.orderHistory$.next([]);
          }
          this.orderHistoryLoading$.next(false);
          return res?.data?.orders;
        })
      );
  }
}
