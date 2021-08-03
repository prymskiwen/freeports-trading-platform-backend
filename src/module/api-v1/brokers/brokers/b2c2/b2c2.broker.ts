import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { RequestTradeRfqSide } from 'src/schema/request/embedded/request-trade-rfq.embedded';

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
  'FOK',
  'MKT',
}

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

  rfq(
    id: string,
    instrument: string,
    side: RequestTradeRfqSide,
    quantity: string,
  ): Promise<AxiosResponse<RFQResponse>> {
    return this.axiosInstance.post<RFQResponse>('/request_for_quote/', {
      instrument: instrument,
      side: side,
      quantity: quantity,
      client_rfq_id: id,
    });
  }

  order(
    id: string,
    instrument: string,
    side: RequestTradeRfqSide,
    quantity: string,
    price: string,
    validUntil: string,
    executing_unit?: string,
  ): Promise<AxiosResponse<OrderResponse>> {
    return this.axiosInstance.post<OrderResponse>('/order/', {
      instrument: instrument,
      side: side,
      quantity: quantity,
      client_order_id: id,
      price,
      valid_until: validUntil,
      //TODO allow other order types
      order_type: 'FOK',
    });
  }
}
