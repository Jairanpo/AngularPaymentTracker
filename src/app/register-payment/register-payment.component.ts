import {
  Component,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { RegisterPaymentService } from 'src/app/services/register-payment.service'

/*------------------------------------------------------------------- */
@Component({
  selector: 'register-payment',
  templateUrl: './register-payment.component.html',
  styleUrls: ['./register-payment.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterPaymentComponent implements OnInit {
  minDate = new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000));
  minDateString = this.minDate.toISOString().split('T')[0];

  options = {
    description: "description...",
    amount: {
      placeholder: "amount",
      value: ""
    }
  }

  constructor(private registerPaymentService: RegisterPaymentService) {
  };

  paymentRegistrationForm = new FormGroup(
    {
      description: new FormControl("",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50)
        ]),
      amount: new FormControl(null,
        [
          Validators.required,
          Validators.pattern(/[0-9](.{1}[0-9])?/)
        ]),
      date: new FormControl('',
        [
          Validators.required
        ])
    }
  )


  onSubmit() {
    let amount = Number(this.paymentRegistrationForm.controls.amount.value).toFixed(2)
    let _id = this.createID()
    this.registerPaymentService.payment$.next(
      {
        description: this.paymentRegistrationForm.controls.description.value,
        amount: amount,
        date: this.paymentRegistrationForm.controls.date.value,
        id: _id,
        id_description: 'de' + _id,
        id_amount: 'am' + _id,
        id_date: "da" + _id
      });
  }

  createID() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  numberOnly(event): boolean {
    var currentAmount = !this.paymentRegistrationForm.value.amount ? "" : this.paymentRegistrationForm.value.amount
    const charCode = (event.which) ? event.which : event.keyCode;
    const pattern = RegExp(/\./)

    if (charCode === 46 && !pattern.test(currentAmount)) {
      return true;
    }
    else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  ngOnInit() {

  }



}
