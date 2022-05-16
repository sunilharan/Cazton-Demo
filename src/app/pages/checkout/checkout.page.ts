/* eslint-disable radix */
/* eslint-disable id-blacklist */
/* eslint-disable space-before-function-paren */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */
import { PlatformService } from './../../services/platform.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, PopoverController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartItem } from 'src/app/interfaces/cart.model';
import { CartService } from 'src/app/services/cart.service';
import {
  Feature,
  MapboxService,
} from 'src/app/services/mapbox-service.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { LanguageService } from 'src/app/services/language.service';
import { CommonUiService } from 'src/app/services/common-ui.service';
import { ProductDetailPage } from '../categories/product-detail/product-detail.page';
import { LocationSelectComponent } from '../../components/location-select/location-select.component';
import { Restaurant } from 'src/app/interfaces/restaurant.model';
import { CustomPickerController } from 'src/app/controller/picker/picker.controller';
import {
  CouponResponse,
  tipsList,
  TipsModel,
} from 'src/app/interfaces/response.model';
import { Helper } from 'src/app/services/helper.service';
import { Order } from 'src/app/interfaces/order.model';
import { AddressModel, AddressService } from 'src/app/services/address.service';
import { AddTipComponent } from 'src/app/components/add-tip/add-tip.component';
import { CommonDataService } from 'src/app/services/common-data.service';
import { WishlistService } from 'src/app/services/wishlist.service';

export interface OrderStripeCC {
  type: string;
  total: number;
  currency: string;
  id: number;
  api_key: string;
  sandbox: boolean;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit, OnDestroy {
  public deliveryOption: 'delivery' | 'pickup' = 'delivery';
  public deliveryTime: 'as-soon-as-possible' | 'select-desire-time' =
    'as-soon-as-possible';

  public cartItems: CartItem[] = [];
  public restaurant: Restaurant = null;

  public subTotal = 0;
  public deliveryCharge = 0;

  public shippingCharge = 0;

  public validations: FormGroup;

  public preOrderDate: any;
  public selectedPreOrderDate: any;

  public validatedCouponDetail: CouponResponse;
  public couponError: string = null;

  public paymentType: string = null;

  public tipsList: TipsModel[] = tipsList;

  public cartMinimum: number = null;
  public cartFreepurchase: number = null;
  public createdOrder: any = null;

  public tipAmount = 0;

  public promotions = false;
  public termsCondition = false;
  displaySelectedPreorderDate: string;

  private shouldStopSubscription: Subject<any> = new Subject();
  private isLocationModalOpen = false;
  private lan: 'en' | 'de' = 'en';

  constructor(
    private navigationService: NavigationService,
    private modalController: ModalController,
    private cartService: CartService,
    private uiService: CommonUiService,
    private languageService: LanguageService,
    private formBuilder: FormBuilder,
    private mapboxServiceService: MapboxService,
    private helperService: Helper,
    private addressService: AddressService,
    private popoverController: PopoverController,
    private platformService: PlatformService,
    private commonService: CommonDataService,
    private wishlistService: WishlistService
  ) {
    this.validations = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      address: ['', []],
      email: ['', [Validators.required, Validators.email]],
      phoneno: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^((?:\+)91)?( )?[0-9 +\-\(\)](\ ?\-?\,?\(?\d\)?){3,19}$/
          ),
        ],
      ],
      notes: [''],
    });
  }
  get total(): number {
    let total = 0;
    total += this.subTotal;
    total += this.deliveryCharges();
    total -= this.discountAmount(this.restaurant?.discount);
    total -= this.discountAmount(this.validatedCouponDetail);
    return total;
  }

  get totalWithoutShipping(): number {
    let total = 0;
    total += this.subTotal;
    total -= this.discountAmount(this.restaurant?.discount);
    total -= this.discountAmount(this.validatedCouponDetail);
    return total;
  }

  get finalTotal() {
    const total = this.total;
    if (this.restaurant?.accepttip && this.tipAmount > 0) {
      return total + this.tipAmount;
    }
    return total;
  }

  get validateCartMinimum() {
    if (this.deliveryOption == 'delivery' && this.cartMinimum > this.total) {
      return true;
    }
  }

  get couponDeliveryOptionApplyError(): boolean {
    if (
      this.validatedCouponDetail?.delivery &&
      this.validatedCouponDetail?.pickup &&
      this.restaurant?.discount?.delivery &&
      this.restaurant?.discount?.pickup
    ) {
      return false;
    } else if (
      this.validatedCouponDetail?.delivery &&
      this.restaurant?.discount?.delivery &&
      this.deliveryOption != 'delivery'
    ) {
      return true;
    }
  }

  get couponPickupOptionApplyError(): boolean {
    if (
      this.validatedCouponDetail?.delivery &&
      this.validatedCouponDetail?.pickup &&
      this.restaurant?.discount?.delivery &&
      this.restaurant?.discount?.pickup
    ) {
      return false;
    } else if (
      this.validatedCouponDetail?.pickup &&
      this.restaurant?.discount?.pickup &&
      this.deliveryOption != 'pickup'
    ) {
      return true;
    }
  }

  ngOnInit() {
    this.deliveryOption = 'delivery';
    this.deliveryTime = 'select-desire-time';
    const customTipsArray = this.cartService.getCustomTipArray();
    const selectedTip = this.cartService.getSelectedTip();
    this.tipsList = [...this.tipsList, ...customTipsArray];

    if (selectedTip?.amount > 0) {
      this.tipAmount = selectedTip?.amount;
      this.tipsList.map((e) => {
        if (e.amount == selectedTip.amount) {
          e.selected = true;
        }
      });
    }

    const cartObs = this.cartService.cartItems.pipe(
      takeUntil(this.shouldStopSubscription.asObservable())
    );
    cartObs.subscribe((cartItems) => {
      if (cartItems?.length > 0) {
        this.cartItems = [...cartItems];
        this.subTotal = 0;
        this.cartItems.forEach((cartIt) => {
          this.subTotal += cartIt?.price;
        });
        this.selectedPreOrderDate = this.cartService.preOrderTime;
        if (this.selectedPreOrderDate && this.selectedPreOrderDate != 'null') {
          const dtStr = this.selectedPreOrderDate;
          const date = dtStr.substring(10, 0);
          let time = dtStr.substring(11, 16);
          time = time.replace('-', ':');
          const preorderDate = new Date(date + ' ' + time);
          const currentDate = new Date();
          if (currentDate.getTime() > preorderDate.getTime()) {
            this.selectedPreOrderDate = '';
            this.cartService.removePreorderTime();
          } else {
            this.deliveryTime = 'select-desire-time';
          }
        }
      } else {
        this.cartItems = [];
        this.subTotal = 0;
      }
    });

    this.languageService.language$
      .pipe(takeUntil(this.shouldStopSubscription.asObservable()))
      .subscribe((lan: any) => {
        if (lan) {
          this.lan = lan;
        }
        const restaurantId = parseInt(this.cartService.getRestaurantId());
        this.restaurant = this.commonService.restaurants[this.lan].filter(
          (res) => res.id == restaurantId
        )[0];
        this.checkRestaurantExistInWishlistAndOutOfDeliveryArea(
          this.restaurant?.id
        );
      });

    this.mapboxServiceService.currentAddress$
      .pipe(takeUntil(this.shouldStopSubscription.asObservable()))
      .subscribe((resp) => {
        console.log('currentAddress -- ', resp);

        if (resp) {
          this.validations.patchValue({
            address: resp?.place_name,
          });
        }
      });
  }

  updateDelivery(cart: any) {
    if (cart) {
      if (cart?.shipping) {
        this.shippingCharge = cart?.shipping;
      }
      if (cart?.displayAddress) {
        this.validations.patchValue({
          address: cart?.displayAddress,
        });
      }
      if (cart?.minimum) {
        this.cartMinimum = cart?.minimum;
      }
      if (cart?.freepurchase) {
        this.cartFreepurchase = cart?.freepurchase;
      }

      this.restaurant.cart = cart;
    }
  }

  async openLocationSelectBox() {
    if (!this.isLocationModalOpen) {
      const modal = await this.modalController.create({
        component: LocationSelectComponent,
        cssClass: 'custom-model__location-select',
        swipeToClose: true,
        componentProps: {
          fromPage: 'checkout',
        },
      });

      await modal.present().then(() => {
        this.isLocationModalOpen = true;
      });

      const resp = await modal.onDidDismiss();
      this.isLocationModalOpen = false;
      if (resp.role == 'change') {
        const selectedAddress = resp?.data as Feature;

        if (selectedAddress) {
          this.validations.patchValue({
            address: selectedAddress.place_name,
          });
        }
      }
    }
  }

  checkRestaurantExistInWishlistAndOutOfDeliveryArea(id) {
    const wishlist = this.wishlistService.wishlistItems$.getValue();
    const isFavorite = wishlist.some((el) => el.id == id);
    if (isFavorite) {
      const restaurants = this.commonService.restaurants[this.lan];
      const found = restaurants?.some((el) => el.id == id);
      if (!found) {
        const wishListElement = wishlist.filter((e) => e.id == id)[0];
        if (wishListElement?.id && wishListElement?.address?.place_name) {
          this.validations.patchValue({
            address: wishListElement?.address?.place_name,
          });
        }
      }
    }
  }

  ngOnDestroy() {
    this.shouldStopSubscription.next();
    this.shouldStopSubscription.complete();
  }

  back() {
    /* Save address */
    const address: AddressModel = {
      first_name: this.validations.value.firstname,
      last_name: this.validations.value.lastname,
      address: this.validations.value.address,
      email: this.validations.value.email,
      // eslint-disable-next-line id-blacklist
      number: this.validations.value.phoneno,
    };
    this.addressService.saveAddress(address);
    this.navigationService.back(true);
  }

  onPaymentMethodChange(ev) {
    this.paymentType = ev;
  }

  async editOrderItem(cartItem: CartItem) {
    const modal = await this.modalController.create({
      component: ProductDetailPage,
      componentProps: {
        dishId: cartItem.dishId,
        mode: 'EDIT',
        cartItem,
        restaurantId: this.restaurant?.id,
        preSelectOrderDate: this.selectedPreOrderDate,
      },
      cssClass: 'custom-model__product-detail',
      swipeToClose: true,
    });

    await modal.present();
  }

  addCoupon() {
    this.navigationService.navigateForwardWithExtras('app/add-coupon', {
      pre_order_date: this.selectedPreOrderDate,
    });
  }

  async removeItemFromCart(item: CartItem) {
    const action = await this.uiService.showConfirmationAlert(
      this.languageService.getVal('checkout'),
      this.languageService.getVal('cart-item-remove-confirmation')
    );
    if (action?.action == 'CONFIRM') {
      this.cartService.remove(item);
      this.uiService.showToast(
        this.languageService.getVal('item-removed-from-cart'),
        'success'
      );
    }
  }

  async selectPreOrderDate() {
    const array: string[][] = [];
    array[0] = [];
    this.commonService.preorderdates.forEach((preorder) => {
      array[0].push(preorder.name);
    });

    if (array[0].length > 0) {
      await this.presentPicker(array, 'pre_order_date', false);
    }
  }

  async presentPicker(
    pickerOptions: any[],
    keyname: string,
    isCustomValues: boolean,
    multicolumn = false
  ) {
    const picker = new CustomPickerController({
      keyname,
      optionsLength: isCustomValues
        ? pickerOptions.length
        : pickerOptions[0].length,
      pickerOptionsList: pickerOptions,
      dismissTitle: await this.languageService.getVal('cancel'),
      dismissHandler: () => {},
      actionTitle: await this.languageService.getVal('done'),
      multiColumn: multicolumn,
      isCustomValues,
      cssClass: 'custom-picker',
      actionHandler: async (val) => {
        if (val && val[keyname]) {
          if (keyname == 'pre_order_date') {
            this.preOrderDate = null;
            this.preOrderDate = val[keyname].value;
            const preOrderSlot = this.commonService.preorderdates.find((e) =>
              e.name == this.preOrderDate ? e : false
            );
            const timeArray = [];
            preOrderSlot.timeslots
              .map((item) => {
                timeArray.push({
                  text: item.time,
                  value: item.value,
                  date: item.date,
                });
                return item.value;
              })
              .filter((value, index, self) => self.indexOf(value) === index);
            await this.presentPicker(timeArray, 'duration', true);
          }
        }
        if (val) {
          if (keyname == 'duration') {
            if (val && val[keyname]) {
              this.preOrderDate = val[keyname].value;
              this.selectedPreOrderDate = val[keyname].value;
              const selectedDate = pickerOptions.filter(
                (ele) => ele.value == val[keyname].value
              )[0];
              this.displaySelectedPreorderDate =
                selectedDate?.date + ' ' + selectedDate?.text + ' Uhr';
            }
          }
        }
      },
    });
    return picker.show();
  }

  public validateMinimumValue(coupon: CouponResponse): boolean {
    if (this.deliveryOption == 'pickup') {
      return false;
    }
    if (coupon?.minimum > this.subTotal) {
      return true;
    } else {
      return false;
    }
  }

  public discountAmount(coupon: CouponResponse): number {
    if (!coupon) {
      return 0;
    }
    if (this.validateMinimumValue(coupon)) {
      return 0;
    }
    let discount = 0;
    if (!coupon?.restricttodishes) {
      discount = this.calculateDiscountBasedOnCouponType(this.subTotal, coupon);
    } else if (coupon?.restricttodishes) {
      discount = this.discountPerDish(coupon);
    }
    if (this.deliveryOption == 'delivery' && coupon?.delivery) {
      return discount;
    }
    if (this.deliveryOption == 'pickup' && coupon?.pickup) {
      return discount;
    }

    return 0;
  }

  public discountPerDish(coupon: CouponResponse): number {
    let discount = 0;
    if (!coupon) {
      return discount;
    }
    if (coupon?.dishes?.length > 0) {
      const dishes_arraay = this.cartItems.filter((cart) =>
        coupon?.dishes.includes(cart.dishId)
      );
      dishes_arraay.forEach((dish) => {
        let initialDiscount = this.calculateDiscountBasedOnCouponType(
          dish.price,
          coupon
        );
        if (coupon.type == 'absolute') {
          initialDiscount = initialDiscount * dish.quantity;
        }
        discount += initialDiscount;
      });
      return discount;
    } else {
      return discount;
    }
  }

  public deliveryCharges(): number {
    if (
      this.validatedCouponDetail?.freedelivery ||
      this.restaurant?.discount?.freedelivery
    ) {
      return 0;
    }
    let deliveryCharge = 0;
    if (this.cartItems?.length > 0) {
      if (this.deliveryOption == 'delivery') {
        if (this.totalWithoutShipping > this.cartFreepurchase) {
          deliveryCharge = 0;
        } else {
          deliveryCharge = this.shippingCharge;
        }
      } else {
        deliveryCharge = 0;
      }
    } else {
      deliveryCharge = 0;
    }

    return deliveryCharge;
  }

  async place_order() {
    const dishes = [];
    this.cartItems.forEach((item) => {
      const extras = [];
      item.extras?.forEach((e) => {
        if (e?.id) {
          extras.push(e.id);
        }
      });
      dishes.push({
        id: item.dishId,
        comment: item.comment,
        count: item.quantity,
        variant: item.variant?.index,
        extras,
      });
    });

    const orderObject: Order = {
      business: this.restaurant?.id,
      payment: this.paymentType,
      coupon: this.validatedCouponDetail?.coupon,
      total: this.finalTotal,
      os: this.helperService.getPlatformType(),
      shipping: this.shippingCharge,
      dishes,
      deliverytype: this.deliveryOption,
      preordertime: this.selectedPreOrderDate,
      name: this.validations.value.firstname,
      lastname: this.validations.value.lastname,
      email: this.validations.value.email,
      telephone: this.validations.value.phoneno,
      comment: this.validations.value.notes,
      address: this.validations.value.address,
      platform: this.platformService.getPlatformId(),
      newsletter: this.promotions,
    };

    if (this.restaurant?.accepttip && this.tipAmount > 0) {
      orderObject.tip = this.tipAmount;
    }

    const address: AddressModel = {
      first_name: this.validations.value.firstname,
      last_name: this.validations.value.lastname,
      address: this.validations.value.address,
      email: this.validations.value.email,
      number: this.validations.value.phoneno,
    };
    this.addressService.saveAddress(address);
  }

  changeDeliveryOption() {
    if (this.deliveryOption == 'delivery') {
      this.validations.get('address').setValidators([Validators.required]);
      if (!this.validations.value.address) {
        this.validations.get('address').setErrors({ required: true });
      }
      this.validations.updateValueAndValidity();
    } else {
      this.validations.get('address').clearValidators();
      this.validations.get('address').setErrors(null);
      this.validations.updateValueAndValidity();
    }

    this.validations.updateValueAndValidity();
  }

  terms_condition_privacy_policy(page) {
    const data = {
      businessId: this.restaurant?.id,
    };

    this.navigationService.navigateForwardWithExtras('/app/' + page, data);
  }

  selectTipValue(tip: TipsModel, deselectAll: boolean = false) {
    if (deselectAll) {
      return this.tipsList.map((item) => (item.selected = false));
    }
    this.tipsList.map((item) => {
      if (item.amount == tip.amount) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
    if (tip.selected) {
      this.tipAmount = tip.amount;
    } else {
      this.tipAmount = 0;
    }

    this.cartService.storeTip(tip);
  }

  async customAddTipAlert() {
    const popover = await this.popoverController.create({
      component: AddTipComponent,
      cssClass: 'custom-popover__add-tip',
      showBackdrop: true,
    });

    await popover.present();

    const data = await popover.onDidDismiss();

    if (data?.role == 'ADD') {
      let tipAmount = data?.data;
      if (tipAmount) {
        tipAmount = tipAmount.toString().replace('.', '.');
        console.log(tipAmount);

        this.tipAmount = tipAmount * 100;
        console.log(tipAmount);

        const tip = {
          amount: this.tipAmount,
          selected: false,
        };
        this.cartService.storeCustomTip(tip);
        tip.selected = true;
        console.log(this.cartService.getCustomTipArray());
        const isAvailable = this.tipsList.filter(
          (tipEle) => tipEle.amount === tip.amount
        );
        if (isAvailable?.length <= 0) {
          const uniqueTips = this.tipsList.filter(
            (c, index) => this.tipsList.indexOf(c) === index
          );

          uniqueTips.push(tip);

          this.tipsList = uniqueTips;
        }
        this.selectTipValue(tip);
      }
    }
  }

  private calculateDiscountBasedOnCouponType(
    baseAmount: number,
    coupon: CouponResponse
  ) {
    let discountCriteria =
      coupon?.type == 'absolute'
        ? coupon?.absolutevalue
        : coupon?.relativevalue;

    if (coupon?.type == 'absolute') {
      if (discountCriteria > baseAmount) {
        discountCriteria = baseAmount;
      }
    }

    if (coupon?.type == 'relative') {
      discountCriteria = baseAmount * discountCriteria;
    }
    return discountCriteria;
  }
}
