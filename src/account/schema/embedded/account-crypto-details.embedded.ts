import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

@Schema({ versionKey: false, _id: false })
export class AccountCryptoDetails {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  publicAddress: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  vaultWalletId: string;
}

export const AccountCryptoDetailsSchema = SchemaFactory.createForClass(
  AccountCryptoDetails,
);