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
  list_of_payments = [];
  registerPaymentSubscription;
  minDate = new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000);
  minDateString = this.minDate.toISOString().split('T')[0];

  constructor(
    private registerPaymentService: RegisterPaymentService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.registerPaymentSubscription = this.registerPaymentService.payment$.subscribe(
      function subscriber(observer) {
        this.list_of_payments.push(observer);
        this.updateTotal();
      }.bind(this)
    );

    this.registerPaymentService.total$;
  }

  updateTotal() {
    var total = 0;
    var new_array = this.list_of_payments;
    for (let payment of new_array) {
      total += Number(payment.amount);
    }
    this.list_of_payments = new_array;
    this.registerPaymentService.total$.next(total);
  }

  deletePayment(event) {
    var elementID = event.target.name;
    var new_array = this.list_of_payments;
    new_array.forEach(
      function remove(payment, i) {
        if (payment.id === elementID) {
          new_array.splice(i, 1);
        }
      }.bind(this)
    );
    this.updateTotal();
  }

  deletePaymentMock(event) {
    console.log(event.target.name);
  }

  updateField(event, field) {
    switch (field) {
      case 'description':
        this.updateDescription(event, field);
        break;
      case 'amount':
        this.updateAmount(event, field);
        break;
      default:
        console.log('Nothing was updated');
        break;
    }
  }

  updateDescription(event, field) {
    let _id = '_' + event.target.id.split('_')[1];
    let _newValue = event.target.value;

    this.list_of_payments.forEach(
      function (payment, index) {
        if (payment.id === _id) {
          if (_newValue.length <= 4 || _newValue.length > 50) {
            console.log('invalid value');
            return false;
          } else {
            this.list_of_payments[index][field] = _newValue;
            return true;
          }
        }
      }.bind(this)
    );
  }

  updateAmount(event, field) {
    let _id = '_' + event.target.id.split('_')[1];
    let _newValue = Number(event.target.value).toFixed(2);

    this.list_of_payments.forEach(
      function (payment, index) {
        if (payment.id === _id) {
          this.list_of_payments[index][field] = _newValue;
          this.updateTotal();
          return true;
        }
      }.bind(this)
    );
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
