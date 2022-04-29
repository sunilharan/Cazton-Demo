/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartDetail, CartItem } from '../interfaces/cart.model';
import { tipsList, TipsModel } from '../interfaces/response.model';
import {
  CART_ITEMS,
  CART_ITEM_RESTAURANT_ID,
  CUSTOM_TIPS,
  PREORDER_TIME,
  SELECTED_TIP,
} from '../interfaces/storage-keys.model';

/**
 * @export
 * @class CartService
 *
 * This class is used for add, edit and delete cart items and refresh details in every pages.
 *
 * @returns
 *
 * @methods
 * @`add()-{}`
 * @`edit()-{}`
 * @`remove()-{}`
 * @`setRestaurantId()-{}`
 * @`getRestaurantId()-{}`
 *
 *
 * @observables
 * @`cartItems`
 * @`refreshCart`
 */
@Injectable({
  providedIn: 'root',
})
export class CartService {
  public refreshCart: BehaviorSubject<CartDetail> = new BehaviorSubject({
    count: 0,
    price: 0,
  });
  public cartItems: BehaviorSubject<CartItem[]> = new BehaviorSubject([]);

  public notifyPaymentProcess: BehaviorSubject<'success' | 'error'> =
    new BehaviorSubject(null);

  constructor() {
    this.refreshCartItems(this.itemsList);
  }
  /**
   *
   * @param item @type {CartItem}
   *
   * For add new item into cart.
   */
  add(item: CartItem, preorderTime: string) {
    const items: CartItem[] = this.itemsList;
    items.push(item);
    this.itemsList = items;
    this.refreshCartItems(items);
    this.setPreorderTime(preorderTime);

    // this.analyticsService.addToCart(item);
  }
  /**
   *
   * @param item @type {CartItem}
   * Edit cart item and refresh cart details like count in homescreen, and other screens
   */
  edit(item: CartItem) {
    const index = this.itemsList.findIndex((p) => p.id == item?.id);
    const items: CartItem[] = this.itemsList;
    items[index] = item;
    this.itemsList = items;
    this.refreshCartItems(this.itemsList);
  }

  /**
   *
   * @param items @type {CartItem}[]
   *
   * Refresh cart item array evrywher.
   */
  private refreshCartItems(items: CartItem[]) {
    this.cartItems.next(items);
    let total = 0;
    let count = 0;
    items.every((r) => (total += r.price));
    items.every((r) => (count += r.quantity));
    this.refreshCart.next({ count, price: total });
  }

  /**
   *
   * @param item @type {CartItem}
   *
   * Remove cart item and refresh cart details.
   */
  remove(item: CartItem) {
    let items: CartItem[] = this.itemsList;
    items = items.filter((element) => element.id != item.id);
    this.itemsList = items;
    this.refreshCartItems(items);

    // this.analyticsService.removeFromCart(item);
  }

  checkItemIsExistInCartOrNot(dishId: number): number {
    let quantity = 0;
    this.itemsList.map((e) => {
      if (e.dishId == dishId) {
        quantity += e.quantity;
      }
    });
    return quantity;
  }

  clear() {
    this.refreshCartItems([]);
    localStorage.removeItem(CART_ITEMS);
    this.removePreorderTime();
  }

  setRestaurantId(id: string) {
    localStorage.setItem(CART_ITEM_RESTAURANT_ID, id);
  }

  getRestaurantId() {
    return localStorage.getItem(CART_ITEM_RESTAURANT_ID);
  }

  private get itemsList(): CartItem[] {
    const list = JSON.parse(localStorage?.getItem(CART_ITEMS));
    return list?.length ? list : [];
  }

  private set itemsList(list: CartItem[]) {
    localStorage.setItem(CART_ITEMS, JSON.stringify(list));
  }

  public setPreorderTime(preorderString: string) {
    return localStorage.setItem(PREORDER_TIME, preorderString);
  }

  get preOrderTime() {
    const preorderString = localStorage.getItem(PREORDER_TIME);
    return preorderString ? preorderString : null;
  }

  removePreorderTime() {
    return localStorage.removeItem(PREORDER_TIME);
  }

  storeCustomTip(customTip: TipsModel) {
    const customTipArray: TipsModel[] = this.getCustomTipArray();
    const tips = [...tipsList];
    const isAvailable = tips.filter((tip) => tip.amount === customTip.amount);
    const isAvailableCustomTips = customTipArray.filter(
      (tip) => tip.amount === customTip.amount
    );
    console.log(isAvailableCustomTips, isAvailable);

    if (isAvailable?.length <= 0 && isAvailableCustomTips?.length <= 0) {
      customTipArray.push(customTip);
    }
    console.log(customTipArray);

    return localStorage.setItem(CUSTOM_TIPS, JSON.stringify(customTipArray));
  }

  getCustomTipArray(): TipsModel[] {
    let customTipArray = JSON.parse(localStorage.getItem(CUSTOM_TIPS));
    customTipArray = customTipArray?.length ? customTipArray : [];
    return customTipArray as TipsModel[];
  }

  removeCustomTips() {
    return (
      localStorage.removeItem(CUSTOM_TIPS),
      localStorage.removeItem(SELECTED_TIP)
    );
  }

  storeTip(tip: TipsModel) {
    return localStorage.setItem(SELECTED_TIP, JSON.stringify(tip));
  }

  getSelectedTip(): TipsModel {
    return JSON.parse(localStorage.getItem(SELECTED_TIP)) as TipsModel;
  }
}
