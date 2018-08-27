import { Injectable } from '@angular/core';

// import * as TruffleContract from 'truffle-contract';
import { LoggingService } from './logging/logging.service';
import { EthcontractService } from './ethcontract.service';

declare let require: any;

// let maketAbi = require('../../../build/contracts/marketplace.json');

export enum UserRole {
  ContractOwner = 0,
  Administrator = 1,
  StoreOwner = 2,
  Shopper = 3
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private loggingService: LoggingService,
    private ethService: EthcontractService) {
    this.loggingService.add("UserService created!");
  }

  public authorizeUser = function() {
    let that = this;
    return new Promise((resolve, reject) => {
      that.ethService.getAccountType().then(function (response) {
       //that.loggingService.add("authorizeUser resolve!");
        return resolve(response);
      }).catch(function (error) {
        that.loggingService.add("authorizeUser reject!");
       // that.loggingService.add(error);
        return reject(error);
      });
    });

    // let  that = this;

    // this.loggingService.add("authorizeUser is called!");

    // this.ethService.getAccountType().then(function(response){

    //     that.loggingService.add(response.status);

    // }).catch(function(error){

    //   that.loggingService.add(error);

    // });

    // return UserRole.Shopper;
  }

}
