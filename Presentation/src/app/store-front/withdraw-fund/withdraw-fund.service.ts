import { Injectable } from '@angular/core';
import { LoggingService } from '../../logging/logging.service';

@Injectable({
  providedIn: 'root'
})
export class WithdrawFundService {

  constructor(private loggingService: LoggingService) { }

  withdrawFund(amount: number){
    this.loggingService.add("Withdrawn Amount: "+amount);
  }
}
