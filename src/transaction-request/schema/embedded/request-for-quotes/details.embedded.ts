import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Logs, LogsSchema } from '../logs.embedded';
import {
  ConvertDestination,
  ConvertDestinationSchema,
} from './convert-destination.embedded';

@Schema({ versionKey: false, _id: false })
export class Details {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  borkerIdentifier: string;

  @Prop({ type: ConvertDestinationSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  from: ConvertDestination;

  @Prop({ type: ConvertDestinationSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  to: ConvertDestination;

  @Prop({ type: LogsSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  logs: Logs;
}

export const DetailsSchema = SchemaFactory.createForClass(Details);
