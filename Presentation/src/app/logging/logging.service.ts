import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  messages: string[] =[];

  add(message:string){
    // this.messages.unshift( message);
    // this.messages.unshift(new Date() +":"+ message);
  }

  clear(){
    this.messages =[];
  }
  constructor() { }
}
