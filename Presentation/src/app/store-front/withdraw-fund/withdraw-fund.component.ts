import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { LoggingService } from '../../logging/logging.service';
import { WithdrawFundService } from './withdraw-fund.service';
import { Location } from '../../../../node_modules/@angular/common';
import { EthcontractService } from '../../ethcontract.service';

@Component({
  selector: 'app-withdraw-fund',
  templateUrl: './withdraw-fund.component.html',
  styleUrls: ['./withdraw-fund.component.css']
})
export class WithdrawFundComponent implements OnInit {

  //public address : string ="0x0";
  public fundAvailable : number = 0.0;
  public amount : number;
  public storeOwner: string;
  public storeName: string;
  public title : string ="Withdraw fund";
  public subTitle : string ="Fund available to withdraw";

  constructor(private withdrawFundService: WithdrawFundService,
              private route: ActivatedRoute,
              private loggingService: LoggingService,
              private location: Location,
              private ethContract:EthcontractService) { }

  ngOnInit() {
    //this.address = this.route.snapshot.queryParamMap.get("id");
    this.storeName = this.route.snapshot.queryParamMap.get("sname");
    this.storeOwner = this.route.snapshot.queryParamMap.get("sid");
    this.getMaxAmountCanWithdraw();
  }

  withdrawFund(){
    //this.withdrawFundService.withdrawFund(this.amount);
    //this.location.back();
    let that = this;
    //console.log("Before withdrawAmount() outside begin call "+that.amount);
    that.ethContract.withdrawAmount(that.amount).then(function (result) {
      that.getMaxAmountCanWithdraw();
      //console.log("Out side end calle " + result);
      //that.fund = 5.5;
    });
  }
  getMaxAmountCanWithdraw() {
    let that = this;
    //console.log("Before getMaxAmountCanWithdraw() outside begin call ");
    that.ethContract.getMaxAmountCanWithdraw().then(function (result:number) {
      //console.log("Max amount can be withdrawn: " + result);
      that.fundAvailable=result;
      //that.fund = 5.5;
    });
  }
  goBack() {
    this.location.back();
  }
}
