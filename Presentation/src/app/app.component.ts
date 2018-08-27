import { Component } from '@angular/core';
import { EthcontractService } from './ethcontract.service'
import { advanceActivatedRoute } from '@angular/router/src/router_state';
import { Router } from "@angular/router";
import { UserService, UserRole } from './user.service';
import {routePaths} from './route-paths';
import { LoggingService } from './logging/logging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Rajmahar online marketplace';
  account = '0x0';
  balance = '0 ETH';
  userRole = UserRole.Shopper;
  userRoles = UserRole;
  storeOwner="";
  constructor(private ethContractService: EthcontractService,
    private router: Router,
    private userService: UserService,
    private loggingService: LoggingService) {
    this.initAndDisplayAccount();
    //Refresh account and balance once changed in wallet address in MetaMask or MIST
    //let curAccount = window.web3.eth.accounts[0];
    this.scanCurrentUser();
  }

  initAndDisplayAccount = function () {
    let that = this;

    this.ethContractService.getAccountInfo().then(function (acctInfo) {
      //console.log("Acct Infor: " + acctInfo);
      that.account = acctInfo.fromAccount;
      that.balance = acctInfo.balance;
      that.storeOwner=that.account; 
      that.identifyAndRouteUser(that.account);

      // if(scan){
      //   this.scanCurrentUser();
      // }
    });

  }

  scanCurrentUser(){
    setInterval(() => {
      if(this.ethContractService.getCurrentAccount() !== this.account) {
        this.loggingService.clear();

        this.initAndDisplayAccount();

        //  this.identifyAndRouteUser(this.account);
      }
    },200);
  }

  identifyAndRouteUser = function (account) {
    let that = this;
    var role = this.userService.authorizeUser().then(function (userRole) {
      //that.loggingService.add("identifyAndRouteUser resolve");
      //that.loggingService.add("role : " + JSON.stringify(userRole));
      that.userRole = +userRole.role;
      //console.log(that.userRole);
      switch (+userRole.role) {
        case UserRole.Administrator: {
          that.loggingService.add("Administrator : " + role);
          that.router.navigate([routePaths.administrator],{queryParams:{ac:account}});
          break;
        }
        case UserRole.ContractOwner: {
          that.loggingService.add("ContractOwner : " + role);
          that.router.navigate([routePaths.contractOwner],{queryParams:{ac:account}});
          break;
        }
        case UserRole.StoreOwner: {
          that.loggingService.add("StoreOwner : " + role);
          that.router.navigate([routePaths.storeOwner],{queryParams:{ac:account}});
          break;
        }
        case UserRole.Shopper: {
          that.loggingService.add("Shopper : " + role);
          that.router.navigate([routePaths.shopper],{queryParams:{ac:account}});
          break;
        }
        default: {
          alert("Please connect using meta mask")
          // that.loggingService.add("default : " + role);
          // that.router.navigate([routePaths.shopper],{queryParams:{ac:account}});
          break;
        }
      }
    }).catch(function (error) {
    });

  }
}
