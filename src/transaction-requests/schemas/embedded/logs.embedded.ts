import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

@Schema({ versionKey: false, _id: false })
export class Logs {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  rawBrokerQuery: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  rawBrokerResponse: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  statusCode: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  rfqId: string;
}

export const LogsSchema = SchemaFactory.createForClass(Logs);
