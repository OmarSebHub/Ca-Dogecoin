import { Component } from '@angular/core';
import { TableComponent } from "../../components/metrics/table/table.component";
import { CoinCapApiService } from '../../services/coin-cap-api.service';
import { Icrypto } from '../../models/cryptoCurrency';

@Component({
  selector: 'app-metrics',
  imports: [
    TableComponent
  ],
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.css'
})
export class MetricsComponent {

  cryptoCurrencyIds: string[] = ["bitcoin", "ethereum", "dogecoin"];

  cryptoCurrencyList: Icrypto[] = [];

  constructor(
    private coinService : CoinCapApiService
  ) {}

  ngOnInit(): void {
    this.coinService.getCoinsCombinedData(this.cryptoCurrencyIds).subscribe(res => {
        this.cryptoCurrencyList = res;
    })
  }
}
