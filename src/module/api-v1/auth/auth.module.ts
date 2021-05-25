import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import authenticationConfig from 'src/config/auth.config';
import { ConfigType } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: (authConfig: ConfigType<typeof authenticationConfig>) => ({
        secret: authConfig.secret,
        signOptions: {
          expiresIn: authConfig.access_expires_in,
        },
      }),
      inject: [authenticationConfig.KEY],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
