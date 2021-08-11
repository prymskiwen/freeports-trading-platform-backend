import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId } from 'class-validator';

export class AssignRoleOrganizationRequestDto {
  @IsArray()
  @IsMongoId({ each: true })
  @ApiProperty({
    type: [String],
    description: 'Array of organization role Id-s',
  })
  roles: string[];
}
