import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
import * as TruffleContract from 'truffle-contract';
//import { resolve } from 'q';
import { LoggingService } from './logging/logging.service';
import { Admin } from './entity/admin';
//import { StoreOwner } from './entity/store-owner';
//import { element } from '@angular/core/src/render3/instructions';
//import { StoreFront } from './entity/store-front';

declare let require: any;
declare let window: any;

let maketAbi = require('../../../build/contracts/marketplace.json');

@Injectable({
  providedIn: 'root'
})
export class EthcontractService {
  /**
   * @author Rajendra Maharjan
   * @dev All web3 service methods
   */
  private web3Provider: null;
  private contracts: {};
  private marketInstance: any;

  constructor(private loggingService: LoggingService) {
    if (typeof window.web3 !== 'undefined') {
      this.web3Provider = window.web3.currentProvider;
     //console.log("not connected");
    } else {
      //this.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
      //console.log("MetaMast or MIST has not been installed");
      //alert("Please installl Ethereum Browser (MIST or MetaMask)");
    }
    //window.web3 = new Web3(this.web3Provider);
    let marketContract = TruffleContract(maketAbi);
    marketContract.setProvider(this.web3Provider);
    this.marketInstance = marketContract.deployed()
    /*
        //Refresh account and balance once changed in wallet address in MetaMask or MIST
        let curAccount = window.web3.eth.accounts[0];
        setInterval(() => {
          if(window.web3.eth.accounts[0] !== curAccount) {
            curAccount=window.web3.eth.accounts[0];
            this.getAccountInfo();
          }
        },100);
        */
  }
  public getCurrentAccount = function () {
    return window.web3.eth.accounts[0];
  }
  //Get account info for current login accress and it's balance
  public getAccountInfo = function () {
    var that = this;
    return new Promise((resolve, reject) => {
      window.web3.eth.getCoinbase(function (err, account) {
        that.loggingService.add("address : " + account);
        if(account==null)
          return;
        //console.log("Current Address:" + account);
        if (err === null) {
          window.web3.eth.getBalance(account, function (err, balance) {
            // console.log(account);
            that.loggingService.add("balance : " + window.web3.fromWei(balance, "ether"));
            if (err === null) {
              return resolve({
                fromAccount: account,
                balance: window.web3.fromWei(balance, "ether")
              });
            } else {
              return reject("error getting balance!");
            }
          });
        } else {
          return reject("error getting account!");
        }
      });
    });
  }
  //Get Account Type
  public getAccountType = function () {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        return instance.getUserType.call({ from: window.web3.eth.accounts[0], gas: 500000 })
          //return marketInstance.getUserType.call({from: window.web3.eth.accounts[0], gas: 500000})
          .then(function (status) {
            //that.loggingService.add("USer type: " + status);
            if (status) {
              return resolve({ role: status });
            }
          }).catch(function (err) {
            //console.log(err);
            return reject(err);
          });
      });
    });
  }

  /**
   * To add new admin by contract owner
   * @param _adminAddress: admin wallet address
   * @returns Nothing
   */
  public addNewAdmin = function (_adminAddress) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        return instance.addNewAdmin(_adminAddress, { from: window.web3.eth.accounts[0], gas: 800000, price: 1}).then(function (response) {
          return resolve({ status: 'Add new admin success' });
        }).catch(function (err) {
          return reject(err);
        });
      });
    });
  }
  /**
   * @dev To get Admin List
   * @returns Array of Admin Addresses
   */
  public getAdminList = function () {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        return instance.getAdmins.call().then(function (result) {
          //that.loggingService.add("Result after getAdminList() call: " + result);
          var admins: Admin[] = [];
          //that.loggingService.add(typeof result);
          result.forEach(element => {
            //that.loggingService.add("element :" + element);
            admins.push(new Admin(element));
          });
          //that.loggingService.add("Json retun from inside getAdminList: " + JSON.stringify(admins));
          //console.log("Json retun from inside getAdminList: " + JSON.stringify(admins));
          return resolve(admins);
        }).catch(function (err) {
          //console.log(err);
          return reject(err);
        });
      });
    });
  }

  public getListOfOwners = function () {
    let that = this;
    //this.loggingService.add("getListOfOwners 1 !!");
    return new Promise((resolve, reject) => {
      that.getAllStoreAddressesOnly().then(function (storeAddrs) {
        //that.loggingService.add("getListOfOwners.getAllStoreAddressesOnly 2 !!" + JSON.stringify(storeAddrs));
        //console.log("getAllStoreAddressesOnly() call inside 100" + JSON.stringify(storeAddrs));
        // var stores: StoreOwner[] = [];
        // storeAddrs.forEach(element => {
        //   that.getStoreDetailsByAddress(element).then(function (details) {
        //     stores.push(new StoreOwner(details[0], storeAddrs, details[1]));
        //     //console.log("foreach call inside " + JSON.stringify(stores));
        //   });
        // });
        // that.loggingService.add(JSON.stringify(stores));
        // console.log("foreach call inside 2 " + JSON.stringify(stores));
        return resolve(storeAddrs);
      }).catch(function (err) {
        //console.log(err);
        return reject(err);
      });
    });
  }
  /**
   * @dev To get the list of fronts
   * @param _storeOwnerAddress
   * @return frontCount
   */
  public getListOfFronts = function (_storeAddress) {
    let that = this;
    return new Promise((resolve, reject) => {
      if(_storeAddress=="")
        return reject("Null");
      //console.log("getListOfFronts Inside 1 : " + _storeAddress);
      that.getFrontCountByOwner(_storeAddress).then(function (frontCount) {
         //console.log("getListOfFronts Inside 2: " + frontCount);
        // var fronts: StoreFront[] = [];
        // for (var i = 0; i < frontCount; i++) {
        //   this.getFrontDetailsByOwner(_storeAddress, i).then(function (frontName) {
        //     fronts.push(new StoreFront(i, frontName, _storeAddress));
        //   });
        // }
        return resolve(frontCount);
      }).catch(function (err) {
        console.log("It might be storeOwner never approved by admin." + err);
        return reject(err);
      });
    });
  }
  /*
  public getStoreOwnerList = function () {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        return instance.getAllStoreAddresses.call().then(function (result) {
          that.loggingService.add("getAllStoreAddresses result: "+JSON.stringify(result));
          var storeOwners: StoreOwner[] = [];
          result.forEach(element => {
            console.log("store each: " + element);
            that.marketInstance.then(function (instance1) {
              return instance1.getStoreByAddress.call(element).then(function (result1) {
                storeOwners.push(new StoreOwner(result1[0], element, result1[1]));
                console.log("Result after getStoreByAddress() inside 1: " + JSON.stringify(storeOwners));
               });
            });
          });
          console.log("Result after getStoreByAddress() inside 2: " + JSON.stringify(storeOwners));
          return resolve(result);
        }).catch(function (err) {
          //console.log(err);
          return reject(err);
        });
      });
    });
    // results.then(function(data){
    //   console.log("Result after getStoreByAddress() inside 2: " + JSON.stringify(storeOwners));
    //   return resolve(storeOwners);
    //});
  }
  */
  /*
   public getFrontList = function (_storeAddress) {
     let that = this;
     that.marketInstance.then(function (instance) {
       return instance.getFrontCountByOwner.call(_storeAddress);
     }).then(function (result) {
       //console.log("Result after getFrontCountByOwner(): " + result);
       var storeFronts: StoreFront[] = [];
       for (var i = 0; i < result.valueOf(); i++) {
         console.log("store each: " + i);
         that.marketInstance.then(function (instance1) {
           return instance1.getFrontDetailsByOwner.call(_storeAddress, i).then(function (result) {
             storeFronts.push(new StoreFront(i, result, _storeAddress));
             console.log("Result after getStoreByAddress() inside 1: " + JSON.stringify(storeFronts));
           });
         });
       }
       return (storeFronts);
     }).catch(function (err) {
       //console.log(err);
     });
   }*/
  /**
   * To get the balance of whole contract
    * @returns contract owner balance
   */
  public getTotalContractBalance = function () {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        return instance.getContractBalance.call().then(function (result) {
          console.log("Result after getContractBalance() call: " + result);
          return resolve(result);
        }).catch(function (err) {
          //console.log(err);
          return reject(err);
        });
      });
    });
  }

  /**
   * To approve store by admin
   * @param _storeAddress Store Owner wallet address
   * @returns Nothing
   */
  public approveStore = function (_storeAddress) {
    let that = this;
    this.loggingService.add(_storeAddress);
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        return instance.approveStoreByAdmin(_storeAddress,
          { from: window.web3.eth.accounts[0], gas: 800000, gwei: 1 })
          .then(function (result) {
            console.log("Result after approve store(): " + result);
            return resolve(result)
          }).catch(function (err) {
            //console.log(err);
            return reject(err);
          });
      });
    });
  }
  /** Remain..
   * To get only approved list by admin
   * @returns Approved list array
   */

  /**
   * To get All store addresess
    * @returns Addresses Array
   */
  public getAllStoreAddressesOnly = function () {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        that.loggingService.add("getAllStoreAddressesOnly");
        return instance.getAllStoreAddresses.call().then(function (result) {
          that.loggingService.add("getAllStoreAddressesOnly.then");
          //console.log("Result after getAllStoreAddresses() call: " + result);
          return resolve(result);
        }).catch(function (err) {
          //console.log(err);
          return reject(err);
        });
      });
    });
  }

  public getStoreDetailsByAddress = function (_storeAddress) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        that.loggingService.add("getStoreDetailsByAddress");
        return instance.getStoreByAddress.call(_storeAddress).then(function (result) {
          //console.log("Result after getStoreByAddress(): " + result);
          that.loggingService.add("getStoreDetailsByAddress");
          return resolve(result);
        }).catch(function (err) {
          //console.log(err);
          return reject(err);
        });
      });
    });
  }
  /**
   * To Add a store by any user. This means apply for the store
   * @param _storeName Store
   * @returns Nothing
   */
  public addNewStore = function (_storeName) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        //console.log("result before add inside addNewStore() Store Name: " + _storeName);
        instance.addNewStore(_storeName, { from: window.web3.eth.accounts[0], gas: 800000 }).then(function (result) {
          //console.log("result after add inside addNewStore() " + result);
          return resolve(result);
        }).catch(function (err) {
          //console.log(err);
          return reject(err);
        });
      });
    });
  }
  /**
   * To withdraw amount from contract address to store address only by store owner
   * @param _amountWithdraw 
   * @returns Nothing
   */
  public withdrawAmount = function (_amountWithdraw) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        //console.log("Result after withdrawAmount() call inside1: " + _amountWithdraw);
        return instance.withdrawAmount(window.web3.toWei(_amountWithdraw), { from: window.web3.eth.accounts[0], gas: 800000, gwei: 1 })
          .then(function (result) {
            //console.log("Result after withdrawAmount() call inside2: " + result);
            return resolve(result);
          }).catch(function (err) {
            //console.log(err);
            return reject(err);
          });
      });
    });
  }
  /**
   * To get max amount can be withdrawn by this store owner
   * @param _amountWithdraw 
   * @returns Nothing
   */
  public getMaxAmountCanWithdraw = function () {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        //console.log("Before getMaxAmountCanWithdraw() call Inside 1: ");
        return instance.getMaxAmountCanWithdraw.call({ from: window.web3.eth.accounts[0]}).then(function (result) {
         // console.log("Result after getMaxAmountCanWithdraw() call Inside 2: " + result);
          return resolve(window.web3.fromWei(result,'ether'));
        }).catch(function (err) {
          //console.log(err);
          return reject(err);
        });
      });
    });
  }
  /**
   * To Add a store front by store owner only
   * @param _frontName Store
   * @returns Nothing
   */
  public addNewFront = function (_frontName) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        return instance.addStorefront(_frontName, { from: window.web3.eth.accounts[0], gas: 800000 });
      }).then(function (result) {
        //console.log("result after addFront " + result);
        return resolve(result);
      }).catch(function (err) {
        //console.log(err);
        return reject(err);
      });
    });
  }

  /*
  * To get the front count by stores
  * @param _storeAddress Store
  * @returns integer
  */
  public getFrontCountByOwner = function (_storeAddress) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        return instance.getFrontCountByOwner.call(_storeAddress).then(function (result) {
          // console.log("Result after getFrontCountByOwner(): " + result);
          return resolve(result);
        }).catch(function (err) {
          //console.log(err);
          return reject(err);
        });
      });
    });
  }
  /**	
   * To get the front details by store owner address
   * @param _storeAddress, front_id
   * @returns Store name
   */
  public getFrontDetailsByOwner = function (_storeAddress, _front_id) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        return instance.getFrontDetailsByOwner(_storeAddress, _front_id).then(function (result) {
          // console.log("Result after getFrontDetailsByOwner(): " + result);
          return resolve(result);
        }).catch(function (err) {
         // console.log(err);
          reject(err);
        });
      });
    });
  }

  /**	
   * To add new product. Only store owner will add a product
   * @param front id, name, product detail, price, quantity, image link
   * @returns nothing
   */
  public addNewProduct = function (_front_id, _name, _p_detail, _unit_price, _quantity, _image_link_ipfs) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        //console.log("addNewProduct call inside 1: Price: " + window.web3.toWei(_unit_price, 'ether'));
        return instance.addNewProduct(_front_id, _name, _p_detail, window.web3.toWei(_unit_price, 'ether'), _quantity, _image_link_ipfs,
          { from: window.web3.eth.accounts[0], gas: 500000 }).then(function (result) {
            //console.log("result after addProduct() Inside 2: " + result);
            return resolve(result);
          }).catch(function (err) {
            //console.error(err);
            return reject(err);
          });
      });
    });
  }
  /**	
   * Add new product Change by store owner and front id
   * @param store owner address, front id
   * @returns product count
   */
  public getProductCountByFront = function (_storeOwnerAddress, _front_id) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        //console.log("Result before getProductCountByFront() !");
        return instance.getProductCountByFront(_storeOwnerAddress, _front_id).then(function (result) {
          //console.log("Result after getProductCountByFront(): " + result);
          return resolve(result);
        }).catch(function (err) {
          //console.log(err);
          return reject(err);
        });
      });
    });
  }
  /**	
   * To get product details by storeaddress, front id and product id
   * @param store address, front id, product id
   * @returns product row
   */
  public getEachProductByOwner = function (_storeAddress, _front_id, _product_id) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        //console.log("getEachProductByOwner(): Inside1 :" +_storeAddress);
        //console.log("getEachProductByOwner(): Inside1 :" +_front_id);
        //console.log("getEachProductByOwner(): Inside1 :" +_product_id);
        return instance.getEachProductByOwner(_storeAddress, _front_id, _product_id).then(function (result) {
          //console.log("Result after getEachProductByOwner(): Inside2 " + result);
          return resolve(result);
        }).catch(function (err) {
          //console.log(err);
          return reject(err);
        });
      });
    });
  }

  /**	
   * To update a product. Only store owner can update 
   * @param store address, front id, product id
   * @returns product row
   */
  public updateProduct = function (_front_id, _product_id, _name, _p_detail, _unit_price, _quantity, _image_link_ipfs) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        return instance.updateProduct(_front_id, _product_id, _name, _p_detail,
          window.web3.toWei(_unit_price, 'ether'), _quantity, _image_link_ipfs,
          { from: window.web3.eth.accounts[0], gas: 800000, gwei: 1 })
          .then(function (result) {
            //console.log("result after updateProduct " + result);
            return resolve(result);
          }).catch(function (err) {
            //console.error(err);
            return reject(err);
          });
      });
    });
  }
  /**	
   * To delete a product. Only store owner can delete 
   * @param store address, front id, product id
   * @returns nothing
   */
  public deleteProduct = function (_front_id, _product_id) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        return instance.deleteProduct(_front_id, _product_id,
          { from: window.web3.eth.accounts[0], gas: 800000, gwei: 1 })
          .then(function (result) {
            //console.log("result after deleteProduct() " + result);
            return resolve(result);
          }).catch(function (err) {
            //console.error(err);
            reject(err);
          });
      });
    });
  }

  /**	
   * To add new Order. User will order an item
   * @param _seller, _front_id, _product_id, _unit_price, _order_quantity
   * @returns nothing
   */
  public orderItems = function (_seller, _front_id, _product_id, _unit_price_ether, _order_quantity) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        var amount = _unit_price_ether * _order_quantity; //window.web3.fromWei(_unit_price*_order_quantity, 'ether');
        var unit_price_wei= window.web3.toWei(_unit_price_ether,'ether');
        console.log("Total Amount in ether: " + amount);
        console.log("Price in wei:" + unit_price_wei);
        return instance.orderItems(_seller, _front_id, _product_id, unit_price_wei, _order_quantity,
          { from: window.web3.eth.accounts[0], value: window.web3.toWei(amount, 'ether'), gas: 1000000 })
          .then(function (result) {
            //console.log("result after orderItems " + result);
            return resolve(result);
          }).catch(function (err) {
            //console.error(err);
            return reject(err);
          });
      });
    });
  }
  /**	
   * To get Ordered count by storeOwner. This function is accessibel only for store owner
   * @param storeAddress hidden
   * @return order count
   */
  public getOrderCountBySeller = function () {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        return instance.getOrderCountBySeller().then(function (result) {
          //console.log("Result after getOrderCountBySeller(): " + result);
          return resolve(result);
        }).catch(function (err) {
          //console.log(err);
          return reject(err);
        });
      });
    });
  }
  /**	
   * To get order details by seller(default) and order id
   * @param store address, front id, product id
   * @returns order row
   */
  public getOrdersBySeller = function (_order_id) {
    let that = this;
    return new Promise((resolve, reject) => {
      that.marketInstance.then(function (instance) {
        return instance.getOrdersBySeller(_order_id).then(function (result) {
          //console.log("Result after getOrdersBySeller(): " + result);
          return resolve(result);
        }).catch(function (err) {
          //console.log(err);
          return reject(err);
        });
      });
    });
  }
}
