import { Component, OnInit } from '@angular/core';
import { Product } from '../../entity/product';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggingService } from '../../logging/logging.service';
import { Location } from '../../../../node_modules/@angular/common';
import { routePaths } from '../../route-paths';
import { EthcontractService } from '../../ethcontract.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  public product: Product = new Product(0, 0, '', '', 0, 0, '');
  public storeOwner: string;
  public frontId: number;
  public fname: string;
  public productId: number;
  public title: string = "Edit Product";
  private intWei: number = 1000000000000000000;
  //  public subTitle : string ="List of product";
  // public subTitle1 : string ="Add new product";
  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private loggingService: LoggingService,
    private router: Router,
    private location: Location,
    private ethContract: EthcontractService) {
    this.loggingService.add('EditProductComponent created!')
  }

  ngOnInit() {
    this.loggingService.add('EditProductComponent initialized!')
    this.storeOwner = this.route.snapshot.queryParamMap.get('ac');
    this.frontId = +this.route.snapshot.queryParamMap.get('fid');
    this.fname = this.route.snapshot.queryParamMap.get('fname');
    this.productId = +this.route.snapshot.queryParamMap.get('pid');
    //this.product = this.productService.getProductById(this.productId);
    this.getAProduct();
    //    this.loggingService.add(""+this.productId);
  }
  getAProduct(): void {
    let that = this;
    console.log("getProduct outside 1:")
    that.ethContract.getEachProductByOwner(this.storeOwner, this.frontId, this.productId).then(function (result) {
      console.log("getProduct outside 2:" + result);
      that.product.name = result[0];
      that.product.description = result[1];
      that.product.price = result[2] / that.intWei;
      that.product.quantity = result[3];
      that.product.imageUrl = result[4];
    }).catch(function (error) {
    });
  }
  goBack(): void {
    this.location.back();
  }

  editProduct(): void {
    //console.log("updated product price: "+ this.product.price)
    //this.productService.editProduct(this.product);
    let that = this;

    that.ethContract.updateProduct(that.frontId, that.productId, that.product.name,
      that.product.description, that.product.price, that.product.quantity,
      that.product.imageUrl).then(function (result) {

        this.router.navigate([routePaths.storeFrontDetails], { queryParams: { ac: this.storeOwner, fid: this.frontId, fname: this.fname } });
      }).catch(function (error) {
      });
  }
}
