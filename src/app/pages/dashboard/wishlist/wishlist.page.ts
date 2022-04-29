/* eslint-disable eqeqeq */
import { PlatformService } from './../../../services/platform.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WishlistRestaurant } from 'src/app/interfaces/restaurant.model';
import { CartService } from 'src/app/services/cart.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { LanguageService } from 'src/app/services/language.service';
import { CommonUiService } from 'src/app/services/common-ui.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit, OnDestroy {
  public wishlistItems: WishlistRestaurant[] = [];
  private sholdStopSubscription: Subject<any> = new Subject();
  private cartCount: number;

  constructor(
    private wishlistService: WishlistService,
    private navigationService: NavigationService,
    private cartService: CartService,
    private uiService: CommonUiService,
    private translateConfig: LanguageService,
    private platformService: PlatformService
  ) {}

  ngOnInit() {
    this.wishlistService.wishlistItems$
      .pipe(takeUntil(this.sholdStopSubscription.asObservable()))
      .subscribe(
        (res) => {
          this.wishlistItems = res;
        },
        () => {}
      );
    this.cartService.refreshCart.subscribe(
      (detail) => {
        this.cartCount = detail?.count;
      },
      () => {}
    );
  }

  ngOnDestroy() {
    this.sholdStopSubscription?.next();
    this.sholdStopSubscription?.complete();
    this.sholdStopSubscription?.unsubscribe();
  }

  async openCategoriesPage(id) {
    const restuarntId = this.cartService.getRestaurantId();
    if (restuarntId && this.cartCount > 0) {
      if (id == restuarntId) {
        return this.proceedToCategoryPage(id);
      } else {
        let title = '';
        if (this.platformService.platformDetail$.getValue()) {
          title = this.platformService.platformDetail$.getValue().name;
        }
        const action = await this.uiService.showConfirmationAlert(
          title,
          this.translateConfig.getVal(
            'different-restaurant-cart-validation-error-text'
          )
        );
        if (action?.action == 'CONFIRM') {
          this.cartService.clear();
          this.cartService.removeCustomTips();
          return this.proceedToCategoryPage(id);
        }
        return;
      }
    } else if (restuarntId && restuarntId != id) {
      this.cartService.removePreorderTime();
      return this.proceedToCategoryPage(id);
    } else {
      return this.proceedToCategoryPage(id);
    }
  }

  private proceedToCategoryPage(id: string) {
    this.cartService.setRestaurantId(id);
    this.navigationService.navigateForwardWithExtras('app/category', {
      restaurantId: id,
    });
  }
}
