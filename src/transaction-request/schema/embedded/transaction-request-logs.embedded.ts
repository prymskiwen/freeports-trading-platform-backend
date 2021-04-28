import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestLogs {
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

export const TransactionRequestLogsSchema = SchemaFactory.createForClass(
  TransactionRequestLogs,
);
