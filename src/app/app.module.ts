import { BrowserModule } from '@angular/platform-browser';
import { NgModule, } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RegisterPaymentComponent } from './register-payment/register-payment.component';
import { PaymentsComponent } from './payments/payments.component';
import { TotalComponent } from './total/total.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterPaymentComponent,
    PaymentsComponent,
    TotalComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
