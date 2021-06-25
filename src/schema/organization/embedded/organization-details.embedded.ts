import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class OrganizationDetails {
  @Prop({ unique: true })
  name: string;

  @Prop()
  street?: string;

  @Prop()
  street2?: string;

  @Prop()
  zip?: string;

  @Prop()
  city?: string;

  @Prop()
  country?: string;

  @Prop()
  logo?: string;
}

export const OrganizationDetailsSchema = SchemaFactory.createForClass(
  OrganizationDetails,
);
