import { Module } from '@nestjs/common';
import { ClearerService } from './clearer.service';
import { ClearerController } from './clearer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IsUniqueInDbConstraint } from 'src/validation/is-unique-in-db.validation';
import { Account, AccountSchema } from 'src/schema/account/account.schema';
import {
  Organization,
  OrganizationSchema,
} from 'src/schema/organization/organization.schema';
import { User, UserSchema } from 'src/schema/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ClearerController],
  providers: [ClearerService, IsUniqueInDbConstraint],
})
export class ClearerModule {}
