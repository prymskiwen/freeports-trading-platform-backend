import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum UserPublicKeyDataStatus {
  'requested',
  'confirmed',
  'revocation_request',
  'revocation_done',
}

@Schema({ versionKey: false, _id: false })
export class UserPublicKeyData {
  @Prop()
  key?: string;

  @Prop()
  current?: boolean;

  @Prop({ type: String, enum: UserPublicKeyDataStatus })
  status?: UserPublicKeyDataStatus;
}

export const UserPublicKeyDataSchema = SchemaFactory.createForClass(
  UserPublicKeyData,
);
