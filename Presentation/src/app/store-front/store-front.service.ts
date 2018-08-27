import { Injectable } from '@angular/core';
import { LoggingService } from '../logging/logging.service';
import { StoreFronts } from '../mock/mock-store-front';
import { StoreFront } from '../entity/store-front';

@Injectable({
  providedIn: 'root'
})
export class StoreFrontService {


  constructor(private loggingService : LoggingService) { }

  getAllStoreFront(): StoreFront[]{
    return StoreFronts;
  }

  getStoreFrontById(id): StoreFront{
    return StoreFronts.find(a=>a.id ==id);
  }

  getStoreFrontByOwner(owner : string) : StoreFront[]{
    return StoreFronts.filter(a=>a.owner ==owner);
  }

  addNewStoreFront(owner:string,name : string): void{
    StoreFronts.push({owner:owner,name:name,id:StoreFronts.length + 2});
  }

}
