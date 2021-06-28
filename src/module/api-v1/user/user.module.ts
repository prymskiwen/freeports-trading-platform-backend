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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailModule,
    forwardRef(() => AuthModule),
    DeskModule,
    OrganizationModule,
    forwardRef(() => RoleModule),
  ],
  controllers: [
    InitController,
    UserClearerController,
    UserClearerOrganizationManagerController,
    UserOrganizationController,
    UserDeskController,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
