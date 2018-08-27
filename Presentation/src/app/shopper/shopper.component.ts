import { Component, OnInit } from '@angular/core';
import { LoggingService } from '../logging/logging.service';
import { ShopperService } from './shopper.service';
import { StoreFront } from '../entity/store-front';
import { EthcontractService } from '../ethcontract.service';

@Component({
  selector: 'app-shopper',
  templateUrl: './shopper.component.html',
  styleUrls: ['./shopper.component.css']
})
export class ShopperComponent implements OnInit {

  public storeFront: StoreFront = new StoreFront(0, '', '');
  public storeFronts: StoreFront[] = [];

  public title: string = "Shopper";
  public subTitle: string = "List of store front";
  public subTitle1: string = "Add new store front";

  constructor(private ethContract: EthcontractService,
    private loggingService: LoggingService,
    private shopperService: ShopperService) { }

  ngOnInit() {
    this.loggingService.add("ShopperComponent initialized!");

    //this.storeFronts = this.shopperService.getAllStoreFronts();
    this.getAllFronts();
  }

  getAllFronts(): void {
    let that = this;
    //console.log("1. getAllStoreFronts() Initialized!");
    that.ethContract.getListOfOwners().then(function (storesList: any) {
      //console.log("2. List of owners: " + JSON.stringify(storesList));
      if (storesList == "") {
        //console.log("No store");
        return;
      }
      storesList.forEach(storeOwner => {
        that.ethContract.getListOfFronts(storeOwner).then(function (frontCount: number) {
          //console.log("3. Front Count: " + frontCount);
          if (frontCount != 0) {
            for (var i = 0; i < frontCount; i++) {
              that.ethContract.getFrontDetailsByOwner(storeOwner, i).then(function (frontDetails:any) {
                //frontDetails[0] returns front name and frontDetails[1] returns front id
                if (frontDetails[0] != "") {
                  //console.log("4 in Loop. Front Name: " + frontName1);
                  that.storeFronts.push(new StoreFront(frontDetails[1], frontDetails[0], storeOwner));
                }
                else {
                  //console.log("No Front name for this seller");
                }
              });
            }
          }
          else {
            console.log("No front count for this seller");
          }
        });
      });
      // .catch(function (error) {
      //   console.log(error);
      // });
    });
  }
}
