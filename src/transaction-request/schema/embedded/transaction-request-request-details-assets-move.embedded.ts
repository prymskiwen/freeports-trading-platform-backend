import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestRequestDetailsAssetsMove {
  @Prop()
  vaultWalletId?: string;

  @Prop()
  publicTargetWalletId?: string;

  @Prop()
  currency?: string;
}

export const TransactionRequestRequestDetailsAssetsMoveSchema = SchemaFactory.createForClass(
  TransactionRequestRequestDetailsAssetsMove,
);
