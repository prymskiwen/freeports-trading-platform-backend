import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId } from 'class-validator';

export class AssignRoleClearerRequestDto {
  @IsArray()
  @IsMongoId({ each: true })
  @ApiProperty({ type: [String], description: 'Array of clearer role Id-s' })
  roles: string[];
}
