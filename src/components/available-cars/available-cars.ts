import {Component, Input, OnInit} from '@angular/core';
import {CarProvider} from '../../providers/car';

import * as SlidingMarker from 'marker-animate-unobtrusive';


declare var google;

@Component({
  selector: 'available-cars',
  templateUrl: 'available-cars.html'
})
export class AvailableCarsComponent implements OnInit {

  @Input() isPickupRequested: boolean;
  @Input() map: any;

  public carMarkers: Array<any>;
  // text: string;

  constructor(public carProvider: CarProvider) {
    console.log('Hello AvailableCars Component');
    // this.text = 'Hello World';
    this.carMarkers = [];
  }

  ngOnInit() {
    this.fetchAndRefreshCars();
  }

  ngOnChanges() {
    if (this.isPickupRequested) {
      this.removeCarMarkers();
    }

  }

  removeCarMarkers(){
    for (var i = 0, numOfCars = this.carMarkers.length; i < numOfCars; i++) {
    this.carMarkers[i].setMap(null);

    }

    this.carMarkers = [];
}

  addCarMarker(car) {
    // console.log(car);
    let carMarkerPosition = new google.maps.LatLng(car.coords.lat, car.coords.lng);
    // console.log(carMarkerPosition);

    // icon path for ionic serve '../../assets/img/car2.png'
    // let carMarker = new google.maps.Marker({
    let carMarker = new SlidingMarker({
      map: this.map,
      position: carMarkerPosition,
      icon: 'www/../assets/img/car2.png'
    });


    carMarker.setDuration(5000);
    carMarker.setEasing('linear');

    // carMarker.setDuration(2000);
    // carMarker.setEasing('linear');

    carMarker.set('id', car.id); //MVCObject()
    // console.log("carMarker after set", carMarker);
    // console.log("addCarMarker");
    this.carMarkers.push(carMarker);

  }

  updateCarMarker(car) {
    // console.log("updateCarMarker");
    for (var i = 0, numOfCars = this.carMarkers.length; i < numOfCars; i++) {
      // find car and update it
      // console.log("(<any>this.carMarkers[i]).id === (<any>car).id", (<any>this.carMarkers[i]).id === (<any>car).id);
      // console.log("this.carMarkers[i].id === car.id", this.carMarkers[i].id === car.id);
      if (this.carMarkers[i].id === car.id) {
        // if ((<any>this.carMarkers[i]).id === (<any>car).id) {
        // console.log("in IF statement");
        this.carMarkers[i].setPosition(new google.maps.LatLng(car.coords.lat, car.coords.lng));
        return;
      }

    }
    // car does not exist in carMarkers
    this.addCarMarker(car);
  }

  fetchAndRefreshCars() {
    console.log("fetchAndRefreshCars");
    this.carProvider.getCars(9, 9)
      .subscribe(
        carsData => {

          if (!this.isPickupRequested) {
            (<any>carsData).cars.forEach(car => {
              this.updateCarMarker(car);
            })

          }
        }
      )

  }


}
