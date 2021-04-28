import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import commonConfig from 'config/common.config';
import databaseConfig from '../config/database.config';
import openapiConfig from '../config/openapi.config';
import { UserModule } from './user/user.module';
import { TransactionRequestModule } from './transaction-request/transaction-request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // cache: true,
      isGlobal: true,
      // ignoreEnvFile: true,
      envFilePath: ['.env.local', '.env.dev', '.env'],
      load: [commonConfig, databaseConfig, openapiConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (dbConfig: ConfigType<typeof databaseConfig>) => ({
        uri: dbConfig.uri,
        useFindAndModify: false,
      }),
      inject: [databaseConfig.KEY],
    }),
    UserModule,
    TransactionRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
