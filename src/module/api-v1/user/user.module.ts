import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user/user.schema';
import { UserService } from './user.service';
import { IsUniqueInDbConstraint } from 'src/validation/is-unique-in-db.validation';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService, IsUniqueInDbConstraint],
  // exports: [MongooseModule],
  exports: [UserService],
})
export class UserModule {}
