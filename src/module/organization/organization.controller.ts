import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { ReadOrganizationDto } from './dto/read-organization.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationService } from './organiztion.service';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Controller('api/v1/organizations')
@ApiTags('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @ApiOperation({ summary: 'Create an organization' })
  @ApiCreatedResponse({
    description: 'The organization has been successfully created.',
    type: ReadOrganizationDto,
  })
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<ReadOrganizationDto> {
    return this.organizationService.create(createOrganizationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiOkResponse({
    type: [ReadOrganizationDto],
  })
  findAll(): Promise<ReadOrganizationDto[]> {
    return this.organizationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an organization by id' })
  @ApiOkResponse({
    type: ReadOrganizationDto,
  })
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<ReadOrganizationDto> {
    return this.organizationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an organization by id' })
  @ApiOkResponse({
    type: ReadOrganizationDto,
  })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<ReadOrganizationDto> {
    return this.organizationService.update(id, updateOrganizationDto);
  }
}
