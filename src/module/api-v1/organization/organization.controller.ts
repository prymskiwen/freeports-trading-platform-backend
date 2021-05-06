import { Controller, Post, Body, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import { InvalidFormExceptionDto } from 'src/exeption/dto/invalid-form-exception.dto';
import { OrganizationService } from './organization.service';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { CreateDeskResponseDto } from './dto/create-desk-response.dto';
import { CreateDeskRequestDto } from './dto/create-desk-request.dto';
import { CreatePermissionManagerResponseDto } from './dto/create-permission-manager-response.dto';
import { CreatePermissionManagerRequestDto } from './dto/create-permission-manager-request.dto';

@Controller('api/v1/organization')
@ApiTags('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post(':id/desk')
  @ApiOperation({ summary: 'Create desk' })
  @ApiCreatedResponse({
    description: 'Successfully registered desk id',
    type: CreateDeskResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid form',
    type: InvalidFormExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization has not been found',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  createDesk(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() createRequest: CreateDeskRequestDto,
  ): Promise<CreateDeskResponseDto> {
    return this.organizationService.createDesk(id, createRequest);
  }

  @Post('desk/:id/permission-manager')
  @ApiOperation({ summary: 'Create permission manager' })
  @ApiCreatedResponse({
    description: 'Successfully registered permission manager id',
    type: CreatePermissionManagerResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid form',
    type: InvalidFormExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Desk has not been found',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  createDeskPermissionManager(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() createRequest: CreatePermissionManagerRequestDto,
  ): Promise<CreatePermissionManagerResponseDto> {
    return this.organizationService.createDeskPermissionManager(
      id,
      createRequest,
    );
  }
}
