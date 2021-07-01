import { forwardRef, Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Organization,
  OrganizationSchema,
} from 'src/schema/organization/organization.schema';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { VaultModule } from '../vault/vault.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
    ]),
    forwardRef(() => RoleModule),
    forwardRef(() => UserModule),
    VaultModule,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
