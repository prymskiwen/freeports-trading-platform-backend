import { Module } from '@nestjs/common';
import { VaultService } from './vault.service';
import { VaultController } from './vault.controller';

@Module({
  providers: [VaultService],
  exports: [VaultService],
  controllers: [VaultController],
})
export class VaultModule {}
