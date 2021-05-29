import { Module } from '@nestjs/common';
import { ClearerService } from './clearer.service';
import { ClearerController } from './clearer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from 'src/schema/account/account.schema';
import {
  Organization,
  OrganizationSchema,
} from 'src/schema/organization/organization.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: Organization.name, schema: OrganizationSchema },
    ]),
  ],
  controllers: [ClearerController],
  providers: [ClearerService],
})
export class ClearerModule {}
