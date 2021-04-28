import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

@Schema({ versionKey: false, _id: false })
export class AssetsMove {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  vaultWalletId: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  publicTargetWalletId: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  currency: string;
}

export const AssetsMoveSchema = SchemaFactory.createForClass(AssetsMove);
