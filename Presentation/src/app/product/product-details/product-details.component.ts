import { Component, OnInit } from '@angular/core';
import { Product } from '../../entity/product';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { LoggingService } from '../../logging/logging.service';
import { EthcontractService } from '../../ethcontract.service';
import { Location } from '../../../../node_modules/@angular/common';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  public product: Product = new Product(0, 0, '', '', 0, 0, '');
  public title: string = "Product Details";
  public subTitle: string = "List of product";
  public subTitle1: string = "Add new product";
  public storeOwner: string;
  public qtyOrder: number = 0;
  public total: number = 0;
  public imageUrl: string="";
  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private loggingService: LoggingService,
    private ethContract: EthcontractService,
    private location: Location) {
    this.loggingService.add('ProductDetailsComponent created!')
  }

  ngOnInit() {
    //this.loggingService.add('ProductDetailsComponent initialized!')
    this.product.id = +this.route.snapshot.queryParamMap.get('pid');
    this.product.frontId = +this.route.snapshot.queryParamMap.get('fid');
    this.product.name = this.route.snapshot.queryParamMap.get('pname');
    this.product.description = this.route.snapshot.queryParamMap.get('desc');
    this.product.price = +this.route.snapshot.queryParamMap.get('price');
    this.product.quantity = +this.route.snapshot.queryParamMap.get('qtyAvail');
    this.storeOwner = this.route.snapshot.queryParamMap.get('sid');
    this.subTitle = this.product.name;
    this.product.imageUrl=this.route.snapshot.queryParamMap.get('pic');
    console.log("imageUrl: " + this.product.imageUrl);
  }
  calcTotal() {
    //this.total=this.qtyOrder*this.product.price;
  }
  //getProductById(id: number): Product{
  //return this.productService.getProductById(id)
  //}

  goBack() {
    this.location.back();
  }

  buyProduct() {
    let that = this;
    that.ethContract.orderItems(that.storeOwner, this.product.frontId, this.product.id, this.product.price, this.qtyOrder).then(function (pDetails) {
      //pDetails: 0-name, 1-Description, 2-price, 3-quantity, 4- image url
      //console.log("Loop: " + i+" " + JSON.stringify(that.products));
      // alert(this.qtyOrder);
     // this.location.back();
    });
  }

}
