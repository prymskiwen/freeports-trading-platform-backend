import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Document, SchemaTypes } from 'mongoose';
import { PublicKey, PublicKeySchema } from './embedded/public-key.embedded';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User {
  @ApiProperty({ required: false })
  @IsOptional()
  _id: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  vault_user_id: string;

  @Prop(
    raw({
      nickname: { type: String },
      password: { type: String },
      email: { type: String },
    }),
  )
  @ApiProperty({
    required: false,
    type: 'object',
    properties: {
      nickname: { type: 'string', example: 'John Doe' },
      password: { type: 'string' },
      email: { type: 'string', example: 'john@doe.com' },
    },
  })
  @IsOptional()
  personal: Record<string, any>;

  @Prop({ type: [PublicKeySchema] })
  @ApiProperty({ type: [PublicKey], required: false })
  @IsOptional()
  publicKeys: [PublicKey];

  @Prop([String])
  @ApiProperty({ required: false })
  @IsOptional()
  roles: string[];

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: false })
  @ApiProperty({ type: () => User, required: false })
  @IsOptional()
  relationhipManager: User;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  commission: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
