import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user/user.schema';
import { IsUniqueInDbConstraint } from 'src/validation/is-unique-in-db.validation';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import authenticationConfig from 'src/config/auth.config';
import { ConfigType } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
  providers: [AuthService, LocalStrategy, JwtStrategy, IsUniqueInDbConstraint],
})
export class AuthModule {}
