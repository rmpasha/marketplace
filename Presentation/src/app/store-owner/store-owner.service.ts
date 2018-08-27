import { Injectable } from '@angular/core';
import { LoggingService } from '../logging/logging.service';
import { storeOwners } from '../mock/mock-store-owners';
import { StoreFrontService } from '../store-front/store-front.service';
import { StoreFront } from '../entity/store-front';
import { StoreOwner } from '../entity/store-owner';
import { EthcontractService } from '../ethcontract.service';

@Injectable({
  providedIn: 'root'
})
export class StoreOwnerService {

  constructor(private storeFrontService : StoreFrontService,private ethContract: EthcontractService,
    private loggingService : LoggingService) { }
/*
  getAllStoreOwners() : StoreOwner[]{
    this.loggingService.add(JSON.stringify(storeOwners));
    //Calling eth service 
    //this.ethContract.getStoreOwnerList().then(function(result){
      this.storeOwners=result;
    });
    return storeOwners;
  }

  addStoreOwner(address : string ) : void {
      storeOwners.push(new StoreOwner("",address,false));
  }
*/
  addStoreFront(owner:string, name : string) :void {
      this.storeFrontService.addNewStoreFront(owner,name);
  }
/*
  getAllStoreFronts(ownerAddress:string) : StoreFront[]{
    return this.storeFrontService.getStoreFrontByOwner(ownerAddress);
  }
*/
}
