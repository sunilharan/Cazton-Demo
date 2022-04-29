// import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '../interfaces/restaurant.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public PLATFORM = 1;
  public platformDetail$: BehaviorSubject<Platform> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
    this.requestPlatform();
  }

  requestPlatform() {
    this.platformDetail$.next(null);
    /*  this.getPlatform(this.PLATFORM).subscribe((resp) => {
      if (resp && resp.success) {
        this.platformDetail$.next(resp.data.platform);
      } else {
        this.platformDetail$.next(null);
      }
    }); */
  }

  getPlatform(id: number | string): Observable<any> {
    const url = `/connect/getPlatform/${id}`;
    return this.http.get(url).pipe(map((res: any) => res));
  }

  getPlatformId(): number {
    return this.PLATFORM;
  }
}
