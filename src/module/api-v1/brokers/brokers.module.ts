import { Module } from '@nestjs/common';
import { BrokersService } from './brokers.service';

@Module({
  providers: [BrokersService]
})
export class BrokersModule {}
