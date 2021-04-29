import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class OrganizationCommission {
  @Prop()
  clearer?: string;

  @Prop()
  organization?: string;
}

export const OrganizationCommissionSchema = SchemaFactory.createForClass(
  OrganizationCommission,
);
