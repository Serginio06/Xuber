import {Component, Input, Output, EventEmitter, OnChanges, OnInit} from '@angular/core';
import {CarProvider} from '../../providers/car';
import {PickupPubSubProvider} from  '../../providers/pickup-pub-sub';
import {Observable} from "rxjs/Observable";

/*
 Generated class for the Pickup component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
declare var google;

@Component({
  selector: 'pickup',
  templateUrl: 'pickup.html'
})
// export class PickupComponent implements OnChanges {
export class PickupComponent implements OnChanges, OnInit {
  @Input() isPinSet: boolean;
  @Input() map: any;
  @Input() isPickupRequested: boolean;

  // @Output() updatedPickupLocation: EventEmitter<google.maps.LatLng> = new EventEmitter();
  @Output() updatedPickupLocation: any = new EventEmitter();
  // @Output() updatedPickupLocation: any;

  // private pickUpMarker: google.maps.Marker;
  private pickUpMarker: any;
  // private popup: google.maps.InfoWindow;
  private popup: any;
  private pickupSubscription: any;

  constructor(private pickupPubSubProvider: PickupPubSubProvider) {
    // console.log('Hello Pickup Component');
    // this.text = 'Hello World';
  }

  ngOnInit() {
    this.pickupSubscription = this.pickupPubSubProvider.watch().subscribe(
      e => {
        if (e.event === this.pickupPubSubProvider.EVENTS.ARRIVAL_TIME) {
          this.updateTime(e.data);
        }
      }
    )
  }

  ngOnChanges(changes) {
    // you can use ngDoCheck if ngOnChanges did not fire event
    // console.log("isPinSet=",this.isPinSet);
    if (!this.isPickupRequested) {

      if (this.isPinSet) {
        this.showPickupMarker();
      } else {
        this.removePickupMarker();
      }
    }

  }

  showPickupMarker() {

    this.removePickupMarker();

    this.pickUpMarker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.BOUNCE,
      position: this.map.getCenter(),
      // icon: '../../assets/img/pointer33.png',
      // icon:{ path:google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
      //   labelOrigin: new google.maps.Point(12, -10)},
      label: {text: "A", color: "white"}
    });

    setTimeout(
      () => {
        this.pickUpMarker.setAnimation(null);
        this.showPickupTime();
      },
      750);

    // this.showPickupTime();

    // send pick up location as currentLocation
    // this.updatedPickupLocation = new EventEmitter();
    this.updatedPickupLocation.next(this.pickUpMarker.getPosition());
    // console.log("updatedPickupLocation: ",this.pickUpMarker.getPosition() );

  }

  removePickupMarker() {
    if (this.pickUpMarker) {
      this.pickUpMarker.setMap(null);
    }


  }

  showPickupTime() {
    this.popup = new google.maps.InfoWindow({
      content: '<h5>Yor are Here</h5>'
    });

    this.popup.open(this.map, this.pickUpMarker);

    google.maps.event.addListener(this.pickUpMarker, 'click',
      () => {
        this.popup.open(this.map, this.pickUpMarker);
      })
  }

  updateTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    this.popup.setContent('<h5>' + minutes + ' minutes</h5>');
  }

}
