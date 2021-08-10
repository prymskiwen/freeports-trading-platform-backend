import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { RequestTradeRfqSide } from 'src/schema/request/embedded/request-trade-rfq.embedded';
import { DateTime } from 'luxon';
import { response } from 'express';

// import { io, Socket } from 'socket.io-client';

export interface OrderResponse {
  order_id: string;
  client_order_id: string;
  quantity: string;
  side: string;
  instrument: string;
  price: string;
  executed_price: string;
  executing_unit: string;
  trades?: TradesEntity[] | null;
  created: string;
}
export interface TradesEntity {
  instrument: string;
  trade_id: string;
  origin: string;
  rfq_id?: null;
  created: string;
  price: string;
  quantity: string;
  order: string;
  side: string;
  executing_unit: string;
}
export interface OrderResponse {
  order_id: string;
  client_order_id: string;
  quantity: string;
  side: string;
  instrument: string;
  price: string;
  executed_price: string;
  executing_unit: string;
  trades?: TradesEntity[] | null;
  created: string;
}
export interface RFQResponse {
  valid_until: string;
  rfq_id: string;
  client_rfq_id: string;
  quantity: string;
  side: RequestTradeRfqSide;
  instrument: string;
  price: string;
  created: string;
}

export enum OrderType {
  'FOK' = 'FOK',
  'MKT' = 'MKT',
}
const instruments = [
  { name: 'LTCUSD.SPOT', underlier: 'LTCUSD', type: 'SPOT' },
  { name: 'LTCSGD.SPOT', underlier: 'LTCSGD', type: 'SPOT' },
  { name: 'BCHUSD.SPOT', underlier: 'BCHUSD', type: 'SPOT' },
  { name: 'LTCUST.SPOT', underlier: 'LTCUST', type: 'SPOT' },
  { name: 'EOSAUD.SPOT', underlier: 'EOSAUD', type: 'SPOT' },
  { name: 'EOSEUR.SPOT', underlier: 'EOSEUR', type: 'SPOT' },
  { name: 'EOSGBP.SPOT', underlier: 'EOSGBP', type: 'SPOT' },
  { name: 'USTEUR.SPOT', underlier: 'USTEUR', type: 'SPOT' },
  { name: 'USTAUD.SPOT', underlier: 'USTAUD', type: 'SPOT' },
  { name: 'USTGBP.SPOT', underlier: 'USTGBP', type: 'SPOT' },
  { name: 'BTCUSD.SPOT', underlier: 'BTCUSD', type: 'SPOT' },
  { name: 'BTCEUR.SPOT', underlier: 'BTCEUR', type: 'SPOT' },
  { name: 'BTCGBP.SPOT', underlier: 'BTCGBP', type: 'SPOT' },
  { name: 'ETHBTC.SPOT', underlier: 'ETHBTC', type: 'SPOT' },
  { name: 'ETHUSD.SPOT', underlier: 'ETHUSD', type: 'SPOT' },
  { name: 'ETHGBP.SPOT', underlier: 'ETHGBP', type: 'SPOT' },
  { name: 'BTCCHF.SPOT', underlier: 'BTCCHF', type: 'SPOT' },
  { name: 'BCHAUD.SPOT', underlier: 'BCHAUD', type: 'SPOT' },
  { name: 'LTCAUD.SPOT', underlier: 'LTCAUD', type: 'SPOT' },
  { name: 'BCHGBP.SPOT', underlier: 'BCHGBP', type: 'SPOT' },
  { name: 'LTCGBP.SPOT', underlier: 'LTCGBP', type: 'SPOT' },
  { name: 'XRPJPY.SPOT', underlier: 'XRPJPY', type: 'SPOT' },
  { name: 'ETHUST.SPOT', underlier: 'ETHUST', type: 'SPOT' },
  { name: 'XRPUST.SPOT', underlier: 'XRPUST', type: 'SPOT' },
  { name: 'USDJPY.SPOT', underlier: 'USDJPY', type: 'SPOT' },
  { name: 'DOTBTC.SPOT', underlier: 'DOTBTC', type: 'SPOT' },
  { name: 'DOTUSD.SPOT', underlier: 'DOTUSD', type: 'SPOT' },
  { name: 'DOTEUR.SPOT', underlier: 'DOTEUR', type: 'SPOT' },
  { name: 'DOTGBP.SPOT', underlier: 'DOTGBP', type: 'SPOT' },
  { name: 'DOTETH.SPOT', underlier: 'DOTETH', type: 'SPOT' },
  { name: 'DOTCHF.SPOT', underlier: 'DOTCHF', type: 'SPOT' },
  { name: 'DOTUST.SPOT', underlier: 'DOTUST', type: 'SPOT' },
  { name: 'DOTCAD.SPOT', underlier: 'DOTCAD', type: 'SPOT' },
  { name: 'DOTJPY.SPOT', underlier: 'DOTJPY', type: 'SPOT' },
  { name: 'DOTSGD.SPOT', underlier: 'DOTSGD', type: 'SPOT' },
  { name: 'DOTAUD.SPOT', underlier: 'DOTAUD', type: 'SPOT' },
  { name: 'DOTMXN.SPOT', underlier: 'DOTMXN', type: 'SPOT' },
  { name: 'ETHMXN.SPOT', underlier: 'ETHMXN', type: 'SPOT' },
  { name: 'XRPMXN.SPOT', underlier: 'XRPMXN', type: 'SPOT' },
  { name: 'LNKEUR.SPOT', underlier: 'LNKEUR', type: 'SPOT' },
  { name: 'LNKCHF.SPOT', underlier: 'LNKCHF', type: 'SPOT' },
  { name: 'USCEUR.SPOT', underlier: 'USCEUR', type: 'SPOT' },
  { name: 'EURUSD.SPOT', underlier: 'EURUSD', type: 'SPOT' },
  { name: 'BTCCAD.SPOT', underlier: 'BTCCAD', type: 'SPOT' },
  { name: 'BTCJPY.SPOT', underlier: 'BTCJPY', type: 'SPOT' },
  { name: 'ETHJPY.SPOT', underlier: 'ETHJPY', type: 'SPOT' },
  { name: 'BCHBTC.SPOT', underlier: 'BCHBTC', type: 'SPOT' },
  { name: 'BCHEUR.SPOT', underlier: 'BCHEUR', type: 'SPOT' },
  { name: 'LTCJPY.SPOT', underlier: 'LTCJPY', type: 'SPOT' },
  { name: 'LTCCAD.SPOT', underlier: 'LTCCAD', type: 'SPOT' },
  { name: 'XRPBTC.SPOT', underlier: 'XRPBTC', type: 'SPOT' },
  { name: 'EOSCHF.SPOT', underlier: 'EOSCHF', type: 'SPOT' },
  { name: 'BTCMXN.SPOT', underlier: 'BTCMXN', type: 'SPOT' },
  { name: 'BCHCHF.SPOT', underlier: 'BCHCHF', type: 'SPOT' },
  { name: 'BTCUST.SPOT', underlier: 'BTCUST', type: 'SPOT' },
  { name: 'BTCNZD.SPOT', underlier: 'BTCNZD', type: 'SPOT' },
  { name: 'XRPETH.SPOT', underlier: 'XRPETH', type: 'SPOT' },
  { name: 'EOSCAD.SPOT', underlier: 'EOSCAD', type: 'SPOT' },
  { name: 'USTSGD.SPOT', underlier: 'USTSGD', type: 'SPOT' },
  { name: 'EOSUST.SPOT', underlier: 'EOSUST', type: 'SPOT' },
  { name: 'USTMXN.SPOT', underlier: 'USTMXN', type: 'SPOT' },
  { name: 'USTCHF.SPOT', underlier: 'USTCHF', type: 'SPOT' },
  { name: 'ETHBCH.SPOT', underlier: 'ETHBCH', type: 'SPOT' },
  { name: 'LTCXRP.SPOT', underlier: 'LTCXRP', type: 'SPOT' },
  { name: 'LNKSGD.SPOT', underlier: 'LNKSGD', type: 'SPOT' },
  { name: 'LNKMXN.SPOT', underlier: 'LNKMXN', type: 'SPOT' },
  { name: 'LNKCAD.SPOT', underlier: 'LNKCAD', type: 'SPOT' },
  { name: 'LNKAUD.SPOT', underlier: 'LNKAUD', type: 'SPOT' },
  { name: 'USCCHF.SPOT', underlier: 'USCCHF', type: 'SPOT' },
  { name: 'USCAUD.SPOT', underlier: 'USCAUD', type: 'SPOT' },
  { name: 'XLMGBP.SPOT', underlier: 'XLMGBP', type: 'SPOT' },
  { name: 'ETHEUR.SPOT', underlier: 'ETHEUR', type: 'SPOT' },
  { name: 'BTCSGD.SPOT', underlier: 'BTCSGD', type: 'SPOT' },
  { name: 'ETHCAD.SPOT', underlier: 'ETHCAD', type: 'SPOT' },
  { name: 'ETHCHF.SPOT', underlier: 'ETHCHF', type: 'SPOT' },
  { name: 'BTCAUD.SPOT', underlier: 'BTCAUD', type: 'SPOT' },
  { name: 'ETHAUD.SPOT', underlier: 'ETHAUD', type: 'SPOT' },
  { name: 'LTCBTC.SPOT', underlier: 'LTCBTC', type: 'SPOT' },
  { name: 'XRPUSD.SPOT', underlier: 'XRPUSD', type: 'SPOT' },
  { name: 'XRPAUD.SPOT', underlier: 'XRPAUD', type: 'SPOT' },
  { name: 'LTCCHF.SPOT', underlier: 'LTCCHF', type: 'SPOT' },
  { name: 'EOSUSD.SPOT', underlier: 'EOSUSD', type: 'SPOT' },
  { name: 'USTUSD.SPOT', underlier: 'USTUSD', type: 'SPOT' },
  { name: 'BCHUST.SPOT', underlier: 'BCHUST', type: 'SPOT' },
  { name: 'LTCETH.SPOT', underlier: 'LTCETH', type: 'SPOT' },
  { name: 'XLMCAD.SPOT', underlier: 'XLMCAD', type: 'SPOT' },
  { name: 'XRPBCH.SPOT', underlier: 'XRPBCH', type: 'SPOT' },
  { name: 'LTCBCH.SPOT', underlier: 'LTCBCH', type: 'SPOT' },
  { name: 'XLMUST.SPOT', underlier: 'XLMUST', type: 'SPOT' },
  { name: 'LNKUSD.SPOT', underlier: 'LNKUSD', type: 'SPOT' },
  { name: 'USCSGD.SPOT', underlier: 'USCSGD', type: 'SPOT' },
  { name: 'USCJPY.SPOT', underlier: 'USCJPY', type: 'SPOT' },
  { name: 'ETHSGD.SPOT', underlier: 'ETHSGD', type: 'SPOT' },
  { name: 'LTCEUR.SPOT', underlier: 'LTCEUR', type: 'SPOT' },
  { name: 'BCHJPY.SPOT', underlier: 'BCHJPY', type: 'SPOT' },
  { name: 'BCHSGD.SPOT', underlier: 'BCHSGD', type: 'SPOT' },
  { name: 'BCHCAD.SPOT', underlier: 'BCHCAD', type: 'SPOT' },
  { name: 'XRPGBP.SPOT', underlier: 'XRPGBP', type: 'SPOT' },
  { name: 'XRPEUR.SPOT', underlier: 'XRPEUR', type: 'SPOT' },
  { name: 'XRPCHF.SPOT', underlier: 'XRPCHF', type: 'SPOT' },
  { name: 'XRPCAD.SPOT', underlier: 'XRPCAD', type: 'SPOT' },
  { name: 'XRPNZD.SPOT', underlier: 'XRPNZD', type: 'SPOT' },
  { name: 'EOSBTC.SPOT', underlier: 'EOSBTC', type: 'SPOT' },
  { name: 'USTCAD.SPOT', underlier: 'USTCAD', type: 'SPOT' },
  { name: 'XLMUSD.SPOT', underlier: 'XLMUSD', type: 'SPOT' },
  { name: 'XLMJPY.SPOT', underlier: 'XLMJPY', type: 'SPOT' },
  { name: 'XLMEUR.SPOT', underlier: 'XLMEUR', type: 'SPOT' },
  { name: 'XLMXRP.SPOT', underlier: 'XLMXRP', type: 'SPOT' },
  { name: 'XLMMXN.SPOT', underlier: 'XLMMXN', type: 'SPOT' },
  { name: 'LNKGBP.SPOT', underlier: 'LNKGBP', type: 'SPOT' },
  { name: 'LNKJPY.SPOT', underlier: 'LNKJPY', type: 'SPOT' },
  { name: 'USCUSD.SPOT', underlier: 'USCUSD', type: 'SPOT' },
  { name: 'USCGBP.SPOT', underlier: 'USCGBP', type: 'SPOT' },
  { name: 'USCMXN.SPOT', underlier: 'USCMXN', type: 'SPOT' },
  { name: 'USCCAD.SPOT', underlier: 'USCCAD', type: 'SPOT' },
];
export class B2C2 {
  name = 'B2C2';
  BASE_URL = 'https://api.uat.b2c2.net';
  SOCKET_BASE_URL = 'wss://socket.uat.b2c2.net/quotes';

  accessToken = '';
  //
  axiosInstance: AxiosInstance;

  constructor(config) {
    this.accessToken = config.accessToken;
    this.axiosInstance = axios.create({
      baseURL: this.BASE_URL,
      headers: { Authorization: `Token ${this.accessToken}` },
    });
  }

  async rfq(
    id: string,
    currencyFrom: string,
    currencyTo: string,
    quantity: string,
  ): Promise<{ response?: RFQResponse; brokerId: string; error?: any }> {
    const instrument = this.constructInstrument(currencyFrom, currencyTo);
    const side = this.getSide(currencyFrom, instrument);
    try {
      const response = await this.axiosInstance.post<RFQResponse>(
        '/request_for_quote/',
        {
          instrument: instrument,
          side,
          quantity: quantity,
          client_rfq_id: id,
        },
      );

      return { response: response.data, brokerId: this.name };
    } catch (error) {
      console.error(error.response.data?.errors[0]);
      return { error, brokerId: this.name };
    }
  }

  order(
    id: string,
    currencyFrom: string,
    currencyTo: string,
    quantity: string,
    price: string,
    validUntil: Date,
    executing_unit?: string,
  ): Promise<AxiosResponse<OrderResponse>> {
    const instrument = this.constructInstrument(currencyFrom, currencyTo);
    return this.axiosInstance.post<OrderResponse>('/order/', {
      instrument: instrument,
      side: this.getSide(currencyFrom, instrument),
      quantity: quantity,
      client_order_id: id,

      valid_until: DateTime.fromJSDate(validUntil).toFormat(
        "y'-'MM'-'dd'T'HH':'mm':'ss",
      ),
      //TODO allow other order types
      order_type: OrderType.MKT,
    });
  }

  private constructInstrument(
    currencyFrom: string,
    currencyTo: string,
  ): string {
    if (
      instruments.find((i) =>
        i.name.startsWith(
          currencyFrom.toUpperCase() + currencyTo.toUpperCase(),
        ),
      )
    ) {
      return currencyFrom.toUpperCase() + currencyTo.toUpperCase() + '.SPOT';
    }

    return currencyTo.toUpperCase() + currencyFrom.toUpperCase() + '.SPOT';
  }

  private getSide(currencyFrom: string, instrument: string): string {
    // check which account is crypto
    return instrument.startsWith(currencyFrom.toUpperCase()) ? 'sell' : 'buy';
  }
}
