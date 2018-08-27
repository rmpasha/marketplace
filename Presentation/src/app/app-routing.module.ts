import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {AdministratorComponent} from './administrator/administrator.component';
import {ContractOwnerComponent} from './contract-owner/contract-owner.component';
import {ShopperComponent} from './shopper/shopper.component';
import {StoreOwnerComponent} from './store-owner/store-owner.component';
import { StoreFrontDetailsComponent } from './store-front/store-front-details/store-front-details.component';
import { ProductDetailsComponent } from './product/product-details/product-details.component';
import { NewProductComponent } from './product/new-product/new-product.component';
import { EditProductComponent } from './product/edit-product/edit-product.component';
import { DeleteProductComponent } from './product/delete-product/delete-product.component';
import { WithdrawFundComponent } from './store-front/withdraw-fund/withdraw-fund.component';
import { ManageStoreFrontComponent } from './store-front/manage-store-front/manage-store-front.component';
import { StoreApplicationComponent } from './store-application/store-application.component';
import {routePaths} from './route-paths';

 const routes: Routes = [
  { path: '', redirectTo: '/administrator', pathMatch: 'full' },
  { path: routePaths.administrator, component: AdministratorComponent },
  { path: routePaths.contractOwner, component: ContractOwnerComponent },
  { path: routePaths.shopper, component: ShopperComponent },
  { path: routePaths.storeOwner, component: StoreOwnerComponent },
  { path: routePaths.storeFrontDetails, component: StoreFrontDetailsComponent },
  { path: routePaths.manageStoreFront, component: ManageStoreFrontComponent },
  { path: routePaths.productDetails, component: ProductDetailsComponent },
  { path: routePaths.newProduct, component: NewProductComponent },
  { path: routePaths.editProduct, component: EditProductComponent },
  { path: routePaths.deleteProduct, component: DeleteProductComponent },
  { path: routePaths.withdrawFund, component: WithdrawFundComponent },
  { path: routePaths.storeApplication, component: StoreApplicationComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }



