export interface Icrypto {
  id: string;
  name: string;
  priceUsd?: string;
  topExplorer?: string;
}

export interface ICryptoApiResponse {
  data?: Icrypto[];
}

export interface ICryptoItemApiResponse {
  data?: Icrypto;
}

export interface IMarket {
  exchangeId: string;
  volumeUsd24Hr: string;
}

export interface IMarketApiResponse {
  data?: IMarket[];
}
