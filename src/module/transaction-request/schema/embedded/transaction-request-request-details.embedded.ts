import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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

export enum TransactionRequestRequestDetailsType {
  'purchase',
  'sale',
  'assets_move',
  'clearer_acount_funding',
  'clearer_account_refunding',
}

export enum TransactionRequestRequestDetailsMode {
  'limit',
  'market',
}

@Schema({ versionKey: false, _id: false })
export class TransactionRequestRequestDetails {
  @Prop({ type: String, enum: TransactionRequestRequestDetailsType })
  type?: TransactionRequestRequestDetailsType;

  @Prop({ type: String, enum: TransactionRequestRequestDetailsMode })
  mode?: TransactionRequestRequestDetailsMode;

  @Prop({ type: TransactionRequestRequestDetailsSaleSchema })
  sale?: TransactionRequestRequestDetailsSale;

  @Prop({ type: TransactionRequestRequestDetailsPurchaseSchema })
  purchase?: TransactionRequestRequestDetailsPurchase;

  @Prop({ type: TransactionRequestRequestDetailsClearingMoveSchema })
  clearingMove?: TransactionRequestRequestDetailsClearingMove;

  @Prop({ type: TransactionRequestRequestDetailsAssetsMoveSchema })
  assetsMove?: TransactionRequestRequestDetailsAssetsMove;
}

export const TransactionRequestRequestDetailsSchema = SchemaFactory.createForClass(
  TransactionRequestRequestDetails,
);
