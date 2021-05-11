import { Controller, Post, Body, Param, Patch, Get } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import { InvalidFormExceptionDto } from 'src/exeption/dto/invalid-form-exception.dto';
import { CreateOrganizationManagerResponseDto } from './dto/create-organization-manager-response.dto';
import { CreateOrganizationRequestDto } from './dto/create-organization-request.dto';
import { CreateOrganizationResponseDto } from './dto/create-organization-response.dto';
import { ClearerService } from './clearer.service';
import { CreateOrganizationManagerRequestDto } from './dto/create-organization-manager-request.dto';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { UpdateOrganizationRequestDto } from './dto/update-organization-request';
import { GetOrganizationResponseDto } from './dto/get-organization-response.dto';
import { GetOrganizationManagerResponseDto } from './dto/get-organization-manager-response.dto';
import { UpdateOrganizationManagerRequestDto } from './dto/update-organization-manager-request';
import { UpdateOrganizationResponseDto } from './dto/update-organization-response.dto';
import { UpdateOrganizationManagerResponseDto } from './dto/update-organization-manager-response.dto';

@Controller('api/v1/clearer')
@ApiTags('clearer')
export class ClearerController {
  constructor(private readonly clearerService: ClearerService) {}

  @Post('organization')
  @ApiOperation({ summary: 'Create organization' })
  @ApiCreatedResponse({
    description: 'Successfully registered organization id',
    type: CreateOrganizationResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid form',
    type: InvalidFormExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  createOrganization(
    @Body() createRequest: CreateOrganizationRequestDto,
  ): Promise<CreateOrganizationResponseDto> {
    return this.clearerService.createOrganization(createRequest);
  }

  @Patch('organization/:id')
  @ApiOperation({ summary: 'Update organization' })
  @ApiOkResponse({
    description: 'Successfully updated organization id',
    type: CreateOrganizationResponseDto,
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
  updateOrganization(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() request: UpdateOrganizationRequestDto,
  ): Promise<UpdateOrganizationResponseDto> {
    return this.clearerService.updateOrganization(id, request);
  }

  @Get('organization')
  @ApiOperation({ summary: 'Get organization list' })
  @ApiOkResponse({
    description: 'Organization list',
    type: [GetOrganizationResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  getOrganizations(): Promise<GetOrganizationResponseDto[]> {
    return this.clearerService.getOrganizations();
  }

  @Post('organization/:id/manager')
  @ApiOperation({ summary: 'Create organization manager' })
  @ApiCreatedResponse({
    description: 'Successfully registered organization manager id',
    type: CreateOrganizationManagerResponseDto,
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
  createOrganizationManager(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() createRequest: CreateOrganizationManagerRequestDto,
  ): Promise<CreateOrganizationManagerResponseDto> {
    return this.clearerService.createOrganizationManager(id, createRequest);
  }

  @Patch('organization/manager/:id')
  @ApiOperation({ summary: 'Update organization manager' })
  @ApiOkResponse({
    description: 'Successfully updated organization manager id',
    type: UpdateOrganizationManagerResponseDto,
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
    description: 'Organization manager has not been found',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  updateOrganizationManager(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() request: UpdateOrganizationManagerRequestDto,
  ): Promise<UpdateOrganizationManagerResponseDto> {
    return this.clearerService.updateOrganizationManager(id, request);
  }

  @Get('organization/:id/manager')
  @ApiOperation({ summary: 'Get organization manager list' })
  @ApiOkResponse({
    description: 'Organization manager list',
    type: [GetOrganizationManagerResponseDto],
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization has not been found',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  getOrganizationManagers(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<GetOrganizationManagerResponseDto[]> {
    return this.clearerService.getOrganizationManagers(id);
  }
}
