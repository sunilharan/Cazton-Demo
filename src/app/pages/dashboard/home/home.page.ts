/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FilterComponent } from 'src/app/components/filter/filter.component';
import { LocationSelectComponent } from 'src/app/components/location-select/location-select.component';
import { Restaurant } from 'src/app/interfaces/restaurant.model';
import { SELECTED_LOCATION_DETAIL } from 'src/app/interfaces/storage-keys.model';
import { User } from 'src/app/interfaces/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { FilterValues } from 'src/app/services/filter.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import {
  Feature,
  MapboxService,
} from 'src/app/services/mapbox-service.service';
import { NavigationService } from 'src/app/services/navigation.service';

import { LanguageService } from 'src/app/services/language.service';
import { CommonUiService } from 'src/app/services/common-ui.service';
import { PlatformService } from 'src/app/services/platform.service';

import {
  animate,
  state,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { CommonDataService } from 'src/app/services/common-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  animations: [
    trigger('fadein', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('800ms linear', style({ opacity: 1 })),
      ]),
    ]),
    trigger('bounce', [transition('* => *', useAnimation(fadeIn))]),
  ],
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild('content') ionContent: IonContent;
  public slideOptions = {
    slidesPerView: 'auto',
    spaceBetween: 20,
  };
  public isRestaurantExist = false;
  public currentAddress = 'Hauptstraße 96, 33602 Biele';
  public userDetail: User;

  public cartCount = 0;
  public isLoading = false;

  public filteredRestaurants: Restaurant[];
  public restaurants: Restaurant[];

  private selectedAddress: Feature = null;
  private unsubscribeSignal: Subject<void> = new Subject();
  private isLocationModalOpen = false;
  public filterResultFound = true;
  public showCartIcon = false;

  constructor(
    private navigationService: NavigationService,
    private modalController: ModalController,
    private mapboxServiceService: MapboxService,
    public authService: AuthService,
    private uiService: CommonUiService,
    private localStorageService: LocalStorageService,
    private cartService: CartService,
    private languageService: LanguageService,
    private platformService: PlatformService,
    private dataService: CommonDataService
  ) {}

  logScrolling(ev) {
    const scrollTop = ev.detail.scrollTop;
    this.showCartIcon = scrollTop > 60;
  }

  ngOnInit() {
    this.mapboxServiceService.openLocationSelectModal
      .pipe(takeUntil(this.unsubscribeSignal.asObservable()))
      .subscribe(async (open) => {
        if (open && !this.isLocationModalOpen) {
          await this.presentModal();
        }
      });

    this.mapboxServiceService.currentAddress$
      .pipe(takeUntil(this.unsubscribeSignal.asObservable()))
      .subscribe((resp) => {
        this.currentAddress = resp?.place_name;
        this.selectedAddress = resp;
      });

    this.cartService.refreshCart.subscribe(
      (detail) => {
        this.cartCount = detail?.count;
      },
      () => {}
    );

    this.languageService.language$
      .pipe(takeUntil(this.unsubscribeSignal.asObservable()))
      .subscribe((lan) => {
        if (lan) {
          this.restaurants = this.dataService.restaurants[lan];
          this.filteredRestaurants = this.restaurants;
          this.isRestaurantExist = true;
        } else {
          this.restaurants = this.dataService.restaurants.en;
          this.filteredRestaurants = this.restaurants;
          this.isRestaurantExist = true;
        }
      });
  }

  ionViewDidEnter() {}

  ngOnDestroy() {
    this.unsubscribeSignal?.next();
    this.unsubscribeSignal?.unsubscribe();
  }

  async openCategoriesPage(id: any, restaurant) {
    const restuarntId = this.cartService.getRestaurantId();
    if (restuarntId && this.cartCount > 0) {
      if (id == restuarntId) {
        return this.proceedToCategoryPage(id, restaurant);
      } else {
        let title = '';
        if (this.platformService.platformDetail$.getValue()) {
          title = this.platformService.platformDetail$.getValue().name;
        }
        const action = await this.uiService.showConfirmationAlert(
          title,
          this.languageService.getVal(
            'different-restaurant-cart-validation-error-text'
          )
        );
        if (action?.action == 'CONFIRM') {
          this.cartService.clear();
          this.cartService.removeCustomTips();
          return this.proceedToCategoryPage(id, restaurant);
        }
        return;
      }
    } else if (restuarntId && restuarntId != id) {
      this.cartService.removePreorderTime();
      return this.proceedToCategoryPage(id, restaurant);
    } else {
      return this.proceedToCategoryPage(id, restaurant);
    }
  }

  private proceedToCategoryPage(id: string, restaurant) {
    this.cartService.setRestaurantId(id);
    this.navigationService.navigateForwardWithExtras('/category', {
      restaurantId: id,
      restaurant,
    });
  }

  openProductsPage() {
    this.navigationService.navigateForward('/products');
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: LocationSelectComponent,
      cssClass: 'custom-model__location-select',
      swipeToClose: true,
    });

    await modal.present().then(() => {
      this.isLocationModalOpen = true;
    });
    const resp = await modal.onDidDismiss();
    this.isLocationModalOpen = false;
    if (resp.role == 'change') {
      this.currentAddress = resp.data.place_name;
      this.selectedAddress = resp.data;
      this.localStorageService.setItem(
        SELECTED_LOCATION_DETAIL,
        this.selectedAddress
      );
    }
  }

  checkOut() {
    this.navigationService.navigateForward('/checkout');
  }

  filterRestaurant() {}

  public cancelSearch() {
    this.filteredRestaurants = this.restaurants;
  }
  public clearSearch() {
    this.filteredRestaurants = this.restaurants;
  }
  public search(ev) {
    let searchTerm: string = ev.detail.value;
    if (searchTerm) {
      searchTerm = searchTerm.toString().toLowerCase();

      this.filteredRestaurants = this.filterList(
        this.restaurants,
        null,
        searchTerm,
        true
      );
      this.filterResultFound = this.filteredRestaurants?.length > 0;
    } else {
      this.filteredRestaurants = this.restaurants;

      this.filterResultFound = this.filteredRestaurants?.length > 0;
    }
  }

  async openFilterPage() {
    const modal = await this.modalController.create({
      component: FilterComponent,
      cssClass: 'custom-model__filter-screen',
      swipeToClose: true,
    });

    await modal.present();

    const detail = await modal.onDidDismiss();

    if (detail?.role == 'FILTER') {
      if (detail?.data) {
        this.applyCustomFilters(detail?.data);
      }
    } else if (detail?.role == 'RESET_FILTER') {
      this.filterRestaurant();
    }
  }

  applyCustomFilters(filterValues: FilterValues) {
    /*  this.filterResultFound = this.filteredRestaurants?.length > 0;
    if (filterValues?.openedNow) {
      this.filteredOpenedRestaurants = this.filterList(
        this.openedRestaurants,
        filterValues
      );
      this.filteredClosedRestaurants = [];
    } else {
      this.filteredClosedRestaurants = this.filterList(
        this.closedRestaurants,
        filterValues
      );
      this.filteredOpenedRestaurants = [];
    }
    if (filterValues?.filterPickupOnly) {
      this.filterAvailablePickupRestaurants = [];
    } else {
      this.filterAvailablePickupRestaurants = this.filterList(
        this.availablePickupRestaurants,
        filterValues
      );
    }

    this.filterResultFound =
      this.filteredClosedRestaurants?.length > 0 ||
      this.filteredOpenedRestaurants?.length > 0 ||
      this.filterAvailablePickupRestaurants?.length > 0; */
  }

  private filterList(
    list: Restaurant[],
    filterValues?: FilterValues,
    searchTerm: string = '',
    fromSearchBar = false
  ): Restaurant[] {
    if (!fromSearchBar) {
      return list.filter((e) => {
        if (
          (filterValues?.minimumOrdrVal === 1 ||
            e?.cart?.minimum <= filterValues?.minimumOrdrVal) &&
          (filterValues?.deliveryCost === 1 ||
            e?.cart?.shipping <= filterValues?.deliveryCost) &&
          (e?.pickupAllowed == filterValues?.filterPickupOnly ||
            e?.deliveryAllowed == filterValues?.filterDeliveryOnly)
        ) {
          if (filterValues?.price_level.length > 0) {
            if (filterValues?.price_level?.includes(e.price_level)) {
              return true;
            } else {
              return false;
            }
          }
          let cuisinFound = false;
          if (filterValues?.cuisins_list.length > 0) {
            filterValues?.cuisins_list?.forEach((cuisin) => {
              if (e.tags?.length > 0 && e.tags?.includes(cuisin)) {
                cuisinFound = true;
              }
            });
            return cuisinFound;
          }
          return true;
        } else {
          return false;
        }
      });
    } else {
      return list.filter((e) => {
        if (
          e.name
            .toString()
            .toLowerCase()
            .indexOf(searchTerm.toString().toLowerCase()) > -1
        ) {
          return true;
        } else {
          return false;
        }

        return false;
      });
    }
  }

  showMap() {
    this.navigationService.navigateForward('mapbox');
  }
}
