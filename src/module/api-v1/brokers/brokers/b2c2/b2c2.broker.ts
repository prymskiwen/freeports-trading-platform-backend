import axios, { AxiosInstance } from 'axios';
import { v4 as uuidv4 } from 'uuid';
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

export enum Side {
  'buy' = 'buy',
  'sell' = 'sell',
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
    side: Side,
    quantity: string,
  ): Promise<any> {
    return this.axiosInstance.post('/request_for_quote/', {
      instrument: instrument,
      side: side,
      quantity: quantity,
      client_rfq_id: id,
    });
  }

  order(
    id: string,
    instrument: string,
    side: Side,
    quantity: string,
    price: string,
    validUntil: number,
    executing_unit?: string,
  ): Promise<OrderResponse> {
    return this.axiosInstance.post('/order/', {
      instrument: instrument,
      side: side,
      quantity: quantity,
      client_rfq_id: id,
      price,
    });
  }
}
