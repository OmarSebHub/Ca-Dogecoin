import { Component, NgModule } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputNumberComponent } from '../../components/ticketing/input-number/input-number.component';
import { DogeCoinConversionService } from '../../services/doge-coin-conversion.service';
import { CommonModule} from '@angular/common';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-ticketing',
  imports: [
    ReactiveFormsModule,
    InputNumberComponent,
    CommonModule
  ],
  templateUrl: './ticketing.component.html',
  styleUrl: './ticketing.component.css',
})
export class TicketingComponent {
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

  constructor
  (
    private dogeCoinConversionService: DogeCoinConversionService
  ) {}

  ngOnInit(): void {
    this.subscription = this.ticketForm
      .get('ticketsNumber')
      ?.valueChanges.subscribe((value) => {
        if (value !== null && value !== undefined) {
          this.currentTicketsNumber = value;
          this.showInvoice = false;

          this.dogeCoinConversionService
            .transformTicketsToDogeCoin(value)
            .subscribe((res) => {
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
          .subscribe((res) => {
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
