import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import commonConfig from 'config/common.config';
import databaseConfig from '../config/database.config';
import openapiConfig from '../config/openapi.config';
import { AccountModule } from './account/account.module';
import { AccountOperationModule } from './account-operation/account-operation.module';
import { OrganizationModule } from './organization/organization.module';
import { TransactionRequestModule } from './transaction-request/transaction-request.module';
import { UserModule } from './user/user.module';
import { OperationRequestModule } from './operation-request/operation-request.module';

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
        useCreateIndex: true,
      }),
      inject: [databaseConfig.KEY],
    }),
    AccountModule,
    AccountOperationModule,
    OrganizationModule,
    OperationRequestModule,
    UserModule,
    TransactionRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
