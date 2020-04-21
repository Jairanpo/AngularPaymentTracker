import { Component, OnInit, OnDestroy } from '@angular/core';
import { RegisterPaymentService } from 'src/app/services/register-payment.service';

@Component({
  selector: 'total',
  templateUrl: './total.component.html',
  styleUrls: ['./total.component.sass']
})
export class TotalComponent implements OnInit, OnDestroy {
  total: Number
  totalStreamSubscription;
  constructor(private registerPaymentService: RegisterPaymentService) { }

  ngOnInit(): void {
    this.totalStreamSubscription = this.registerPaymentService.total$.subscribe(
      function subscription(observer) {
        this.total = observer.toFixed(2);
      }.bind(this))

  }

  ngOnDestroy() {
    this.totalStreamSubscription.unsubscribe()
  }

}
