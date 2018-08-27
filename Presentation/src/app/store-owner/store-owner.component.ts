import { Component, OnInit } from '@angular/core';
import { LoggingService } from '../logging/logging.service';
//import { StoreOwnerService } from './store-owner.service';
import { StoreFront } from '../entity/store-front';
import { FormGroup } from '../../../node_modules/@angular/forms';
import { EthcontractService } from '../ethcontract.service';
import { ActivatedRoute } from '@angular/router';
//import { StoreFronts } from '../mock/mock-store-front';

@Component({
  selector: 'app-store-owner',
  templateUrl: './store-owner.component.html?v=${new Date().getTime()}',
  styleUrls: ['./store-owner.component.css']
})
export class StoreOwnerComponent implements OnInit {

  // public address : string ="0x0";
  public storeFronts: StoreFront[]=[];
  public storeFront: StoreFront = { name: "", owner: "", id: 0 };
  public storeOwner: string;// = "0x72257cdec8f36de338f12cd0386394bddff00815";
  public title: string = "Store Owner";
  public subTitle: string = "List of store front";
  public subTitle1: string = "Add new store front";
  public storeName: string ="";
  public msg1="This store has not been approved by admin yet!, Please come back later."
  public isAprroved=false;
  constructor(private ethContract: EthcontractService,
    private loggingService: LoggingService,
    private route : ActivatedRoute) { 
      this.storeOwner = this.route.snapshot.queryParamMap.get("ac");
      this.loggingService.add("ac : "+this.storeOwner);
    }

  ngOnInit() {
    this.loggingService.add("StoreOwnerComponent initialized!");
    this.getStoreDetailsByAddress();
  }
  getStoreDetailsByAddress(): void {
    let that = this;
    //console.log("1. Initialized!");
    that.ethContract.getStoreDetailsByAddress(this.storeOwner).then(function (details) {
      if(details[1]==true) {
        that.isAprroved=true;
        that.msg1="";
        //console.log("deltails: " + details[1]);
        that.getStoreFronts();
      }
      else {
        that.isAprroved=false;
        that.msg1="This store has not been approved by admin yet!, Please come back later."
      }
      that.storeName=details[0];
    });
  }
  getStoreFronts(): void {
    
    let that = this;
    that.storeFronts=[];
    //console.log("1. Initialized!");
    that.ethContract.getListOfFronts(this.storeOwner).then(function (frontCount) {
      //console.log("2. Front Count: " + frontCount);
      for (var i = 0; i < frontCount; i++) {
        that.ethContract.getFrontDetailsByOwner(that.storeOwner, i).then(function (frontDetails:any) {
          //frontDetails[0] returns front name and frontDetails[1] returns front id
        //that.ethContract.getFrontDetailsByOwner(that.storeOwner,i).then(function (frontName1: string) {
          //Returns i = 3 everytime
          that.storeFronts.push(new StoreFront(frontDetails[1], frontDetails[0], that.storeOwner));
          //that.storeFronts.push(new StoreFront(that.storeFronts.length, frontName1, that.storeOwner));
          //console.log("Loop: " + that.storeFronts.length);
        });
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  addStoreFront(): void {
    let that = this;
    //console.log("Before addFront() outside begin call ");
    //this.loggingService.add(`addFront ${this.storeFront.name}!`);
    that.ethContract.addNewFront(this.storeFront.name).then(function (respone) {
      that.getStoreFronts();
      //console.log("After addNewFront() outside ending call");
      //that.loggingService.add("After AddNewStore() call finished");
    }).catch(function (error) {
      //that.loggingService.add("addStore() catch error: " + error);
    });
    //this.loggingService.add(`Add store front ${this.storeFront.name}!`);
    //this.storeOwnerService.addStoreFront(this.storeFront.owner,this.storeFront.name);
    //this.storeFront.name ="";
    //this.getStoreFronts();
    // this.Form.reset();
  }

}
