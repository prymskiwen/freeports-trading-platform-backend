import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class OrganizationCommissionRatio {
  @Prop()
  clearer?: string;

  @Prop()
  organization?: string;
}

export const OrganizationCommissionRatioSchema = SchemaFactory.createForClass(
  OrganizationCommissionRatio,
);
