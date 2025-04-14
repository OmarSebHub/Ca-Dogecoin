import { Component } from '@angular/core';
import { TableComponent } from '../../components/metrics/table/table.component';
import { CoinCapApiService } from '../../services/coin-cap-api.service';
import { Icrypto } from '../../models/cryptoCurrency';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metrics',
  imports: [TableComponent, CommonModule],
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.css',
})
export class MetricsComponent {
  cryptoCurrencyIds: string[] = ['bitcoin', 'ethereum', 'dogecoin'];

  cryptoCurrencyList$: Observable<Icrypto[]>;

  constructor(private coinService: CoinCapApiService) {
    this.cryptoCurrencyList$ = this.coinService.getCoinsCombinedData(
      this.cryptoCurrencyIds
    );
  }
}
