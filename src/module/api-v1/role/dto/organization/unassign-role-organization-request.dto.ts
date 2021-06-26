import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsMongoId } from 'class-validator';

export class UnassignRoleOrganizationRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  @ApiProperty({
    type: [String],
    description: 'Array of organization role Id-s',
  })
  roles: string[];
}
