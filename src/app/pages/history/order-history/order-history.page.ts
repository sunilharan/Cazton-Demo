import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderHistoryModel } from 'src/app/interfaces/order.model';
import { NavigationService } from 'src/app/services/navigation.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.page.html',
  styleUrls: ['./order-history.page.scss'],
})
export class OrderHistoryPage implements OnInit, OnDestroy {
  public orderList: OrderHistoryModel[] = [];
  public loading = false;
  private shouldStopSubscription: Subject<any> = new Subject();

  constructor(
    private navigationService: NavigationService,
    private orderService: OrdersService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.orderService.getOrders().subscribe(
      () => {},
      (e) => console.error(e)
    );
    this.orderService.orderHistory$
      .pipe(takeUntil(this.shouldStopSubscription.asObservable()))
      .subscribe((orders) => {
        this.orderList = orders;
      });

    this.orderService.orderHistoryLoading$
      .pipe(takeUntil(this.shouldStopSubscription.asObservable()))
      .subscribe((loading) => (this.loading = loading));
  }

  ngOnDestroy() {
    this.shouldStopSubscription.next();
    this.shouldStopSubscription.complete();
  }
  showOrderDetail(item) {
    const data = {
      order: item,
    };
    this.navigationService.navigateForwardWithExtras('order-overview', data);
  }

  doRefresh(ev) {
    this.orderService.getOrders(true).subscribe(
      () => {},
      (e) => console.error(e)
    );
    ev.target.disabled = true;
    this.orderService.orderHistoryLoading$
      .pipe(takeUntil(this.shouldStopSubscription))
      .subscribe(
        (showLoading) => {
          this.ngZone.run(() => {
            if (!showLoading) {
              ev.target.complete();
              setTimeout(() => {
                ev.target.disabled = false;
              }, 100);
            }
          });
        },
        () => {}
      );
  }
}
