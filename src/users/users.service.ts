import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection, // to make native API calls
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);

    return createdUser.save();
  }

  // TODO: schema exclude decorator should be used instead of exclude with select
  async findAll(): Promise<ReadUserDto[]> {
    return this.userModel.find().select('-personal').exec();
  }

  // TODO: schema exclude decorator should be used instead of exclude with select
  findOne(id: string): Promise<ReadUserDto> {
    return this.userModel.findById(id).select('-personal').exec();
  }

  // TODO: It makes no sense to return data before change
  update(id: string, updateUserDto: UpdateUserDto): Promise<ReadUserDto> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto).exec();
  }

  // TODO: It makes no sense to return data before remove
  remove(id: string): Promise<ReadUserDto> {
    return this.userModel.findByIdAndRemove(id).exec();
  }
}
