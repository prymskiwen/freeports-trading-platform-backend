import { Module } from '@nestjs/common';
import { VaultService } from './vault.service';

@Module({
  providers: [VaultService],
})
export class VaultModule {}
