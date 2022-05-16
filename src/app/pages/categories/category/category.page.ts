/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, ModalController, Platform } from '@ionic/angular';
import { Category, Dishes } from 'src/app/interfaces/category.model';
import {
  Restaurant,
  WishlistRestaurant,
} from 'src/app/interfaces/restaurant.model';
import { NavigationService } from 'src/app/services/navigation.service';
import { CommonUiService } from 'src/app/services/common-ui.service';
import { ProductDetailPage } from '../product-detail/product-detail.page';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LanguageService } from 'src/app/services/language.service';
import { CartService } from 'src/app/services/cart.service';
import { CartDetail } from 'src/app/interfaces/cart.model';
import { RestaurantInformationComponent } from 'src/app/components/restaurant-information/restaurant-information.component';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { WishlistService } from 'src/app/services/wishlist.service';
import { Keyboard } from '@capacitor/keyboard';
import { CommonDataService } from 'src/app/services/common-data.service';
@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        style({ opacity: 1, transform: 'translateY(100%)' }),
        animate(300),
      ]),
      transition('* => void', [
        animate(300, style({ opacity: 1, transform: 'translateY(100%)' })),
      ]),
    ]),
  ],
})
export class CategoryPage implements OnInit, OnDestroy {
  @ViewChild('content') content: IonContent;
  public categories: Category[];
  public filteredCategories: Category[];
  public restuarant: Restaurant;
  public isClosed: boolean;
  public preOrderDate: any;
  public isBusinessOpen = false;
  private shouldStopSubscriptions: Subject<any> = new Subject();
  public isLoading = false;
  public selectedPreOrderDate: string = null;
  public displaySelectedPreorderDate: string = null;
  public cartDetail: CartDetail = null;
  public isAnimate = false;
  public notFound = false;
  public showSearchBar = false;
  public deliveryTime: 'as-soon-as-possible' | 'select-desire-time' =
    'as-soon-as-possible';
  public stickyHeader = false;
  @ViewChild('headerImg') headerImg: any;
  @ViewChild('headerImg') contentHeader: any;
  public showChipToolbar = false;
  constructor(
    private navigationService: NavigationService,
    private modalController: ModalController,
    public uiService: CommonUiService,
    private router: Router,
    private languageService: LanguageService,
    private ngZone: NgZone,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private commonDataService: CommonDataService,
    private platform: Platform
  ) {
    if (this.platform.is('capacitor')) {
      Keyboard.setScroll({ isDisabled: true }).then((data) => {
        console.log('disable keyboard scroll ....');
      });
    }
  }
  logScrolling(ev) {
    this.headerImg.nativeElement.style.height =
      'calc(env(safe-area-inset-top) + ' + (350 - ev.detail.scrollTop) + 'px)';
    this.headerImg.nativeElement.style.opacity = 1 - ev.detail.scrollTop / 200;
    if (1 - ev.detail.scrollTop / 200 < 0) {
      this.showChipToolbar = true;
    } else {
      this.showChipToolbar = false;
    }
  }
  ngOnInit() {
    if (this.router.getCurrentNavigation().extras?.state) {
      const restaurantId =
        this.router.getCurrentNavigation().extras?.state?.restaurantId;
      this.restuarant =
        this.router.getCurrentNavigation().extras?.state?.restaurant;
      this.selectedPreOrderDate = this.cartService.preOrderTime;
      this.selectedPreOrderDate =
        this.selectedPreOrderDate && this.selectedPreOrderDate != 'null'
          ? this.selectedPreOrderDate
          : '';
      if (restaurantId) {
        this.languageService.language$
          .pipe(takeUntil(this.shouldStopSubscriptions.asObservable()))
          .subscribe((lan) => {
            if (lan) {
              this.categories = this.commonDataService.categories[lan];
              this.filteredCategories = this.categories;
            } else {
              this.categories = this.commonDataService.categories.en;
              this.filteredCategories = this.categories;
            }
          });
      }
    }

    this.cartService.refreshCart
      .pipe(takeUntil(this.shouldStopSubscriptions))
      .subscribe((details) => {
        if (details) {
          this.cartDetail = details;
        }
      });
  }

  ngOnDestroy() {
    this.shouldStopSubscriptions?.next();
    this.shouldStopSubscriptions?.complete();
  }

  onContentScroll(ev) {
    if (ev && ev.detail) {
      if (ev.detail.scrollTop > 200) {
        this.stickyHeader = true;
      } else {
        this.stickyHeader = false;
      }
    }
  }

  ionViewDidEnter() {}

  back() {
    this.navigationService.back(true);
  }

  scrollToElement(id) {
    const yOffset = document.getElementById('id' + id).offsetTop;
    this.content.scrollToPoint(0, yOffset, 1000);
    const element = document.getElementById('item-chip' + id);
    this.categories.forEach((category) => {
      if (category.id != id) {
        document
          .getElementById('item-chip' + category.id)
          ?.classList.remove('active');
      }
    });
    element?.classList.add('active');
  }

  subscribeInterSection() {
    this.categories.forEach((e) => {
      const options = {
        threshold: 0,
        rootMargin: '-50% 0% -50% 0%',
      };
      const observer = new IntersectionObserver(this.handler, options);
      observer.observe(document.getElementById('id' + e.id));
    });
  }

  handler(entries, observer) {
    const added = false;
    for (const entry of entries) {
      const { chipElement, chipHeader, id } = getElements(entry);
      if (entry.isIntersecting && !added) {
        chipElement?.classList.add('active');
        chipHeader?.scrollTo(chipElement.offsetLeft - 55, 0);
      } else {
        chipElement?.classList.remove('active');
      }
    }
    function getElements(entry: any) {
      let id = entry.target.getAttribute('id');
      id = id.replace('id', '');
      const chipElement = document.getElementById('item-chip' + id);

      const chipHeader = document.getElementById('chip-scroll');
      return { chipElement, chipHeader, id };
    }
  }

  checkOut() {
    if (this.cartService.cartItems.getValue()?.length > 0) {
      this.navigationService.navigateForward('/checkout');
    }
  }
  /*
  scrollContent(event) {
    let scrollDistane = event.detail.scrollTop;
    let chipScroll = document.getElementById("chip-scroll");
    if (this.categories) {
      this.categories.forEach((data) => {
        let top = document.getElementById("id" + data.id)?.offsetTop;
        if (top <= scrollDistane + 200) {
          chipScroll.scrollLeft =
            document.getElementById("item-chip" + data.id)?.offsetLeft - 35;
        }
      });
    }
  }
 */
  async openDetails(dish: Dishes, category) {
    const modal = await this.modalController.create({
      component: ProductDetailPage,
      componentProps: {
        dishId: dish.id,
        preSelectOrderDate: this.selectedPreOrderDate,
        restaurantId: this.restuarant?.id,
        dish,
      },
      cssClass: 'custom-model__product-detail',
      swipeToClose: true,
    });

    await modal.present();

    const resp = await modal.onDidDismiss();
    if (resp.role == 'ADD_TO_CART') {
      this.isAnimate = true;
      setTimeout(() => {
        this.isAnimate = false;
      }, 1100);
    }
  }

  async closedRestaurant(disabledText: string) {
    // await this.uiService.showToastMsg(disabledText, 5000);
  }

  search(ev) {
    let searchTerm = ev.detail.value;
    if (searchTerm) {
      searchTerm = searchTerm.toString().toLowerCase();
      this.filteredCategories = this.categories.filter((category) => {
        const dishExists = category.dishes.filter((e) => {
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
        });
        if (
          category.name
            .toString()
            .toLowerCase()
            .indexOf(searchTerm.toString().toLowerCase()) > -1
        ) {
          return true;
        } else if (dishExists?.length > 0) {
          category.dishes = dishExists;
          return true;
        }
        return false;
      });
    } else {
      this.categories.map((e) => {
        e.dishes = e.allDishes;
      });
      this.filteredCategories = this.categories;
    }
  }

  clearSearch() {
    this.filteredCategories = this.categories;
  }

  cancelSearch() {
    this.showSearchBar = false;
    this.filteredCategories = this.categories;
  }

  get isCartItemAvailable() {
    return this.cartService.cartItems.getValue()?.length > 0;
  }

  public async openRestaurantInformation(restaurant: Restaurant) {
    const modal = await this.modalController.create({
      component: RestaurantInformationComponent,
      componentProps: { restaurant },
      cssClass: 'custom-model__restaurant-info',
      swipeToClose: true,
    });

    await modal.present();
  }

  get isItemWishListed() {
    return this.wishlistService.check_wishlisted_or_not(this.restuarant?.id);
  }

  addToWishlist() {
    this.wishlistService.add(this.restuarant as WishlistRestaurant);
    setTimeout(() => {
      this.uiService.showToast(
        this.languageService.getVal('item-added-from-wishlist'),
        'success'
      );
    }, 200);
  }

  async removeFromWishlist() {
    const action = await this.uiService.showConfirmationAlert(
      this.languageService.getVal('wishlist'),
      this.languageService.getVal('wishlist-item-remove-confirmation')
    );
    if (action?.action == 'CONFIRM') {
      this.wishlistService.remove(this.restuarant as WishlistRestaurant);
      setTimeout(() => {
        this.uiService.showToast(
          this.languageService.getVal('item-removed-from-wishlist'),
          'success'
        );
      }, 200);
    }
  }
}
