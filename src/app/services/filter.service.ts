/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { FILTER_VALUES } from '../interfaces/storage-keys.model';
import { LocalStorageService } from './local-storage.service';

export interface FilterValues {
  minimumOrdrVal: number;
  deliveryCost: number;
  price_level: number[];
  cuisins_list: string[];
  filterPickupOnly: boolean;
  filterDeliveryOnly: boolean;
  openedNow: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor(private localStorageService: LocalStorageService) {}

  store(filterValues: FilterValues) {
    return this.localStorageService.setItem(FILTER_VALUES, filterValues);
  }

  get(): FilterValues {
    return this.localStorageService.getItem(FILTER_VALUES) as FilterValues;
  }
}
