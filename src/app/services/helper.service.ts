/* eslint-disable eqeqeq */
/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class Helper {
  constructor(private platform: Platform) {}

  getPlatformType(): string {
    if (this.platform.is('android')) {
      return 'android';
    } else if (this.platform.is('ios')) {
      return 'ios';
    } else {
      return 'web';
    }
  }
}

export function uuid() {
  // eslint-disable-next-line space-before-function-paren
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function checkElementIsExistOrnot(array1, array2): boolean {
  array1 = array1.sort();
  array2 = array2.sort();
  // Loop for array1
  for (let i = 0; i < array1.length; i++) {
    // Loop for array2
    for (let j = 0; j < array2.length; j++) {
      /* Compare the element of each and
       every element from both of the
       arrays */
      if (array1[i] === array2[j]) {
        // Return if common element found
        return true;
      }
    }
  }
  // Return if no common element exist
  return false;
}

/* export function dateString(dateString: string) {
  if (!dateString) return;

  const secondLastIndex = dateString.lastIndexOf(
    "-",
    dateString.lastIndexOf("-") - 1
  );
  dateString = replaceAt(secondLastIndex, " ", dateString);
  dateString = dateString.replace(/\-/g, ".");
  dateString = replaceAt(dateString.lastIndexOf("."), ":", dateString);

  return dateString + " Uhr";
}

const replaceAt = function (
  index: number,
  replacement: string,
  dateStr: string
) {
  return (
    dateStr.substr(0, index) +
    replacement +
    dateStr.substr(index + replacement.length)
  );
}; */
// const replaceAt = function(index, replacement) {
//   return this.substr(0, index) + replacement + this.substr(index + replacement.length);
// }
