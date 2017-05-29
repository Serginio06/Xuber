import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {CarProvider} from '../../providers/car';
import * as SlidingMarker from 'marker-animate-unobtrusive';
import {PickupPubSubProvider} from  '../../providers/pickup-pub-sub';

declare var google;

@Component({
  selector: 'pickup-car',
  templateUrl: 'pickup-car.html'
})
export class PickupCarComponent implements OnInit, OnChanges {

  @Input() isPickupRequested: boolean;
  @Input() map: any;
  @Input() pickupLocation: any;

  public pickupCarMarker: any;
  public polylinePath: any;


  constructor(public carProvider: CarProvider, private pickupPubSubProvider:PickupPubSubProvider) {

  }

  ngOnInit() {

  }


  ngOnChanges() {
    if (this.isPickupRequested) {
      this.requestCar();
    } else {
      this.removeCarRequest();
this.removeDirections();
    }


  }


  addCarMarker(position) {
    this.pickupCarMarker = new SlidingMarker({
      map: this.map,
      position: position,
      icon: 'www/../assets/img/car2.png'
    });

    this.pickupCarMarker.setDuration(1000);
    this.pickupCarMarker.setEasing('linear');


  }

  showDirections(path) {

    this.polylinePath = new google.maps.Polyline({
      path: path,
      strokeColor: "#FF0000",
      strokeWeight: 3
    });

    this.polylinePath.setMap(this.map);

  }

  updateCar(cbDone) {
    this.carProvider.getPickupCar().subscribe(
      car => {
        console.log("updateCar/car ", car);
        console.log("pickupCarMarker ", this.pickupCarMarker);
        //animate car to the next point
        this.pickupCarMarker.setPosition(car.position);
        //set direction path for car
        this.polylinePath.setPath(car.path);
        // upate arrival time
        this.pickupPubSubProvider.emitArrivalTime(car.time);

        // keep updating car
        console.log("car.path.length ", car.path.length);
        if (car.path.length > 1) {
          setTimeout(() => {
            this.updateCar(cbDone);
          }, 1000);
        } else {
          // car arrived
          cbDone();
        }
      }
    )
  }

  checkForRiderPickup(){
    this.carProvider.pollForRiderPickup().subscribe(
      data => {
        this.pickupPubSubProvider.emitPickup();
      }
    )

  }

  requestCar() {
    // console.log("this.pickupLocation: ", this.pickupLocation);

    this.carProvider.findPickupCar(this.pickupLocation).subscribe(car => {

      // console.log(car);

      // show car marker
      this.addCarMarker(car.position);
      // show car path to pickup location
      this.showDirections(car.path);
      // keep updating car
      this.updateCar(() => this.checkForRiderPickup());
    })

  }

  removeCarRequest() {
    if (this.pickupCarMarker) {
      this.pickupCarMarker.setMap(null);
      this.pickupCarMarker = null;
    }

  }

  removeDirections(){
    if ( this.polylinePath ) {
      this.polylinePath.setMap(null);
      this.polylinePath = null;
    }
  }


}
