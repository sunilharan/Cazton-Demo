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

  async openCategoriesPage(restuarant) {
    const restuarntId = this.cartService.getRestaurantId();
    if (restuarntId && this.cartCount > 0) {
      if (restuarant?.id == restuarntId) {
        return this.proceedToCategoryPage(restuarant);
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
          return this.proceedToCategoryPage(restuarant);
        }
        return;
      }
    } else if (restuarntId && restuarntId != restuarant) {
      this.cartService.removePreorderTime();
      return this.proceedToCategoryPage(restuarant);
    } else {
      return this.proceedToCategoryPage(restuarant);
    }
  }

  private proceedToCategoryPage(restaurant) {
    this.cartService.setRestaurantId(restaurant);
    this.navigationService.navigateForwardWithExtras('/category', {
      restaurantId: restaurant?.id,
      restaurant,
    });
  }
}
