import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Desk, DeskSchema } from 'src/schema/desk/desk.schema';
import { OrganizationModule } from '../organization/organization.module';
import { DeskService } from './desk.service';
import { DeskController } from './desk.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Desk.name, schema: DeskSchema }]),
    OrganizationModule,
  ],
  controllers: [DeskController],
  providers: [DeskService],
  exports: [DeskService],
})
export class DeskModule {}
