import { Component, OnInit } from '@angular/core';
import { LoggingService } from '../logging/logging.service';
import { StoreOwner } from '../entity/store-owner';
//import { StoreOwnerService } from '../store-owner/store-owner.service';
import { EthcontractService } from '../ethcontract.service';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {
  public storeOwners: StoreOwner[] = [];
  public storeOwner: StoreOwner = new StoreOwner();//{address:""};

  public approvedStores: StoreOwner[];

  public unapprovedStores: StoreOwner[];

  public title: string = "Administrator";
  public unApproveTitle: string = "Unapproved store owners";
  public approveTitle: string = "Approved store owners";

  constructor(private ethContract: EthcontractService,
    private loggingService: LoggingService) {
    //this.loggingService.add("AdministratorComponent created!");
  }

  ngOnInit() {
    //this.loggingService.add("AdministratorComponent initialized!");
    this.getStoreOwners();
    // this.getApprovedOwners();
    // this.getUnApprovedOwners();
  }

  getStoreOwners(): void {
    let that = this;
    that.storeOwners = [];
    that.ethContract.getListOfOwners().then(function (storesList: any) {
      storesList.forEach(element => {
        that.ethContract.getStoreDetailsByAddress(element).then(function (details) {
          //that.loggingService.add("getStoreDetailsByAddress result: " + JSON.stringify(details));
          that.storeOwners.push(new StoreOwner(details[0], element, details[1]));
          //console.log("foreach call inside " + JSON.stringify(stores));
          that.getApprovedOwners();
          that.getUnApprovedOwners();
        });
      });
    }).catch(function (error) {
    });
  }

  // addStoreOwner() : void {
  //   this.loggingService.add(`Add store owner ${this.storeOwner.address}!`);
  //   this.storeOwnerService.addStoreOwner(this.storeOwner.address);
  //   this.storeOwner.address ="";
  // }

  public getApprovedOwners(): void {
    //    this.loggingService.add("getApproved !!");
    this.approvedStores = this.storeOwners.filter(x => x.isApproved);
    //    this.loggingService.add(JSON.stringify(this.approvedStores));
  }

  public getUnApprovedOwners(): void {
    //    this.loggingService.add("getUnApprovedOwner");
    this.unapprovedStores = this.storeOwners.filter(x => !x.isApproved);
    //    this.loggingService.add(JSON.stringify(this.unapprovedStores));

  }
  public approveOwner(address: string): void {
    let that = this;
    // var owner = this.storeOwners.find(x => x.address === address);
    // this.loggingService.add(JSON.stringify(address));
    that.ethContract.approveStore(address).then(function (result) {
      // owner.isApproved = true;
      that.getApprovedOwners();
      that.getUnApprovedOwners();
    });


  }
}
