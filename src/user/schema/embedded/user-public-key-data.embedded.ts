import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class UserPublicKeyData {
  @Prop()
  key?: string;

  @Prop()
  current?: boolean;

  @Prop()
  status?: string;
}

export const UserPublicKeyDataSchema = SchemaFactory.createForClass(
  UserPublicKeyData,
);
