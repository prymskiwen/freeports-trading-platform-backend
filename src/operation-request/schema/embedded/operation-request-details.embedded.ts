import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Account } from 'src/account/schema/account.schema';
import { User } from 'src/user/schema/user.schema';

@Schema({ versionKey: false, _id: false })
export class OperationRequestDetails {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: false })
  @ApiProperty({ type: () => User, required: false })
  @IsOptional()
  initiator: User;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  createdAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: Account.name, required: false })
  @ApiProperty({ type: () => Account, required: false })
  @IsOptional()
  accountFrom: Account;

  @Prop({ type: SchemaTypes.ObjectId, ref: Account.name, required: false })
  @ApiProperty({ type: () => Account, required: false })
  @IsOptional()
  accountTo: Account;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  amount: number;
}

export const OperationRequestDetailsSchema = SchemaFactory.createForClass(
  OperationRequestDetails,
);