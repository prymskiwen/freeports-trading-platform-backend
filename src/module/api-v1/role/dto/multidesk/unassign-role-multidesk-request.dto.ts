import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsMongoId } from 'class-validator';

export class UnassignRoleMultideskRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  @ApiProperty({
    type: [String],
    description: 'Array of multi-desk role Id-s',
  })
  roles: string[];
}
