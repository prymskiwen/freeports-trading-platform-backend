import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ReadUserDto } from './dto/read-user.dto';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { AddUserPublicKeyDto } from './dto/add-user-public-key.dto';
import { InvalidFormExceptionDto } from 'src/exeption/dto/invalid-form-exception.dto';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';

@Controller('api/v0/users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: ReadUserDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid form',
    type: InvalidFormExceptionDto,
  })
  create(@Body() createUserDto: CreateUserDto): Promise<ReadUserDto> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    type: [ReadUserDto],
  })
  findAll(): Promise<ReadUserDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiOkResponse({
    type: ReadUserDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  findOne(@Param('id', ParseObjectIdPipe) id: string): Promise<ReadUserDto> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiOkResponse({
    type: ReadUserDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid form',
    type: InvalidFormExceptionDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string): Promise<ReadUserDto> {
    return this.userService.remove(id);
  }

  @Post(':id/public-key')
  @ApiOperation({ summary: 'Add a public key to a user' })
  @ApiCreatedResponse({
    description: 'Public key has been successfully added.',
    type: ReadUserDto,
  })
  addPublicKey(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() publicKey: AddUserPublicKeyDto,
  ) {
    return this.userService.addPublicKey(id, publicKey);
  }
}
