import { Injectable } from '@angular/core';
import { Administrators } from '../mock/mock-administrator';
import { Admin } from '../entity/admin';
// import { Store } from '../entity/store';
import { LoggingService } from '../logging/logging.service';

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {

  // private stores : Store[];

  constructor(private loggingService : LoggingService) { }

  getAllAdministrator(){
    return Administrators;
  }

  // getAdministratorById(id){
  //   return Administrators.find(a=>a.address ==id);
  // }

  addNewAdministrator(address:string){
    Administrators.push({address:address});
  }

  // removeAdministrator(){

  // }
}
