import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { B2C2, RFQResponse, OrderResponse } from './brokers/b2c2/b2c2.broker';
import BrokersConfig from 'src/config/brokers.config';
import { ConfigType } from '@nestjs/config';
import { RequestTradeRfqSide } from 'src/schema/request/embedded/request-trade-rfq.embedded';

@Injectable()
export class BrokersService {
  brokers: B2C2[] = [];
  constructor(
    @Inject(BrokersConfig.KEY)
    brokersConfig: ConfigType<typeof BrokersConfig>,
  ) {
    const b2c2Config = brokersConfig.find((config) => config.name === 'B2C2');
    if (b2c2Config) {
      this.brokers.push(new B2C2(b2c2Config));
    }
  }
  async rfqs(
    id,
    currencyFrom: string,
    currencyTo: string,
    quantity,
  ): Promise<any> {
    // TODO: handle errors and multiple brokers
    try {
      const rfqs = await Promise.all(
        this.brokers.map((broker) => {
          return broker.rfq(id, currencyFrom, currencyTo, quantity);
        }),
      );
      return rfqs;
    } catch (error) {
      throw error;
    }
  }

  async order(
    brokerId: string,
    id: string,
    currencyFrom: string,
    currencyTo: string,
    quantity: string,
    price: string,
    validUntil: Date,
  ): Promise<any> {
    const broker = this.brokers.find((broker) => broker.name === brokerId);
    if (!broker) {
      throw new NotFoundException(`No broker with id ${brokerId}`);
    }

    const response = await broker.order(
      id,
      currencyFrom,
      currencyTo,
      quantity,
      price,
      validUntil,
    );

    return response.data;
  }
}
