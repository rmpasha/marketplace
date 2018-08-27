import { Component, OnInit } from '@angular/core';
import { Product } from '../../entity/product';
import { ProductService } from '../product.service';
import { LoggingService } from '../../logging/logging.service';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { routePaths } from '../../route-paths';
import { Location } from '../../../../node_modules/@angular/common';
import { EthcontractService } from '../../ethcontract.service';
//import { Buffer } from '../../../../node_modules/buffer';
import { Buffer } from './buffer.js';

declare let require: any;

const IPFS = require('ipfs-api');

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
//var Buffer = require('buffer');
//var buffer: Buffer;

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {
  public title: string = "New Product";
  public subTitle: string = "* are required.";
  public product: Product = new Product(0, 0, '', '', 0, 0, '');
  public frontId: number;
  public fname: string;
  public storeOwner: string;


  private buffer: Buffer;
  public loading : boolean = false;
  constructor(private productService: ProductService, private ethContract: EthcontractService, 
    private router: Router,
    private route: ActivatedRoute,
    private loggingService: LoggingService,
    private location: Location) { }

  ngOnInit() {
    this.frontId = +this.route.snapshot.queryParamMap.get('fid');
    this.storeOwner = this.route.snapshot.queryParamMap.get('ac');
    this.fname = this.route.snapshot.queryParamMap.get('fname');
    this.product.name = this.route.snapshot.queryParamMap.get('name');
  }

  public addProduct(): void {
    let that = this;
    //onsole.log("Before addNewProduct() outside begin call ");
    that.ethContract.addNewProduct(that.frontId, that.product.name, that.product.description, that.product.price, that.product.quantity, this.product.imageUrl)
    .then(function (respone) {
      //console.log("After addNewFront() outside ending call");
      this.product = new Product(0, 0, "", "", 0, 0, "");
      this.router.navigate([routePaths.manageStoreFront], { queryParams: { ac: this.storeOwner, fid: this.frontId, fname: this.fname } });
    }).catch(function (error) {
    });
    //Products.push(new Product(Products.length+1,name,description,quantity,price,storeFront));
  }
/*
  addProduct() {
    //this.loggingService.add(`Add store front ${this.product.name}!`);
    this.productService.addProduct(
      this.product.name,
      this.product.description,
      this.product.price,
      this.product.quantity,
      this.product.imageUrl
    );
    this.product = new Product(0, 0, "", "", 0, 0, "");
    //this.router.navigate([routePaths.manageStoreFront], { queryParams: { ac: this.storeOwner, fid: this.frontId, fname: this.fname } });
    // this.Form.reset();
  }
  */
  onFileChanged(event) {
    this.loading = true;
    let that = this;
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      that.buffer = Buffer(reader.result);//.then(function(result) {
      //that.buffer=result;
      //console.log(that.buffer);
      //});
      ipfs.files.add(that.buffer, (error, result) => {
        //console.log('trying to add hash ' + result[0].hash);
        if (error) {
          //console.error(error);
          return;
        }
        this.product.imageUrl="https://ipfs.io/ipfs/"+result[0].hash;
        that.loading = false;
      });
    }
  }

/*
    onSubmit(event) {
      event.preventDefault();
      ipfs.files.add(this.buffer, (error, result) => {
        console.log('trying to add hash ' + result);
        if (error) {
          console.error(error);
          return;
        }
        console.log('trying to add hash ' + result[0].hash);
     
              this.simpleStorageInstance.set(result[0].hash, { from: this.state.account }).then((r) => {
                console.log('ifpsHash', this.state.ipfsHash)
                return this.setState({ ipfsHash: result[0].hash })
              })
          
      })
    }
*/
  goBack(){
    this.location.back();
  }
}

