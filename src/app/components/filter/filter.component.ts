/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable eqeqeq */
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { FilterService, FilterValues } from 'src/app/services/filter.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  public selectedPriceTags: number[] = [];
  public minimumOrderAmount = 500;
  public deliveryCost = 0;
  public cuisinsList = [
    'Italienisch',
    'Asiatisch',
    'Türkisch',
    'Pizza',
    'Pasta',
    'Burger',
    'Sushi',
    'Sandwiches',
    'Französisch',
  ];
  public selectedCuisinsList: string[] = [];
  public filterDeliveryOnly = false;
  public filterPickupOnly = false;
  public openedNow = true;

  constructor(
    private modalController: ModalController,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    const filterOptions = this.filterService.get();

    if (filterOptions) {
      this.selectedPriceTags =
        filterOptions?.price_level?.length > 0
          ? filterOptions?.price_level
          : [];

      this.minimumOrderAmount = filterOptions?.minimumOrdrVal
        ? filterOptions?.minimumOrdrVal
        : 500;

      this.minimumOrderAmount =
        this.minimumOrderAmount == 1 ? 2000 : this.minimumOrderAmount;

      this.deliveryCost = filterOptions?.deliveryCost
        ? filterOptions?.deliveryCost
        : 0;
      this.deliveryCost = this.deliveryCost == 1 ? 400 : this.deliveryCost;

      this.selectedCuisinsList =
        filterOptions?.cuisins_list?.length > 0
          ? filterOptions?.cuisins_list
          : [];

      this.filterDeliveryOnly = filterOptions?.filterDeliveryOnly;
      this.filterPickupOnly = filterOptions?.filterPickupOnly;
      this.openedNow = filterOptions?.openedNow;
    } else {
      this.deliveryCost = 400;
      this.minimumOrderAmount = 2000;
      this.filterDeliveryOnly = false;
      this.filterPickupOnly = false;
      this.openedNow = true;
    }
  }

  checkPriceSelected(tag: number) {
    return this.selectedPriceTags.includes(tag);
  }

  addRemovePriceTag(tag: number) {
    if (this.checkPriceSelected(tag)) {
      this.selectedPriceTags = this.selectedPriceTags.filter((e) => e != tag);
    } else {
      this.selectedPriceTags.push(tag);
    }
  }

  async close() {
    await this.modalController.dismiss(null, 'CLOSE');
  }

  async applyFilter() {
    let filterValues: FilterValues = {
      minimumOrdrVal:
        this.minimumOrderAmount == 2000 ? 1 : this.minimumOrderAmount,
      deliveryCost: this.deliveryCost == 400 ? 1 : this.deliveryCost,
      price_level: this.selectedPriceTags,
      cuisins_list: this.selectedCuisinsList,
      filterDeliveryOnly: this.filterDeliveryOnly,
      filterPickupOnly: this.filterPickupOnly,
      openedNow: this.openedNow,
    };
    if (
      this.selectedPriceTags?.length <= 0 &&
      this.minimumOrderAmount == 2000 &&
      this.deliveryCost == 400 &&
      this.selectedCuisinsList?.length <= 0 &&
      !this.filterDeliveryOnly &&
      !this.filterPickupOnly &&
      !this.openedNow
    ) {
      this.filterService.store(null);
      return await this.modalController.dismiss(false, 'RESET_FILTER');
    } else {
      this.filterService.store(filterValues);
      if (
        filterValues.filterPickupOnly == false &&
        filterValues.filterDeliveryOnly == false
      ) {
        filterValues = {
          ...filterValues,
          filterDeliveryOnly: true,
          filterPickupOnly: true,
        };
      }
      return await this.modalController.dismiss(filterValues, 'FILTER');
    }
  }

  checkCuisinSelected(cuisin: string) {
    return this.selectedCuisinsList.includes(cuisin);
  }

  onChkChange(ev) {
    if (ev?.detail?.checked) {
      this.selectedCuisinsList.push(ev?.detail?.value);
    } else {
      this.selectedCuisinsList = this.selectedCuisinsList.filter(
        (e) => e != ev?.detail?.value
      );
    }
  }

  resetFilter() {
    this.selectedPriceTags = [];
    this.deliveryCost = 400;
    this.minimumOrderAmount = 2000;
    this.selectedCuisinsList = [];
    this.filterDeliveryOnly = false;
    this.filterPickupOnly = false;
    this.filterService.store(null);
    this.openedNow = true;
  }
}
