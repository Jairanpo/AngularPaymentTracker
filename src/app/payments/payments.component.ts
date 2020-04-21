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

  updateField(event, field) {
    switch (field) {
      case 'description':
        this.updateDescription(event, field);
        break;
      case 'amount':
        this.updateAmount(event, field);
        break;
      case 'date':
        this.updateDate(event, field);
        break;
      default:
        console.log('Nothing was updated');
        break;
    }
  }

  updateDescription(event, field) {
    let _id = '_' + event.target.id.split('_')[1];
    let _newValue = event.target.value;

    if (this.payments[_id]) {
      if (_newValue.length > 4 && _newValue.length < 50) {
        this.payments[_id].description = _newValue;
      }
    }
  }

  updateAmount(event, field) {
    let _id = '_' + event.target.id.split('_')[1];
    let _newValue = Number(event.target.value).toFixed(2);

    if (this.payments[_id]) {
      this.payments[_id].amount = _newValue;
    }
    this.updateTotal();
  }

  updateDate(event, field) {
    let _id = '_' + event.target.id.split('_')[1];
    let _newValue = event.target.value;

    if (this.payments[_id]) {
      this.payments[_id].date = _newValue;
    }
  }

  numberOnly(event): boolean {
    var currentAmount = event.target.value.amount;
    const charCode = event.which ? event.which : event.keyCode;
    const pattern = RegExp(/\./);
    if (charCode === 46 && !pattern.test(currentAmount)) {
      return true;
    } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
