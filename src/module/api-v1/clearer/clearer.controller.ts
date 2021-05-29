import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import { InvalidFormExceptionDto } from 'src/exeption/dto/invalid-form-exception.dto';
import { ClearerService } from './clearer.service';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { CreateOrganizationAccountRequestDto } from './dto/create-organization-account-request.dto';
import { CreateOrganizationAccountResponseDto } from './dto/create-organization-account-response.dto';
import { DeleteOrganizationAccountResponseDto } from './dto/delete-organization-account-response.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserDocument } from 'src/schema/user/user.schema';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { PermissionClearer } from 'src/schema/role/enum/permission.enum';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('api/v1/clearer')
@ApiTags('clearer')
@ApiBearerAuth()
export class ClearerController {
  constructor(private readonly clearerService: ClearerService) {}

  @Post('organization/:id/account')
  @Permissions(PermissionClearer.OrganizationAccountCreate)
  @ApiOperation({ summary: 'Create organization account' })
  @ApiCreatedResponse({
    description: 'Successfully registered organization account id',
    type: CreateOrganizationAccountResponseDto,
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
  createAccount(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() request: CreateOrganizationAccountRequestDto,
    @CurrentUser() user: UserDocument,
  ): Promise<CreateOrganizationAccountResponseDto> {
    return this.clearerService.createAccount(id, request, user);
  }

  @Delete('organization/:organizationId/account/:accountId')
  @Permissions(PermissionClearer.OrganizationAccountDelete)
  @ApiOperation({ summary: 'Delete organization account' })
  @ApiOkResponse({
    description: 'Successfully deleted organization account id',
    type: DeleteOrganizationAccountResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization or account has not been found',
    type: ExceptionDto,
  })
  deleteAccount(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('accountId', ParseObjectIdPipe) accountId: string,
  ): Promise<DeleteOrganizationAccountResponseDto> {
    return this.clearerService.deleteAccount(organizationId, accountId);
  }
}
