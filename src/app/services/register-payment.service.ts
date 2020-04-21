import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterPaymentService {
  payment$ = new Subject<object>()
  total$ = new Subject<number>()
  

  constructor() { }

}
