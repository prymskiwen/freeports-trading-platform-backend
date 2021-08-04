import { Module } from '@nestjs/common';
import { BrokersService } from './brokers.service';

@Module({
  providers: [BrokersService],
  exports: [BrokersService],
})
export class BrokersModule {}
