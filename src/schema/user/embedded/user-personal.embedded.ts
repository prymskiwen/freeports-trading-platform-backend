import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class UserPersonal {
  /**
   * @example 'John Doe'
   */
  @Prop()
  nickname: string;

  @Prop()
  password?: string;

  @Prop()
  phone?: string;

  @Prop()
  avatar?: string;

  /**
   * @example 'john@doe.com'
   */
  @Prop({ unique: true })
  email: string;

  @Prop()
  jobTitle?: string;
}

export const UserPersonalSchema = SchemaFactory.createForClass(UserPersonal);
