import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
  AssetsMove,
  AssetsMoveSchema,
} from './request-details/assets-move.embedded';
import {
  ClearingMove,
  ClearingMoveSchema,
} from './request-details/clearing-move.embedded';
import { Purchase, PurchaseSchema } from './request-details/purchase.embedded';
import { Sale, SaleSchema } from './request-details/sale.embedded';

@Schema({ versionKey: false, _id: false })
export class RequestDetails {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  type: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  mode: string;

  @Prop({ type: SaleSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  sale: Sale;

  @Prop({ type: PurchaseSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  purchase: Purchase;

  @Prop({ type: ClearingMoveSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  clearingMove: ClearingMove;

  @Prop({ type: AssetsMoveSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  assetsMove: AssetsMove;
}

export const RequestDetailsSchema = SchemaFactory.createForClass(
  RequestDetails,
);
