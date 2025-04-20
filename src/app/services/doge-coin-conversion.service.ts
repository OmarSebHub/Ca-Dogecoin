import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Icrypto } from '../models/cryptoCurrency';
import { CoinCapApiService } from './coin-cap-api.service';

@Injectable({
  providedIn: 'root',
})
export class DogeCoinConversionService {
  private ticketPrice = 4;

  constructor(private coinCapApiService: CoinCapApiService) {}

  public transformTicketsToDogeCoin(ticketsNumber: number): Observable<number> {
    return this.coinCapApiService.getCoinById('dogecoin').pipe(
      map(res => {
        return res?.priceUsd ? this.dogeCoinsToPayTotal(res, ticketsNumber) : 0;
      }),
      catchError(error => {
        console.error(
          'Error transforming tickets to dogecoin. Details: ',
          error
        );

        return of(0);
      })
    );
  }

  private dollarToDogeCoin(dogeCoinPrice: number) {
    const dollar = 1;

    return dollar / dogeCoinPrice;
  }

  private dogeCoinsToPayTotal(res: Icrypto, ticketsNumber: number) {
    const dogecoinPrice = Number(res.priceUsd);
    const dogecoinsPerDollar = this.dollarToDogeCoin(dogecoinPrice);
    const ticketsTotalPrice = ticketsNumber * this.ticketPrice;
    const dogecoinsToPay =
      ticketsNumber < 2
        ? ticketsTotalPrice * dogecoinsPerDollar
        : ticketsTotalPrice * (dogecoinsPerDollar * 0.95);

    return dogecoinsToPay;
  }
}
