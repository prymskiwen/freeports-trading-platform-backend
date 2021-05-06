import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user/user.schema';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { InvalidCredentialsException } from 'src/exeption/invalid-credentials.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection, // to make native API calls
  ) {}

  // dummy
  private encrypt(st: string): string {
    st = '#@$#%';

    return st;
  }

  // dummy
  private compare(plain: string, encrypted: string): boolean {
    return this.encrypt(plain) === encrypted;
  }

  // dummy
  private getKey(user: User): string {
    return user._id;
  }

  async register(
    registerRequest: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const createdUser = new this.userModel();

    createdUser.personal.email = registerRequest.email;
    createdUser.personal.nickname = registerRequest.nickname;
    createdUser.personal.password = this.encrypt(registerRequest.password);
    await createdUser.save();

    return {
      id: createdUser._id,
    };
  }

  async login(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userModel
      .findOne({ 'personal.email': loginRequest.email })
      .exec();

    if (!user || !this.compare(loginRequest.password, user.personal.password)) {
      throw new InvalidCredentialsException();
    }

    return {
      key: this.getKey(user),
    };
  }
}
