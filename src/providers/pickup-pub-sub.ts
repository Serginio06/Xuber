import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";


@Injectable()
export class PickupPubSubProvider {

  public pickup$: Observable<any>;
  private _observer: Observer<any>;

  public EVENTS = {
    PICKUP: 'pickup',
    DROPOFF: 'dropoff',
    ARRIVAL_TIME: 'arrival-time'
  };

  constructor(public http: Http) {
    // console.log('Hello PickupPubSub Provider');
    this.pickup$ = new Observable(observer => {
      this._observer = observer;
    })
      .share(); // allow multiple subscriber to subscribe it
  }


  watch() {
    return this.pickup$;
  }


  emitArrivalTime(time) {
    this._observer.next({
      event: this.EVENTS.ARRIVAL_TIME,
      data: time
    })
  }

  emitPickup() {
    this._observer.next({
      event: this.EVENTS.PICKUP,
      data: null
    })
  }

  emitDropOff() {
    this._observer.next({
      event: this.EVENTS.DROPOFF,
      data: null
    })
  }

}
