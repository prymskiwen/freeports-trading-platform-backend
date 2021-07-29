import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user/user.schema';
import { UserService } from './user.service';
import { OrganizationModule } from '../organization/organization.module';
import { RoleModule } from '../role/role.module';
import { DeskModule } from '../desk/desk.module';
import { InitController } from './init.controller';
import { AuthModule } from '../auth/auth.module';
import { UserClearerController } from './user-clearer.controller';
import { UserOrganizationController } from './user-organization.controller';
import { UserClearerOrganizationManagerController } from './user-clearer-organization-manager.controller';
import { UserDeskController } from './user-desk.controller';
import { MailModule } from '../mail/mail.module';
import { UserPublicKeyController } from './user-public-key.controller';
import {
  UserPublicKey,
  UserPublicKeySchema,
} from 'src/schema/user/embedded/user-public-key.embedded';
import { VaultModule } from '../vault/vault.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserPublicKey.name, schema: UserPublicKeySchema },
    ]),
    MailModule,
    forwardRef(() => AuthModule),
    forwardRef(() => DeskModule),
    forwardRef(() => OrganizationModule),
    forwardRef(() => RoleModule),
    forwardRef(() => VaultModule),
  ],
  controllers: [
    InitController,
    UserClearerController,
    UserClearerOrganizationManagerController,
    UserOrganizationController,
    UserDeskController,
    UserPublicKeyController,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
