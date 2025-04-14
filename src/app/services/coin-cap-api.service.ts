import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  forkJoin,
  from,
  map,
  mergeMap,
  Observable,
  of,
  reduce,
  switchMap,
} from 'rxjs';
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

  getCoinById(coinId: string): Observable<Icrypto | undefined> {
    return this.http
      .get<ICryptoItemApiResponse | undefined>(
        `${this.baseUrl}/assets/${coinId}`
      )
      .pipe(
        map(response => response?.data),
        catchError(error => {
          console.error('error in getCoinsByIds. Details:', error);

          return of({ id: '', name: '', priceUsd: '0' });
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

          return from(marketList).pipe(
            reduce((acc: IMarket, market) => {
              const currentMarketVol = Number(market.volumeUsd24Hr);
              const accVolume = Number(acc.volumeUsd24Hr);

              return currentMarketVol > accVolume ? market : acc;
            }, marketList[0])
          );
        }),
        switchMap(marketObservable => marketObservable as Observable<IMarket>),
        catchError(error => {
          console.error('error in getCoinsByIds. Details:', error);

          return of(null);
        })
      );
  }

  getCoinsCombinedData(coinIds: string[]): Observable<Icrypto[]> {
    return this.getCoinsByIds(coinIds).pipe(
      mergeMap(items =>
        items?.length
          ? forkJoin(
              items.map(item =>
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
              )
            )
          : of([])
      ),
      catchError(error => {
        console.error('error Combining datas. Details:', error);

        return of([]);
      })
    );
  }
}
