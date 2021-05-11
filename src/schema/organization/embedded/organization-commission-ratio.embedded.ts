import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class OrganizationCommissionRatio {
  @Prop()
  clearer?: number;

  @Prop()
  organization?: number;
}

export const OrganizationCommissionRatioSchema = SchemaFactory.createForClass(
  OrganizationCommissionRatio,
);
