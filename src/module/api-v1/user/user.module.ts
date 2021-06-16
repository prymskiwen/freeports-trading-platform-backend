import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user/user.schema';
import { UserService } from './user.service';
import { IsUniqueInDbConstraint } from 'src/validation/is-unique-in-db.validation';
import { UserController } from './user.controller';
import { OrganizationModule } from '../organization/organization.module';
import { RoleModule } from '../role/role.module';
import { DeskModule } from '../desk/desk.module';
import { InitController } from './init.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    DeskModule,
    OrganizationModule,
    forwardRef(() => RoleModule),
  ],
  controllers: [UserController, InitController],
  providers: [UserService, IsUniqueInDbConstraint],
  exports: [UserService],
})
export class UserModule {}
