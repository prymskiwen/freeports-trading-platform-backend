import { Inject, Injectable } from '@nestjs/common';
import { B2C2 } from './brokers/b2c2/b2c2.broker';
import BrokersConfig from 'src/config/brokers.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class BrokersService {
  brokers = [];
  constructor(
    @Inject(BrokersConfig.KEY)
    brokersConfig: ConfigType<typeof BrokersConfig>,
  ) {
    console.log('vaultConfig', brokersConfig);
    const b2c2Config = brokersConfig.find((config) => config.name === 'B2C2');
    if (b2c2Config) {
      this.brokers.push(new B2C2(b2c2Config));
    }
  }
  rfqs(request) {
    // TODO: handle errors
    return Promise.all(
      this.brokers.map((broker) => {
        return broker.rfq(request.clientRfqId, request.instrument);
      }),
    );
  }
}
