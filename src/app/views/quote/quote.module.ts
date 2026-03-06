import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { QuoteComponent } from '../quote/quote.component';
import { QuoteRoutingModule } from './quote-routing.module';

@NgModule({
  declarations: [QuoteComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    QuoteRoutingModule
  ],
  exports: [QuoteComponent]
})
export class QuoteModule { }
