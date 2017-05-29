import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {MapComponent} from '../components/map/map';
import {PickupComponent} from '../components/pickup/pickup';
import {AvailableCarsComponent} from '../components/available-cars/available-cars';
import {SimulateProvider} from '../providers/simulate';
import {CarProvider} from '../providers/car';
import {PickupCarComponent} from '../components/pickup-car/pickup-car';
import {PickupPubSubProvider} from '../providers/pickup-pub-sub'

// import {enableProdMode} from '@angular/core';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MapComponent,
    PickupComponent,
    AvailableCarsComponent,
    PickupCarComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MapComponent,
    PickupComponent,
    AvailableCarsComponent,
    PickupCarComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, SimulateProvider, CarProvider, PickupPubSubProvider]
})
export class AppModule {}
