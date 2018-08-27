import { Component, OnInit } from '@angular/core';
import { LoggingService } from '../logging/logging.service';
import { Admin } from '../entity/admin';
import { AdministratorService } from '../administrator/administrator.service';
import { EthcontractService } from '../ethcontract.service';

@Component({
  selector: 'app-contract-owner',
  templateUrl: './contract-owner.component.html',
  styleUrls: ['./contract-owner.component.css']
})

export class ContractOwnerComponent implements OnInit {
  public admin: Admin = { address: "" };
  public admins: Admin[];
  public title: string = "Contract Owner";
  public subTitle: string = "List of administrators";
  public subTitle1: string = "Add an address to administrator list";
  constructor(private adminService: AdministratorService,
    private loggingService: LoggingService,
    private ethContract: EthcontractService) { }

  ngOnInit() {
    this.loggingService.add("ContractOwnerComponent initialized!");
    this.getAdmins();
  }

  getAdmins(): void {

    //this.loggingService.add("init getAdmins()!");
    let that = this;
    that.admins = [];
    // this.admins = this.adminService.getAllAdministrator();
    that.ethContract.getAdminList().then(function (adminList: Admin[]) {
      //that.loggingService.add(JSON.stringify(adminList));
      //that.loggingService.add("getAdmins count : "+ adminList.length);
      that.admins = adminList;
    }).catch(function (error) {
      //that.loggingService.add("getAdmins error : "+error);
    });
    // this.subTitle = "Approved .tores";
  }

  // addAdmin(): void {
  //   let that = this;
  //   that.ethContract.addNewAdmin(this.admin.address).then(function (respone) {
  //     that.getAdmins();
  //   }).catch(function (error) {
  //   });
  // }
  addAdmin(): any {
    let that = this;
    return new Promise((resolve, reject) => {
      that.ethContract.addNewAdmin(this.admin.address).then(function (respone) {
        //that.getAdmins();
        return resolve(respone);
      });
    }).then(function(){
        setTimeout(function(){
        that.getAdmins();
        }, 5000);
    });
  }
}