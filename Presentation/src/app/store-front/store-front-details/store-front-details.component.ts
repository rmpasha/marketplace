import { Component, OnInit } from '@angular/core';
import { LoggingService } from '../../logging/logging.service';
import { Product } from '../../entity/product';
import { ProductService } from '../../product/product.service';
import { Products } from '../../mock/mock-products';
import { EthcontractService } from '../../ethcontract.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '../../../../node_modules/@angular/common';

@Component({
  selector: 'app-store-front-details',
  templateUrl: './store-front-details.component.html',
  styleUrls: ['./store-front-details.component.css']
})
export class StoreFrontDetailsComponent implements OnInit {
  public products: Product[]=[];
  public product: Product = new Product(0,0,"", "", 0, 0,"");
  public title : string ="Products in sale";
  public frontId: number;
  public frontName: string;
  public storeOwner: string;
  private intWei: number = 1000000000000000000;
 
  constructor(private loggingSevice: LoggingService, private ethContract: EthcontractService, private location: Location,
    private route : ActivatedRoute) { 
      this.frontId = +this.route.snapshot.queryParamMap.get("fid");
      this.frontName = this.route.snapshot.queryParamMap.get("fname");
      this.storeOwner = this.route.snapshot.queryParamMap.get("sid");
    }

  ngOnInit() {
    this.getProductByStoreFront();
  }

  public getProductByStoreFront() {
    //Get Product By Store Front
    let that = this;
    that.products=[];
    //console.log("1. Before getProductByStoreFront() outside begin call ");
    that.ethContract.getProductCountByFront(that.storeOwner, that.frontId).then(function (productCout:number) {
      //console.log("2. ouside call Front Count: " + productCout);
      if (productCout != 0) {
        for (var i = 0; i < productCout; i++) {
          that.ethContract.getEachProductByOwner(that.storeOwner, that.frontId, i).then(function (pDetails) {
            //pDetails: 0-name, 1-Description, 2-price, 3-quantity, 4- image url
           // console.log("Outside Loop: " + i+" " + JSON.stringify(that.products));
            that.products.push(new Product(that.products.length, that.frontId, pDetails[0], pDetails[1], (+pDetails[2]) / that.intWei, pDetails[3], pDetails[4]));
           // console.log("Image URL: " + pDetails[4]);
          });
        }
      }
    }).catch(function (error) {
      console.log(error);
    });
  }
  goBack() {
    this.location.back();
  }
}
