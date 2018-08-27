import { Component, OnInit } from '@angular/core';
import { LoggingService } from '../logging/logging.service';
import { EthcontractService } from '../ethcontract.service';
import { Store } from '../entity/store-application';

@Component({
  selector: 'app-store-application',
  templateUrl: './store-application.component.html',
  styleUrls: ['./store-application.component.css']
})

export class StoreApplicationComponent implements OnInit {
  public store: Store = { name: "" };
  public title: string = "Store Application";
  public subTitle1: string = "Enter your store name";

  constructor(private loggingService: LoggingService, private ethContract: EthcontractService) {

  }

  ngOnInit() {
    this.loggingService.add("Application component initialized!");
  }

  addStore(): void {
    let that = this;
    //console.log("Before addNewStore() call ");
    //this.loggingService.add(`addAdmin ${this.store.name}!`);
    that.ethContract.addNewStore(this.store.name).then(function (respone) {
      //console.log("After addNewStore() call finished");
      //that.loggingService.add("After AddNewStore() call finished");
    }).catch(function (error) {
      //that.loggingService.add("addStore() catch error: " + error);
    });
  }
}
