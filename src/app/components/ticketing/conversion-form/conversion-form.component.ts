import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { DogeCoinConversionService } from '../../../services/doge-coin-conversion.service';
import { InputNumberComponent } from '../input-number/input-number.component';

@Component({
  selector: 'app-conversion-form',
  imports: [ReactiveFormsModule, InputNumberComponent, CommonModule],
  templateUrl: './conversion-form.component.html',
  styleUrl: './conversion-form.component.css',
})
export class ConversionFormComponent {
  ticketForm = new FormGroup({
    ticketsNumber: new FormControl<number>(0, [
      Validators.required,
      Validators.min(1),
    ]),
  });

  dogeCoinsToPay: number | null = 0;
  ticketsNumber: number = 0;
  currentTicketsNumber: number = 0;
  showInvoice: boolean = false;

  ticketsPriceInDogeCoin: number = 0;

  private subscription!: Subscription | undefined;

  constructor(private dogeCoinConversionService: DogeCoinConversionService) {}

  ngOnInit(): void {
    this.initConvertTicketsToDogeOnChange();
  }

  initConvertTicketsToDogeOnChange(): void {
    this.subscription = this.ticketForm
      .get('ticketsNumber')
      ?.valueChanges.subscribe(value => {
        if (value !== null && value !== undefined) {
          this.currentTicketsNumber = value;
          this.showInvoice = false;

          this.dogeCoinConversionService
            .transformTicketsToDogeCoin(value)
            .subscribe(res => {
              this.ticketsPriceInDogeCoin = res;
            });
        }
      });
  }

  onSubmitForm() {
    if (this.ticketForm.valid) {
      const ticketsNumberFieldVal = this.ticketForm.value.ticketsNumber;
      if (
        ticketsNumberFieldVal !== null &&
        ticketsNumberFieldVal !== undefined
      ) {
        this.dogeCoinConversionService
          .transformTicketsToDogeCoin(ticketsNumberFieldVal)
          .subscribe(res => {
            this.ticketsNumber = ticketsNumberFieldVal;
            this.dogeCoinsToPay = res;
            this.showInvoice = true;
          });
      }
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
