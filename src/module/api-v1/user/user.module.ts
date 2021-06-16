import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user/user.schema';
import { UserService } from './user.service';
import { IsUniqueInDbConstraint } from 'src/validation/is-unique-in-db.validation';
import { UserController } from './user.controller';
import { OrganizationModule } from '../organization/organization.module';
import { RoleModule } from '../role/role.module';
import { DeskModule } from '../desk/desk.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    DeskModule,
    OrganizationModule,
    forwardRef(() => RoleModule),
  ],
  controllers: [UserController],
  providers: [UserService, IsUniqueInDbConstraint],
  exports: [UserService],
})
export class UserModule {}
