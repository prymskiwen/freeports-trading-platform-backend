import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsMongoId } from 'class-validator';

export class AssignRoleDeskDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  @ApiProperty({ type: [String], description: 'Array of desk role Id-s' })
  roles: string[];
}
