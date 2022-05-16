/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  public locations: { en: Feature[]; de: Feature[] } = {
    en: [
      {
        id: 'address.3891217127569544',
        type: 'Feature',
        place_type: ['address'],
        relevance: 1,
        properties: { accuracy: 'street' },
        text_en: 'South Main Street',
        place_name_en: 'South Main Street, Bradley, Maine 04411, United States',
        text: 'South Main Street',
        place_name: 'South Main Street, Bradley, Maine 04411, United States',
        matching_text: 'United States Highway 2',
        matching_place_name:
          'United States Highway 2, Bradley, Maine 04411, United States',
        center: [-68.6363, 44.90446],
        geometry: { type: 'Point', coordinates: [-68.6363, 44.90446] },
        address: '9',
        context: [
          {
            id: 'postcode.17333122280164830',
            text_en: '04411',
            text: '04411',
          },
          {
            id: 'place.14487361611907800',
            wikidata: 'Q3447431',
            text_en: 'Bradley',
            language_en: 'en',
            text: 'Bradley',
            language: 'en',
          },
          {
            id: 'district.14964439805167960',
            wikidata: 'Q1124743',
            text_en: 'Penobscot County',
            language_en: 'en',
            text: 'Penobscot County',
            language: 'en',
          },
          {
            id: 'region.13595469516240120',
            short_code: 'US-ME',
            wikidata: 'Q724',
            text_en: 'Maine',
            language_en: 'en',
            text: 'Maine',
            language: 'en',
          },
          {
            id: 'country.14135384517372290',
            wikidata: 'Q30',
            short_code: 'us',
            text_en: 'United States',
            language_en: 'en',
            text: 'United States',
            language: 'en',
          },
        ],
      },
      {
        id: 'address.3944401092397190',
        type: 'Feature',
        place_type: ['address'],
        relevance: 1,
        properties: { accuracy: 'street' },
        text_en: 'South Main Street',
        place_name_en:
          'South Main Street, Old Town, Maine 04468, United States',
        text: 'South Main Street',
        place_name: 'South Main Street, Old Town, Maine 04468, United States',
        matching_text: 'United States Highway 2',
        matching_place_name:
          'United States Highway 2, Old Town, Maine 04468, United States',
        center: [-68.64105, 44.92064],
        geometry: { type: 'Point', coordinates: [-68.64105, 44.92064] },
        address: '9',
        context: [
          {
            id: 'neighborhood.2500127500127770',
            text_en: 'Great Works',
            text: 'Great Works',
          },
          {
            id: 'postcode.9148092659216790',
            text_en: '04468',
            text: '04468',
          },
          {
            id: 'place.8743220734289070',
            wikidata: 'Q1642029',
            text_en: 'Old Town',
            language_en: 'en',
            text: 'Old Town',
            language: 'en',
          },
          {
            id: 'district.14964439805167960',
            wikidata: 'Q1124743',
            text_en: 'Penobscot County',
            language_en: 'en',
            text: 'Penobscot County',
            language: 'en',
          },
          {
            id: 'region.13595469516240120',
            short_code: 'US-ME',
            wikidata: 'Q724',
            text_en: 'Maine',
            language_en: 'en',
            text: 'Maine',
            language: 'en',
          },
          {
            id: 'country.14135384517372290',
            wikidata: 'Q30',
            short_code: 'us',
            text_en: 'United States',
            language_en: 'en',
            text: 'United States',
            language: 'en',
          },
        ],
      },
      {
        id: 'address.999515732207634',
        type: 'Feature',
        place_type: ['address'],
        relevance: 1,
        properties: { accuracy: 'street' },
        text_en: 'South Main Street',
        place_name_en:
          'South Main Street, Old Town, Maine 04411, United States',
        text: 'South Main Street',
        place_name: 'South Main Street, Old Town, Maine 04411, United States',
        matching_text: 'United States Highway 2',
        matching_place_name:
          'United States Highway 2, Old Town, Maine 04411, United States',
        center: [-68.64169, 44.90902],
        geometry: { type: 'Point', coordinates: [-68.64169, 44.90902] },
        address: '9',
        context: [
          {
            id: 'neighborhood.2500127500127770',
            text_en: 'Great Works',
            text: 'Great Works',
          },
          { id: 'postcode.999515732207634', text_en: '04411', text: '04411' },
          {
            id: 'place.8743220734289070',
            wikidata: 'Q1642029',
            text_en: 'Old Town',
            language_en: 'en',
            text: 'Old Town',
            language: 'en',
          },
          {
            id: 'district.14964439805167960',
            wikidata: 'Q1124743',
            text_en: 'Penobscot County',
            language_en: 'en',
            text: 'Penobscot County',
            language: 'en',
          },
          {
            id: 'region.13595469516240120',
            short_code: 'US-ME',
            wikidata: 'Q724',
            text_en: 'Maine',
            language_en: 'en',
            text: 'Maine',
            language: 'en',
          },
          {
            id: 'country.14135384517372290',
            wikidata: 'Q30',
            short_code: 'us',
            text_en: 'United States',
            language_en: 'en',
            text: 'United States',
            language: 'en',
          },
        ],
      },
      {
        id: 'address.7146411172146630',
        type: 'Feature',
        place_type: ['address'],
        relevance: 1,
        properties: { accuracy: 'street' },
        text_en: 'Main Road',
        place_name_en: 'Main Road, Milford, Maine 04461, United States',
        text: 'Main Road',
        place_name: 'Main Road, Milford, Maine 04461, United States',
        matching_text: 'United States Highway 2',
        matching_place_name:
          'United States Highway 2, Milford, Maine 04461, United States',
        center: [-68.64367, 44.95158],
        geometry: { type: 'Point', coordinates: [-68.64367, 44.95158] },
        address: '9',
        context: [
          {
            id: 'neighborhood.2500127500127770',
            text_en: 'Great Works',
            text: 'Great Works',
          },
          {
            id: 'postcode.14323114039676280',
            text_en: '04461',
            text: '04461',
          },
          {
            id: 'place.14100263296896900',
            wikidata: 'Q3449362',
            text_en: 'Milford',
            language_en: 'en',
            text: 'Milford',
            language: 'en',
          },
          {
            id: 'district.14964439805167960',
            wikidata: 'Q1124743',
            text_en: 'Penobscot County',
            language_en: 'en',
            text: 'Penobscot County',
            language: 'en',
          },
          {
            id: 'region.13595469516240120',
            short_code: 'US-ME',
            wikidata: 'Q724',
            text_en: 'Maine',
            language_en: 'en',
            text: 'Maine',
            language: 'en',
          },
          {
            id: 'country.14135384517372290',
            wikidata: 'Q30',
            short_code: 'us',
            text_en: 'United States',
            language_en: 'en',
            text: 'United States',
            language: 'en',
          },
        ],
      },
      {
        id: 'address.6725292995178124',
        type: 'Feature',
        place_type: ['address'],
        relevance: 1,
        properties: { accuracy: 'street' },
        text_en: 'Park Street',
        place_name_en: 'Park Street, Orono, Maine 04473, United States',
        text: 'Park Street',
        place_name: 'Park Street, Orono, Maine 04473, United States',
        matching_text: 'United States Highway 2',
        matching_place_name:
          'United States Highway 2, Orono, Maine 04473, United States',
        center: [-68.65929, 44.895015],
        geometry: { type: 'Point', coordinates: [-68.65929, 44.895015] },
        address: '9',
        context: [
          {
            id: 'neighborhood.5345432602792520',
            text_en: 'Webster',
            text: 'Webster',
          },
          {
            id: 'postcode.17251343787559700',
            text_en: '04473',
            text: '04473',
          },
          {
            id: 'place.6913105793767120',
            wikidata: 'Q2736049',
            text_en: 'Orono',
            language_en: 'en',
            text: 'Orono',
            language: 'en',
          },
          {
            id: 'district.14964439805167960',
            wikidata: 'Q1124743',
            text_en: 'Penobscot County',
            language_en: 'en',
            text: 'Penobscot County',
            language: 'en',
          },
          {
            id: 'region.13595469516240120',
            short_code: 'US-ME',
            wikidata: 'Q724',
            text_en: 'Maine',
            language_en: 'en',
            text: 'Maine',
            language: 'en',
          },
          {
            id: 'country.14135384517372290',
            wikidata: 'Q30',
            short_code: 'us',
            text_en: 'United States',
            language_en: 'en',
            text: 'United States',
            language: 'en',
          },
        ],
      },
    ],
    de: [
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
    ],
  };
  constructor() {}

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
