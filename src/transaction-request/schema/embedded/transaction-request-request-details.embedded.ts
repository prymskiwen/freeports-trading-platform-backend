import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
  TransactionRequestRequestDetailsAssetsMove,
  TransactionRequestRequestDetailsAssetsMoveSchema,
} from './transaction-request-request-details-assets-move.embedded';
import {
  TransactionRequestRequestDetailsClearingMove,
  TransactionRequestRequestDetailsClearingMoveSchema,
} from './transaction-request-request-details-clearing-move.embedded';
import {
  TransactionRequestRequestDetailsPurchase,
  TransactionRequestRequestDetailsPurchaseSchema,
} from './transaction-request-request-details-purchase.embedded';
import {
  TransactionRequestRequestDetailsSale,
  TransactionRequestRequestDetailsSaleSchema,
} from './transaction-request-request-details-sale.embedded';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestRequestDetails {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  type: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  mode: string;

  @Prop({ type: TransactionRequestRequestDetailsSaleSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  sale: TransactionRequestRequestDetailsSale;

  @Prop({ type: TransactionRequestRequestDetailsPurchaseSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  purchase: TransactionRequestRequestDetailsPurchase;

  @Prop({ type: TransactionRequestRequestDetailsClearingMoveSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  clearingMove: TransactionRequestRequestDetailsClearingMove;

  @Prop({ type: TransactionRequestRequestDetailsAssetsMoveSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  assetsMove: TransactionRequestRequestDetailsAssetsMove;
}

export const TransactionRequestRequestDetailsSchema = SchemaFactory.createForClass(
  TransactionRequestRequestDetails,
);
