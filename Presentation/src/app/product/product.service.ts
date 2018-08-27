import { Injectable } from '@angular/core';
import { Product } from '../entity/product';
import { Products } from '../mock/mock-products';
import { LoggingService } from '../logging/logging.service';
import { isNgTemplate } from '../../../node_modules/@angular/compiler';
import { EthcontractService } from '../ethcontract.service';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private frontId: number;

  constructor(private loggingSevice: LoggingService, private ethContract: EthcontractService, 
    private route : ActivatedRoute) { 
      this.frontId = +this.route.snapshot.queryParamMap.get("fid");
    }
  
  public addProduct(name: string, description: string, price: number, quantity: number, imageUrl: string): void {
    let that = this;
    //onsole.log("Before addNewProduct() outside begin call ");
    that.ethContract.addNewProduct(this.frontId, name, description, price, quantity, imageUrl)
    .then(function (respone) {
      //console.log("After addNewFront() outside ending call");
      //this.router.navigate([routePaths.manageStoreFront], { queryParams: { ac: this.storeOwner, fid: this.frontId, fname: this.fname } });
    }).catch(function (error) {
    });
    //Products.push(new Product(Products.length+1,name,description,quantity,price,storeFront));
  }

  public getProductById(id: number): Product {

    var product = Products.find(x => x.id === id);

    return new Product(product.id,
      product.frontId,
      product.name,
      product.description,
      product.quantity,
      product.price,
      product.imageUrl);
  }

  public editProductField(id: number, name: string, description: string, quantity: number, price: number, storeFront: string, imageUrl: string) {

    var product = Products.find(x => x.id === id);

    product.name = name;
    product.description = description;
    product.price = price;
    product.quantity = quantity;
    product.imageUrl = imageUrl;

    this.loggingSevice.add(description);

  }
  public editProduct(updatedProduct: Product) {

    var product = Products.find(x => x.id === updatedProduct.id);

    product.name = updatedProduct.name;
    product.description = updatedProduct.description;
    product.price = updatedProduct.price;
    product.quantity = updatedProduct.quantity;
    product.imageUrl = updatedProduct.imageUrl;

    this.loggingSevice.add(updatedProduct.description);

  }

  public deleteProduct(id: number) {
    Products.forEach((item, index) => {
      if (item.id === id) Products.splice(index, 1);
    });
  }

  public buyProduct(id: number, quantity: number) {

  }
}
