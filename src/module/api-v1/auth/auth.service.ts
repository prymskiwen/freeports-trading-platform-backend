import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user/user.schema';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload';
import authenticationConfig from 'src/config/auth.config';
import { ConfigType } from '@nestjs/config';
import { TokenDto } from './dto/token.dto';
import { ValidateTokenResponseDto } from './dto/validate-token-response.dto';
import { InvalidTokenException } from 'src/exeption/invalid-token.exception';
import { ExpiredTokenException } from 'src/exeption/expired-token.exception';
import { UserMapper } from './mapper/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection, // to make native API calls
    @Inject(authenticationConfig.KEY)
    private authConfig: ConfigType<typeof authenticationConfig>,
    private jwtService: JwtService,
  ) {}

  async register(
    registerRequest: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const createdUser = new this.userModel();

    createdUser.personal.email = registerRequest.email;
    createdUser.personal.nickname = registerRequest.nickname;
    createdUser.personal.password = await bcrypt.hash(
      registerRequest.password,
      13,
    );
    await createdUser.save();

    return {
      id: createdUser._id,
    };
  }

  async login(user: UserDocument): Promise<LoginResponseDto> {
    return {
      user: UserMapper.toDto(user),
      token: this.generateAuthToken({
        sub: user._id,
        name: user.personal.nickname,
        email: user.personal.email,
        refresh: false,
      }),
    };
  }

  public generateAuthToken(payload: JwtPayload): TokenDto {
    const tokenType = this.authConfig.type;
    const accessTokenExpires = this.authConfig.access_expires_in;
    const refreshTokenExpires = this.authConfig.refresh_expires_in;
    const accessToken = this.jwtService.sign(
      { ...payload, refresh: false },
      { expiresIn: accessTokenExpires },
    );
    const refreshToken = this.jwtService.sign(
      { ...payload, refresh: true },
      { expiresIn: refreshTokenExpires },
    );

    return {
      tokenType,
      accessToken,
      accessTokenExpires,
      refreshToken,
      refreshTokenExpires,
    };
  }

  public generateRefreshToken(refreshToken: string): TokenDto {
    try {
      return this.generateAuthToken(this.jwtService.verify(refreshToken));
    } catch ({ name }) {
      if (name === 'TokenExpiredError') {
        throw new ExpiredTokenException();
      }

      throw new InvalidTokenException();
    }
  }

  public async validateToken(token: string): Promise<ValidateTokenResponseDto> {
    try {
      const { sub } = this.jwtService.verify(token);
      const user = await this.userModel.findById(sub).exec();

      if (!user) {
        return { valid: false };
      }

      return { valid: !!sub };
    } catch (error) {
      return { valid: false };
    }
  }
}
