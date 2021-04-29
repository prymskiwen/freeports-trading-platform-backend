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

@Schema({ versionKey: false, _id: false })
export class TransactionRequestRequestDetails {
  @Prop()
  type?: string;

  @Prop()
  mode?: string;

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
