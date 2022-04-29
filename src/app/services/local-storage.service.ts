import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  constructor() {}

  setItem(keyname: string, value: string | object) {
    if (typeof value == "object") {
      localStorage.setItem(keyname, JSON.stringify(value));
    } else {
      localStorage.setItem(keyname, value);
    }
  }

  getItem(keyname: string): object | string | null {
    let data = localStorage.getItem(keyname);
    data = data ? JSON.parse(data) : null;
    return data;
  }

  get(key: string) {
    return localStorage.getItem(key);
  }

  remove(key: string) {
    return localStorage.removeItem(key);
  }
}
