import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';


declare var google;

@Injectable()
export class SimulateProvider {

  public directionService: any;
  public myRoute: any;
  public myRountIndex: number;
  // private latCar1 = 50.470326;
  // private latCar2 = 50.471897;
  // private lngCar1 = 30.639861;
  // private lngCar2 = 30.631557;


  constructor(public http: Http) {
    this.directionService = new google.maps.DirectionsService();


  }

  riderPickedup() {
    // simulate rider picked up after 1 sec
    return Observable.timer(1000);

  }

  riderDroppedOff() {
    // simulate rider dropped off after 1 sec
    return Observable.timer(1000);

  }

  getPickupCar() {

    return Observable.create(
      observable => {

        let car = this.myRoute[this.myRountIndex];

        observable.next(car);
        this.myRountIndex++;

      }
    )


  }

  getCars(lat, lgn) {

    let carData = this.cars[this.carIndex];

    this.carIndex++;

    if (this.carIndex > this.cars.length - 1) {
      this.carIndex = 0;
    }

    return Observable.create(
      observer => observer.next(carData)
    )

  }

  calculateRoute(start, end) {

    return Observable.create(Observable=> {

      this.directionService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      }, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          Observable.next(response);
        } else {
          Observable.error(status);
        }
      })

    })
  }

  getSegmentedDirections(directions) {

    let route = directions.routes[0];
    let legs = route.legs;
    let path = [];
    let increments = [];
    let duration = 0;

    let numOfLegs = legs.length;

    while (numOfLegs--) {

      let leg = legs[numOfLegs];
      let steps = leg.steps;
      let numOfSteps = steps.length;

      while (numOfSteps--) {

        let step = steps[numOfSteps];
        let points = step.path;
        let numOfPoints = points.length;

        duration += step.duration.value;

        while (numOfPoints--) {

          let point = points[numOfPoints];

          path.push(point);

          increments.unshift({
            position: point, // car position
            time: duration, // time left before arrival
            path: path.slice(0) // clone array to prevent referencing final path array
          })

        }

      }


    }

    return increments;


  }

  simulateRoute(start, end) {

    return Observable.create(observable => {
      this.calculateRoute(start, end).subscribe(
        directions => {
          // get route path
          this.myRoute = this.getSegmentedDirections(directions);
          // return pickup car
          this.getPickupCar().subscribe(
            car => {
              observable.next(car); // first increment in car path
            }
          )

        }
      )


    })
  }

  findPickupCar(pickupLocation) {

    this.myRountIndex = 0;

    let car = this.cars1.cars[0];// pick one of the cars to simulate pickup car
    let start = new google.maps.LatLng(car.coords.lat, car.coords.lng);
    let end = pickupLocation;

    console.log("findPickupCar/start ", start);
    console.log("findPickupCar/end ", end);
    return this.simulateRoute(start, end);

  }

  private carIndex: number = 0;

  private cars1 = {
    cars: [{
      id: 1,
      coords: {
        lat: 50.469745,
        lng: 30.637876
      }
    }, {
      id: 2,
      coords: {
        lat: 50.471897,
        lng: 30.631557
      }
    }]
  };

  private cars2 = {
    cars: [{
      id: 1,
      coords: {
        lat: 50.468583,
        lng: 30.633364
      }
    }, {
      id: 2,
      coords: {
        lat: 50.474334,
        lng: 30.639721
      }
    }]
  };

  private cars3 = {
    cars: [{
      id: 1,
      coords: {
        lat: 50.464199,
        lng: 30.636347
      }
    }, {
      id: 2,
      coords: {
        lat: 50.470838,
        lng: 30.641953
      }
    }]
  };

  private cars4 = {
    cars: [{
      id: 1,
      coords: {
        lat: 50.466589,
        lng: 30.644994
      }
    }, {
      id: 2,
      coords: {
        lat: 50.469609,
        lng: 30.637146
      }
    }]
  };

  private cars5 = {
    cars: [{
      id: 1,
      coords: {
        lat: 50.470938,
        lng: 30.642041
      }
    }, {
      id: 2,
      coords: {
        lat: 50.468544,
        lng: 30.633241
      }
    }]
  };

  private cars: Array<any> = [this.cars1, this.cars2, this.cars3, this.cars4, this.cars5];

}
