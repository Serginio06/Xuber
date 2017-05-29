import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PickupPubSubProvider} from  '../../providers/pickup-pub-sub';
// import {PickupPubSubProvider} from  '../../providers/pickup-pub-sub';
// import {MapComponent} from '../../components/map/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  // directives: [MapComponent]
})
export class HomePage {
  private pickUpTime: string = "PICKUP time is approximetely 5 min";
  private cardNumber: string = "Visa **19";
  private btnDriverRequest = "Request to driver";
  private btnCancelRequest = "Cancel request";
  private pickupSubscription: any;

  public isPickupRequested: boolean;
  private timeTillArrival: number;

  constructor(public navCtrl: NavController, private pickupPubSubProvider: PickupPubSubProvider) {
    this.isPickupRequested = false;
    this.timeTillArrival = 5;
    this.pickupSubscription = this.pickupPubSubProvider.watch().subscribe(
      e => {
        this.processPickupSubscription(e);
      }
    )
  }

  processPickupSubscription(e) {
    switch (e.event) {
      case this.pickupPubSubProvider.EVENTS.ARRIVAL_TIME:
        this.updateArrivalTime(e.data);

    }
  }

  updateArrivalTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    this.timeTillArrival = minutes;
  }

  confirmPickup() {
    this.isPickupRequested = true;
  }

  cancelPickup() {
    this.isPickupRequested = false;
  }
}
