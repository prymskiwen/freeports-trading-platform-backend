import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class Currencies {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  from: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  to: string;
}
