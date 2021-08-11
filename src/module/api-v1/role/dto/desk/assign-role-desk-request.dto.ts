import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId } from 'class-validator';

export class AssignRoleDeskRequestDto {
  @IsArray()
  @IsMongoId({ each: true })
  @ApiProperty({ type: [String], description: 'Array of desk role Id-s' })
  roles: string[];
}
