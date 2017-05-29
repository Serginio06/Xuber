import {Injectable} from '@angular/core';
// import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
// import {Observable} from 'rxjs/Observable'
import {Observable} from 'rxjs/Rx'
import {SimulateProvider} from "./simulate";
import 'rxjs/add/operator/map';


@Injectable()
export class CarProvider {

  // public simulate: SimulateProvider;

  // constructor(public http: Http ) {
  constructor(public simulateProvider: SimulateProvider) {
    // this.simulate = simulateProvider;
  }

  pollForRiderPickup() {

    return this.simulateProvider.riderPickedup();
  }

  pollForRiderDropoff(){

    return this.simulateProvider.riderDroppedOff();
  }

  getPickupCar() {

    return this.simulateProvider.getPickupCar();
  }

  getCars(lat, lng) {
    // console.log("getCars");

    return Observable
      .interval(5000)
      .switchMap(() => this.simulate.getCars(lat, lng))
      .share()
  }

  findPickupCar(pickupLocation) {

    return this.simulateProvider.findPickupCar(pickupLocation);

    // return Observable.create(
    //   observer => {
    //     observer.next(pickupLocation);
    //   })

  }

}
