import { Component, OnInit } from '@angular/core';
import { LoggingService } from '../../logging/logging.service';
import { Product } from '../../entity/product';
import { ProductService } from '../../product/product.service';
import { EthcontractService } from '../../ethcontract.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '../../../../node_modules/@angular/common';

@Component({
  selector: 'app-manage-store-front',
  templateUrl: './manage-store-front.component.html',
  styleUrls: ['./manage-store-front.component.css']
})
export class ManageStoreFrontComponent implements OnInit {
  public products: Product[] = [];
  public product: Product = new Product(0, 0, "", "", 0, 0, "");
  //Pass these two values
  public frontId: number = 0;     //Store Front Id
  public fname: string;           //Store Front name
  public storeOwner: string;
  public title: string = "Store Front";
  public subTitle: string = "List of products";
  public subTitle1: string = "Add new products";
  private intWei: number = 1000000000000000000;

  constructor(private productService: ProductService, private ethContract: EthcontractService,
    private loggingService: LoggingService,
    private location: Location,
    //Get Query String
    private route: ActivatedRoute) {
    this.storeOwner = this.route.snapshot.queryParamMap.get("ac");
    this.frontId = +this.route.snapshot.queryParamMap.get("fid");
    this.fname = this.route.snapshot.queryParamMap.get("fname");
    this.title = this.route.snapshot.queryParamMap.get("fname");
  }

  ngOnInit() {
    this.getProductByStoreFront();
  }

  public getProductByStoreFront() {
    //Get Product By Store Front
    let that = this;
    that.products=[];
    //console.log("Before getProductByStoreFront() outside begin call ");
    that.ethContract.getProductCountByFront(that.storeOwner, that.frontId).then(function (productCout:number) {
      //console.log("2. Front Count: " + productCout);
      if (productCout != 0) {
        for (var i = 0; i < productCout; i++) {
          that.ethContract.getEachProductByOwner(that.storeOwner, that.frontId, i).then(function (pDetails) {
            //pDetails: 0-name, 1-Description, 2-price, 3-quantity, 4- image url
            //console.log("Loop: " + i+" " + JSON.stringify(that.products));
            that.products.push(new Product(that.products.length, that.frontId, pDetails[0], pDetails[1], (+pDetails[2]) / that.intWei, pDetails[3], pDetails[4]));
          });
        }
      }
    }).catch(function (error) {
      console.log(error);
    });
  }
  public deleteProduct(productId) {
    let that = this;
    console.log("Delete Product id" + productId)
    that.ethContract.deleteProduct(that.frontId, productId).then(function (result) {
      console.log("Deleted Product id" + productId)
      that.products = [];
      setTimeout(function(){
        that.getProductByStoreFront();
      }, 6000);
    }).catch(function (error) {
      console.log(error);
    });
  }
  goBack() {
    this.location.back();
  }
}


// import { Component, OnInit } from '@angular/core';
// import { LoggingService } from '../../logging/logging.service';
// import { Product } from '../../entity/product';
// import { ProductService } from '../../product/product.service';

// @Component({
//   selector: 'app-store-front-details',
//   templateUrl: './store-front-details.component.html',
//   styleUrls: ['./store-front-details.component.css']
// })
// export class StoreFrontDetailsComponent implements OnInit {
//   public products: Product[];
//   public product: Product = new Product(0,"", "", 0, 0,"");
//   public storeFrontId : string = "1";
//   public title : string ="Store Front";
//   public subTitle : string ="List of product";
//   public subTitle1 : string ="Add new product";

//   constructor(private productService: ProductService,
//     private loggingService: LoggingService) { }

//   ngOnInit() {
//    this.getProducts();
//   }
//   getProducts(){
//     this.products = this.productService.getProductByStoreFront("");

//   }
// }
