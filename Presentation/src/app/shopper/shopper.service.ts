import { Injectable } from '@angular/core';
import { StoreFront } from '../entity/store-front';
import { StoreFrontService } from '../store-front/store-front.service';

@Injectable({
  providedIn: 'root'
})
export class ShopperService {

  constructor(private storeFrontService: StoreFrontService) { }

  getAllStoreFronts() : StoreFront[]{
    return this.storeFrontService.getAllStoreFront();
  }
  
}
