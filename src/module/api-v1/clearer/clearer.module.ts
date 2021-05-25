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
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: Organization.name, schema: OrganizationSchema },
    ]),
    UserModule,
    RoleModule,
  ],
  controllers: [ClearerController],
  providers: [ClearerService, IsUniqueInDbConstraint],
})
export class ClearerModule {}
