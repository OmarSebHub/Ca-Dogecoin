import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import {
  Icrypto,
  ICryptoApiResponse,
  ICryptoItemApiResponse,
  IMarket,
  IMarketApiResponse,
} from '../models/cryptoCurrency';

@Injectable({
  providedIn: 'root',
})
export class CoinCapApiService {
  private baseUrl = 'https://api.coincap.io/v2';

  constructor(private http: HttpClient) {}

  private getCoinsByIds(
    coinIds: string[]
  ): Observable<Icrypto[] | null | undefined> {
    return this.http
      .get<ICryptoApiResponse>(`${this.baseUrl}/assets`, {
        params: {
          ids: coinIds.join(','),
        },
      })
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Observable Error Caught:', error);

          return of(null);
        })
      );
  }

  getCoinById(coinId: string): Observable<Icrypto | undefined | null> {
    return this.http
      .get<ICryptoItemApiResponse | undefined>(
        `${this.baseUrl}/assets/${coinId}`
      )
      .pipe(
        map(response => response?.data),
        catchError(error => {
          console.error('error in getting Coin data. Details:', error);

          return of(null);
        })
      );
  }

  private getHighestExchangeMarketForDogeCoin(
    assetId: string
  ): Observable<IMarket | null> {
    return this.http
      .get<IMarketApiResponse>(`${this.baseUrl}/markets`, {
        params: {
          assetId: assetId,
        },
      })
      .pipe(
        map(response => response.data),
        map(marketList => {
          if (!marketList || marketList.length === 0) {
            return null;
          }

          return this.getHighestMarket(marketList);
        }),
        catchError(error => {
          console.error('error in getting the highest Market. Details:', error);

          return of(null);
        })
      );
  }

  private getHighestMarket(marketList: IMarket[]): IMarket {
    return marketList.reduce((acc, market) => {
      const currentVolume = Number(market.volumeUsd24Hr);
      const accVolume = Number(acc.volumeUsd24Hr);
      return currentVolume > accVolume ? market : acc;
    }, marketList[0]);
  }

  getCoinsCombinedData(coinIds: string[]): Observable<Icrypto[]> {
    return this.getCoinsByIds(coinIds).pipe(
      mergeMap(items =>
        items?.length ? forkJoin(this.getItemDataList(items)) : of([])
      ),
      catchError(error => {
        console.error('error Combining datas. Details:', error);

        return of([]);
      })
    );
  }

  private getItemDataList(items: Icrypto[]): Observable<Icrypto>[] {
    return items.map((item: Icrypto) =>
      this.getHighestExchangeMarketForDogeCoin(item.id).pipe(
        map(topMarket => {
          if (topMarket !== null) {
            return {
              id: item.id,
              name: item.name,
              priceUsd: item.priceUsd,
              topExplorer: topMarket.exchangeId,
            };
          }

          return { ...item };
        })
      )
    );
  }
}
