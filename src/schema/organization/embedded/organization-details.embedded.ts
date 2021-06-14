import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class OrganizationDetails {
  @Prop()
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
  logofile?: string;

}

export const OrganizationDetailsSchema = SchemaFactory.createForClass(
  OrganizationDetails,
);
