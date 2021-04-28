import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

@Schema({ versionKey: false, _id: false })
export class Commission {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  clearer: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  organization: string;
}

export const CommissionSchema = SchemaFactory.createForClass(Commission);
