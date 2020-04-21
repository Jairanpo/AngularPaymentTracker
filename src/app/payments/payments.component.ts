import {
  Component,
  OnInit,
  OnDestroy,
  DoCheck,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { RegisterPaymentService } from 'src/app/services/register-payment.service';
import { FormControl } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'payments-list',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentsComponent implements OnInit, DoCheck, OnDestroy {
  payments = {};
  list_of_ids = [];
  registerPaymentSubscription;
  minDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
  minDateString = this.minDate.toISOString().split('T')[0];

  constructor(
    private registerPaymentService: RegisterPaymentService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.registerPaymentSubscription = this.registerPaymentService.payment$.subscribe(
      function subscriber(observer) {
        let _id = observer.id;
        this.payments[_id] = observer;
        this.updateTotal();
      }.bind(this)
    );

    this.registerPaymentService.total$;
  }

  updateTotal() {
    var total = 0;

    for (let pay in this.payments) {
      total += Number(this.payments[pay].amount);
    }
    this.registerPaymentService.total$.next(total);
  }

  deletePayment(event) {
    let id = event.target.id;
    delete this.payments[id];
    this.updateTotal();
  }

  ngDoCheck() {
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy() {
    this.registerPaymentSubscription.unsubscribe();
  }

  openEditSettings(event) {
    console.log(event.target.id);
  }
}
