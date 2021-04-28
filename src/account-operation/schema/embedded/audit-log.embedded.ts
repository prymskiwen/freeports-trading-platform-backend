import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

@Schema({ versionKey: false, _id: false })
export class AuditLog {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  editedAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: false })
  @ApiProperty({ type: () => User, required: false })
  @IsOptional()
  editedBy: User;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  jsonUpdate: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
