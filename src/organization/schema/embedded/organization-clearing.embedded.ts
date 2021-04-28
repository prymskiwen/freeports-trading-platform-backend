import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Account } from 'src/account/schema/account.schema';

@Schema({ versionKey: false, _id: false })
export class OrganizationClearing {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  currency: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Account.name, required: false })
  @ApiProperty({ type: () => Account, required: false })
  @IsOptional()
  account: Account;
}

export const OrganizationClearingSchema = SchemaFactory.createForClass(
  OrganizationClearing,
);
