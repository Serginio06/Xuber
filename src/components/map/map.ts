import {Component, OnInit, Input} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular'
import {Geolocation} from 'ionic-native';
import {Observable} from 'rxjs/Observable';
import {PickupCarComponent} from '../pickup-car/pickup-car'
import {CarProvider} from '../../providers/car';

declare var google;

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent implements OnInit {

  @Input() isPickupRequested: boolean;

  private text: string;
  // public location: any;
  // public map: google.maps.Map;
  public map: any;
  public isMapIdle: boolean;
  public currentLocation:any = {};

  constructor(public navController: NavController, public loadingCtrl: LoadingController) {


  }

  ngOnInit() {
    this.map = this.createMap();
    this.addMapEventListeners();

    this.getCurrentLocation().subscribe(
      location => {
        // this.map.panTo(location);

        this.centerLocation(location);
        this.isMapIdle = true;
      }
    )
  }


  updatedPickupLocation(location){
    this.currentLocation = location;
    this.centerLocation(location);

  }

  addMapEventListeners() {
    // google.maps.event.addListener(this.map, 'dragstart', () => {
    // google.maps.addListener(this.map, 'dragstart', () => {
    this.map.addListener('dragstart', () => {
      // console.log("drag start");
      this.isMapIdle = false;
    });
    // google.maps.event.addListener(this.map, 'idle',
    // google.maps.addListener(this.map, 'idle',
    this.map.addListener('idle',
      () => {
        // console.log("drag stop");
        this.isMapIdle = true;
      });

  }

  centerLocation(location) {
    if (location) {
      this.map.panTo(location);
    } else {
      this.getCurrentLocation().subscribe(
        currentLocation => {
          this.map.panTo(currentLocation);

        }
      )
    }


  }

  getCurrentLocation() {
    let options = {timeout: 10000, enableHighAccuracy: true};
    let loading = this.loadingCtrl.create({
      content: "Locating..."
    });

    loading.present();


    let locatinObs = Observable.create(
      observer => {
        Geolocation.getCurrentPosition(options).then(
          (resp) => {

            let location = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
            // resp.coords.latitude
            // resp.coords.longitude
            observer.next(location);
            loading.dismiss();
            // observer.complete();

          }).catch((error) => {
          console.log('Error getting location', error);
          observer.error('location/err: ' + JSON.stringify(error));
          loading.dismiss();
          // observer.complete();
        });

      }
      // ,
      // err => {
      //   observer.error('location/err: ' + err)
      //   loading.dismiss();
      // },
      // () => {
      //   observer.complete()
      // }
    );

    return locatinObs;

  }


  createMap() {
    let location = new google.maps.LatLng(85.468933, 30.632656);


    let mapOptions = {
      center: location,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };

    let mapEl = document.getElementById('map');
    let map = new google.maps.Map(mapEl, mapOptions);

    return map;


  }


}
