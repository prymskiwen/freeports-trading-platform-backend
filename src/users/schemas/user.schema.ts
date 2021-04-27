import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

// export class UserPersonalData {
//   @ApiProperty({ example: 'John Doe' })
//   nickname: string;

//   @ApiProperty()
//   password: string;

//   @ApiProperty({ example: 'john@doe.com' })
//   email: string;
// }

@Schema({ versionKey: false })
export class User {
  @ApiProperty({ required: false })
  @IsOptional()
  _id: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  vault_user_id: string;

  // @Prop(UserPersonalData)
  // @ApiProperty({ type: UserPersonalData })
  // personal: UserPersonalData;

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

  @Prop([String])
  @ApiProperty({ required: false })
  @IsOptional()
  roles: string[];

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  commission: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
