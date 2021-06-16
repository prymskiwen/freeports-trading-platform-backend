import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class UserPersonal {
  /**
   * @example 'John Doe'
   */
  @Prop()
  nickname: string;

  @Prop()
  password: string;

  @Prop()
  phone?: string;

  @Prop()
  avata?: string;

  /**
   * @example 'john@doe.com'
   */
  @Prop({ unique: true })
  email: string;
}

export const UserPersonalSchema = SchemaFactory.createForClass(UserPersonal);
