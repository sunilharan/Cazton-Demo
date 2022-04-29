/* eslint-disable id-blacklist */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { ADDRESS } from '../interfaces/storage-keys.model';
import { LocalStorageService } from './local-storage.service';

export interface AddressModel {
  first_name: string;
  last_name: string;
  address?: string;
  email: string;
  number: string;
}

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private localstorageService: LocalStorageService) {}

  saveAddress(address: AddressModel) {
    return this.localstorageService.setItem(ADDRESS, address);
  }

  getAddress(): AddressModel {
    const address: AddressModel = this.localstorageService.getItem(
      ADDRESS
    ) as any;
    return address;
  }

  removeAdress() {
    return this.localstorageService.remove(ADDRESS);
  }
}
