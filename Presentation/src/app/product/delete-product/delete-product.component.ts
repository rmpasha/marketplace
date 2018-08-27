import { Component, OnInit } from '@angular/core';
import { Product } from '../../entity/product';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { LoggingService } from '../../logging/logging.service';
import { Location } from '../../../../node_modules/@angular/common';
import { routePaths } from '../../route-paths';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.css']
})
export class DeleteProductComponent implements OnInit {
  public product: Product = new Product(0, 0, '', '', 0, 0, '');
  public storeFrontId: string;
  public productId: number;
  public title: string = "Delete Product";
  public subTitle: string = "Are you sure you want to delete product?";
  public subTitle1: string = "Add new product";
  constructor(private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private loggingService: LoggingService,
    private location: Location) {
    this.loggingService.add('DeleteProductComponent created!')
  }

  ngOnInit() {
    this.loggingService.add('DeleteProductComponent initialized!')
    this.storeFrontId = this.route.snapshot.queryParamMap.get('storeFront');
    this.productId = +this.route.snapshot.queryParamMap.get('id');
    this.product = this.productService.getProductById(this.productId);
    this.loggingService.add("" + this.productId);
  }

  deleteProduct(): void {

    this.loggingService.add('DeleteProductComponent requested!' + this.productId)

    this.productService.deleteProduct(this.productId);

    this.router.navigate([routePaths.storeFrontDetails], { queryParams: { id: this.storeFrontId } });

  }

  goBack() {
    this.location.back();
  }

}
