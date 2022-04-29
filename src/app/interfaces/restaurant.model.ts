/* eslint-disable @typescript-eslint/naming-convention */
import { Feature } from '../services/mapbox-service.service';
import { Category } from './category.model';
import { CouponResponse } from './response.model';

export interface Platform {
  name: string;
  agblink: string;
  privacylink: string;
  imprintlink: string;
  faqlink: string;
  analytics: string;
}

export interface Restaurant {
  id: number;
  customslug?: string;
  onlypreorder?: boolean;
  fbpixel?: string;
  analyticstag?: string;
  tel?: string;
  enabled?: boolean;
  disabledtext?: string;
  notificationtext?: string;
  minimum?: number;
  location?: {
    latitud?: number;
    longitud?: number;
    zoom?: number;
  };
  distance?: {
    distance: {
      text: string;
      value: number;
    };
    duration: { text: string; value: number };

    status: string;
  };
  name: string;
  street?: string;
  email?: string;
  city: string;
  price_level?: number;
  opentext?: string;
  openNow?: boolean;
  webbanner: string;
  logo: string;
  cart?: {
    shipping?: number;
    minimum?: number;
    freepurchase?: number;
    displayAddress?: string;
  };
  color?: string;
  textcolor?: string;
  deliveryAllowed?: boolean;
  pickupAllowed?: boolean;
  tableAllowed?: boolean;
  fillMinimum?: boolean;
  paymethods?: PaymentMethod;
  stripesandbox?: boolean;
  stripeacc?: string;
  background?: string;
  istest?: boolean;
  preorderdates?: PreOrderDates[];
  categories?: Category[];
  holidays?: string[];

  discount?: CouponResponse;
  accepttip?: boolean;

  customAgb?: string;
  customPrivacy?: string;

  allowcomments?: boolean;
  table_online_payment?: boolean;

  openTimes?: string;
  deliverTimes?: string;
  isPreorder?: boolean;
  tags?: string[];

  featured?: boolean;

  facebook?: string;
  insta?: string;
  aboutus?: string;

  averageRating?: number;
  countRatings?: number;
}

export interface Location {
  latitud?: string;
  longitud?: string;
  zoom?: number;
}

export interface PaymentMethod {
  cash?: boolean;
  paypal?: boolean;
  stripecc?: boolean;
  stripesofort?: boolean;
  ec?: boolean;
}

export interface PreOrderDates {
  date?: string;
  name?: string;
  timeslots?: TimeSlots[];
}

export interface TimeSlots {
  hour?: string;
  minute?: string;
  date?: string;
  time?: string;
  value?: string;
}

export const RestaurantsList = [
  {
    id: 1,
    name: 'pizzafresh',
    src: 'assets/images/home-screen/restaurant/pizzafresh.jpg',
  },
  {
    id: 2,
    name: 'classico',
    src: 'assets/images/home-screen/restaurant/classico.jpg',
  },
  {
    id: 3,
    name: 'pizzahub',
    src: 'assets/images/home-screen/restaurant/pizzahub.jpg',
  },
  {
    id: 4,
    name: 'pepperonicclub',
    src: 'assets/images/home-screen/restaurant/pepperonicclub.jpg',
  },
];

export interface WishlistRestaurant extends Restaurant {
  address: Feature;
}
