import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Desk, DeskSchema } from 'src/schema/desk/desk.schema';
import { OrganizationModule } from '../organization/organization.module';
import { DeskService } from './desk.service';
import { DeskController } from './desk.controller';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { DeskMyController } from './desk-my.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Desk.name, schema: DeskSchema }]),
    forwardRef(() => OrganizationModule),
    forwardRef(() => RoleModule),
    forwardRef(() => UserModule),
  ],
  controllers: [DeskController, DeskMyController],
  providers: [DeskService],
  exports: [DeskService],
})
export class DeskModule {}
