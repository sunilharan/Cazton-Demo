/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { LanguageService } from './language.service';

export interface MapboxOutput {
  attribution: string;
  features: Feature[];
  query: [];
}

export interface Feature {
  place_name: string;
  center?: [number, number]; // [longitude, latitude]
  id: string;
  type?: string;
  place_type?: string[];
  relevance?: number;
  text_en?: string;
  place_name_en?: string;
  matching_text?: string;
  matching_place_name?: string;
  properties?: {
    accuracy?: string;
  };
  address?: string;
  text?: string;
  geometry?: {
    type?: string;
    coordinates?: number[];
    interpolated?: boolean;
    omitted?: boolean;
  };
  context?: {
    id?: string;
    wikidata?: string;
    short_code?: string;
    text?: string;
    text_en?: string;
    language_en?: string;
    language?: string;
  }[];
}

/**
 *
 * @export
 * @class MapboxServiceService
 *
 * @plugin https://ionicframework.com/docs/native/open-native-settings ||  https://github.com/guyromb/Cordova-open-native-settings
 * @plugin https://ionicframework.com/docs/native/diagnostic ||  https://github.com/dpa99c/cordova-diagnostic-plugin
 * @plugin https://capacitorjs.com/docs/apis/geolocation
 *
 * Used for enable disable location permission and getting location data and setting location.
 * Used for getting user's current location.
 * And reverse geo location coding for getting user location details.
 *
 */
@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  public currentLocationCoordinates: LocationCoordinates;
  public currentAddress$: BehaviorSubject<Feature> = new BehaviorSubject(null);
  public openLocationSelectModal: BehaviorSubject<boolean | Feature> =
    new BehaviorSubject(false);
  public locations: Feature[] = [
    {
      id: 'address.2717988979214312',
      type: 'Feature',
      place_type: ['address'],
      relevance: 1,
      properties: { accuracy: 'rooftop' },
      text_en: 'Gehrenberg',
      place_name_en: 'Gehrenberg 9, 33813 Oerlinghausen, Germany',
      text: 'Gehrenberg',
      place_name: 'Gehrenberg 9, 33813 Oerlinghausen, Germany',
      center: [8.657674, 51.960188],
      geometry: { type: 'Point', coordinates: [8.657674, 51.960188] },
      address: '9',
      context: [
        { id: 'postcode.3796898488438360', text_en: '33813', text: '33813' },
        {
          id: 'place.3796898488299210',
          wikidata: 'Q242757',
          text_en: 'Oerlinghausen',
          language_en: 'en',
          text: 'Oerlinghausen',
          language: 'en',
        },
        {
          id: 'region.8359054768122700',
          short_code: 'DE-NW',
          wikidata: 'Q1198',
          text_en: 'North Rhine-Westphalia',
          language_en: 'en',
          text: 'North Rhine-Westphalia',
          language: 'en',
        },
        {
          id: 'country.10814856728480410',
          wikidata: 'Q183',
          short_code: 'de',
          text_en: 'Germany',
          language_en: 'en',
          text: 'Germany',
          language: 'en',
        },
      ],
    },
    {
      id: 'address.8160264368018864',
      type: 'Feature',
      place_type: ['address'],
      relevance: 1,
      properties: { accuracy: 'rooftop' },
      text_en: 'Gehrenberg',
      place_name_en: 'Gehrenberg 9, 33602 Bielefeld, Germany',
      text: 'Gehrenberg',
      place_name: 'Gehrenberg 9, 33602 Bielefeld, Germany',
      center: [8.532706, 52.01984],
      geometry: { type: 'Point', coordinates: [8.532706, 52.01984] },
      address: '9',
      context: [
        { id: 'postcode.7558345106288050', text_en: '33602', text: '33602' },
        { id: 'locality.9548853304524990', text_en: 'Mitte', text: 'Mitte' },
        {
          id: 'place.14151830318808870',
          wikidata: 'Q2112',
          text_en: 'Bielefeld',
          language_en: 'en',
          text: 'Bielefeld',
          language: 'en',
        },
        {
          id: 'region.8359054768122700',
          short_code: 'DE-NW',
          wikidata: 'Q1198',
          text_en: 'North Rhine-Westphalia',
          language_en: 'en',
          text: 'North Rhine-Westphalia',
          language: 'en',
        },
        {
          id: 'country.10814856728480410',
          wikidata: 'Q183',
          short_code: 'de',
          text_en: 'Germany',
          language_en: 'en',
          text: 'Germany',
          language: 'en',
        },
      ],
    },
    {
      id: 'address.8883235779977930',
      type: 'Feature',
      place_type: ['address'],
      relevance: 0.849296,
      properties: { accuracy: 'rooftop' },
      text_en: 'Rhönstraße',
      place_name_en: 'Rhönstraße 9, 36115 Ehrenberg, Germany',
      text: 'Rhönstraße',
      place_name: 'Rhönstraße 9, 36115 Ehrenberg, Germany',
      matching_text: 'L 3395',
      matching_place_name: 'L 3395 9, 36115 Ehrenberg, Germany',
      center: [10.004617, 50.501674],
      geometry: { type: 'Point', coordinates: [10.004617, 50.501674] },
      address: '9',
      context: [
        { id: 'postcode.15566168439343790', text_en: '36115', text: '36115' },
        {
          id: 'locality.9802777571684030',
          wikidata: 'Q14491885',
          text_en: 'Wüstensachsen',
          language_en: 'en',
          text: 'Wüstensachsen',
          language: 'en',
        },
        {
          id: 'place.8380311704652590',
          wikidata: 'Q622560',
          text_en: 'Ehrenberg',
          language_en: 'en',
          text: 'Ehrenberg',
          language: 'en',
        },
        {
          id: 'region.9751500397883010',
          short_code: 'DE-HE',
          wikidata: 'Q1199',
          text_en: 'Hesse',
          language_en: 'en',
          text: 'Hesse',
          language: 'en',
        },
        {
          id: 'country.10814856728480410',
          wikidata: 'Q183',
          short_code: 'de',
          text_en: 'Germany',
          language_en: 'en',
          text: 'Germany',
          language: 'en',
        },
      ],
    },
    {
      id: 'address.4405520292621912',
      type: 'Feature',
      place_type: ['address'],
      relevance: 0.849296,
      properties: { accuracy: 'interpolated' },
      text_en: 'Oberelsbacher Straße',
      place_name_en: 'Oberelsbacher Straße 9, 36115 Ehrenberg, Germany',
      text: 'Oberelsbacher Straße',
      place_name: 'Oberelsbacher Straße 9, 36115 Ehrenberg, Germany',
      matching_text: 'L 3395',
      matching_place_name: 'L 3395 9, 36115 Ehrenberg, Germany',
      center: [10.004413, 50.499023],
      geometry: {
        type: 'Point',
        coordinates: [10.004413, 50.499023],
        interpolated: true,
        omitted: true,
      },
      address: '9',
      context: [
        { id: 'postcode.15566168439343790', text_en: '36115', text: '36115' },
        {
          id: 'locality.9802777571684030',
          wikidata: 'Q14491885',
          text_en: 'Wüstensachsen',
          language_en: 'en',
          text: 'Wüstensachsen',
          language: 'en',
        },
        {
          id: 'place.8380311704652590',
          wikidata: 'Q622560',
          text_en: 'Ehrenberg',
          language_en: 'en',
          text: 'Ehrenberg',
          language: 'en',
        },
        {
          id: 'region.9751500397883010',
          short_code: 'DE-HE',
          wikidata: 'Q1199',
          text_en: 'Hesse',
          language_en: 'en',
          text: 'Hesse',
          language: 'en',
        },
        {
          id: 'country.10814856728480410',
          wikidata: 'Q183',
          short_code: 'de',
          text_en: 'Germany',
          language_en: 'en',
          text: 'Germany',
          language: 'en',
        },
      ],
    },
    {
      id: 'address.1857571634961590',
      type: 'Feature',
      place_type: ['address'],
      relevance: 0.646981,
      properties: { accuracy: 'interpolated' },
      text_en: 'Kreuzbergstraße',
      place_name_en: 'Kreuzbergstraße 9, 36115 Hilders, Germany',
      text: 'Kreuzbergstraße',
      place_name: 'Kreuzbergstraße 9, 36115 Hilders, Germany',
      matching_text: 'L 3379',
      matching_place_name: 'L 3379 9, 36115 Hilders, Germany',
      center: [9.949581, 50.567109],
      geometry: {
        type: 'Point',
        coordinates: [9.949581, 50.567109],
        interpolated: true,
      },
      address: '9',
      context: [
        { id: 'postcode.15566168439343790', text_en: '36115', text: '36115' },
        {
          id: 'locality.8938832329671710',
          wikidata: 'Q1364757',
          text_en: 'Liebhards',
          language_en: 'fr',
          text: 'Liebhards',
          language: 'fr',
        },
        {
          id: 'place.15566123830994080',
          wikidata: 'Q636117',
          text_en: 'Hilders',
          language_en: 'en',
          text: 'Hilders',
          language: 'en',
        },
        {
          id: 'region.9751500397883010',
          short_code: 'DE-HE',
          wikidata: 'Q1199',
          text_en: 'Hesse',
          language_en: 'en',
          text: 'Hesse',
          language: 'en',
        },
        {
          id: 'country.10814856728480410',
          wikidata: 'Q183',
          short_code: 'de',
          text_en: 'Germany',
          language_en: 'en',
          text: 'Germany',
          language: 'en',
        },
      ],
    },
  ];
  constructor(
    private http: HttpClient,
    private platform: Platform,
    // private diagnostic: Diagnostic,
    private alertCtrl: AlertController,
    // private locationPermissionService: LocationPermissionService,
    // private openNativeSettings: OpenNativeSettings,
    // private restaurantService: RestaurantService,
    private translateConfigService: LanguageService // private localStorageService: LocalStorageService
  ) {}

  async init() {}
}

export class LocationCoordinates {
  latitude: number;
  longitude: number;
  address: string;
  isDefault: boolean;
  constructor(
    latitude: number,
    longitude: number,
    address: string,
    isDefault: boolean
  ) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.address = address;
    this.isDefault = isDefault;
  }
}
