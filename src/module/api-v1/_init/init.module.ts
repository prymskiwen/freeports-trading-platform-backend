import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OrganizationModule } from '../organization/organization.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { InitController } from './init.controller';

@Module({
  imports: [AuthModule, OrganizationModule, RoleModule, UserModule],
  controllers: [InitController],
})
export class InitModule {}
