import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class AssignRoleMultideskRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  @ApiProperty({ type: [String], description: 'Array of desk Id-s' })
  desks: string[];

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ type: String, description: 'Multi-desk role Id' })
  role: string;
}
