import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ContractOwnerComponent } from './contract-owner/contract-owner.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { StoreOwnerComponent } from './store-owner/store-owner.component';
import { ShopperComponent } from './shopper/shopper.component';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { LoggingComponent } from './logging/logging.component';


import { LoggingService } from './logging/logging.service';
import { StoreFrontDetailsComponent } from './store-front/store-front-details/store-front-details.component';
import { ProductDetailsComponent } from './product/product-details/product-details.component';
import { NewProductComponent } from './product/new-product/new-product.component';
import { EditProductComponent } from './product/edit-product/edit-product.component';
import { DeleteProductComponent } from './product/delete-product/delete-product.component';
import { WithdrawFundComponent } from './store-front/withdraw-fund/withdraw-fund.component';
import { ManageStoreFrontComponent } from './store-front/manage-store-front/manage-store-front.component';
import { StoreApplicationComponent } from './store-application/store-application.component';
@NgModule({
  declarations: [
    AppComponent,
    ContractOwnerComponent,
    AdministratorComponent,
    StoreOwnerComponent,
    ShopperComponent,
    LoggingComponent,
    StoreFrontDetailsComponent,
    ProductDetailsComponent,
    NewProductComponent,
    EditProductComponent,
    DeleteProductComponent,
    WithdrawFundComponent,
    ManageStoreFrontComponent,
    StoreApplicationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [LoggingService],
  bootstrap: [AppComponent]
})
export class AppModule { }

