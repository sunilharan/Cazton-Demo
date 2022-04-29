/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Restaurant, WishlistRestaurant } from '../interfaces/restaurant.model';
import { WISH_LIST } from '../interfaces/storage-keys.model';
import { MapboxService } from './mapbox-service.service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  public wishlistItems$: BehaviorSubject<WishlistRestaurant[]> =
    new BehaviorSubject([]);

  constructor(private mapBoxService: MapboxService) {
    this.refresh(this.itemsList);
  }

  private get itemsList(): WishlistRestaurant[] {
    const list = JSON.parse(localStorage?.getItem(WISH_LIST));
    return list?.length ? list : [];
  }

  private set itemsList(list: WishlistRestaurant[]) {
    localStorage.setItem(WISH_LIST, JSON.stringify(list));
  }
  /**
   *
   * @param item @type {WishlistRestaurant}
   *
   * For add new item into wishlist.
   */
  add(item: WishlistRestaurant) {
    const business: WishlistRestaurant = {
      ...item,
      address: this.mapBoxService.currentAddress$.getValue(),
    };

    const items: WishlistRestaurant[] = this.itemsList;
    items.push(business);
    this.itemsList = items;
    this.refresh(items);
  }

  /**
   *
   * @param item @type {WishlistRestaurant}
   *
   * Remove restaurant and refresh wishlist details.
   */
  remove(item: WishlistRestaurant) {
    let items: WishlistRestaurant[] = this.itemsList;
    items = items.filter((element) => element.id != item.id);
    this.itemsList = items;
    this.refresh(items);
  }

  check_wishlisted_or_not(restaurantId: number): boolean {
    return this.itemsList.filter((e) => e.id == restaurantId)?.length > 0;
  }

  clear() {
    this.refresh([]);
    localStorage.removeItem(WISH_LIST);
  }

  /**
   *
   * @param items @type {WishlistRestaurant}[]
   *
   * Refresh wishlist items array everywhere.
   */
  private refresh(items: WishlistRestaurant[]) {
    this.wishlistItems$.next(items);
  }
}
