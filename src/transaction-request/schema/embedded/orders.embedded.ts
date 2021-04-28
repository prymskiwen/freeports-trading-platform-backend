import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Logs, LogsSchema } from './logs.embedded';

@Schema({ versionKey: false, _id: false })
export class Orders {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: false })
  @ApiProperty({ type: () => User, required: false })
  @IsOptional()
  initiator: User;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  createdAt: Date;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  rfqId: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  orderId: string;

  @Prop({ type: LogsSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  logs: Logs;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);
