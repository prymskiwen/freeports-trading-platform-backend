import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import commonConfig from 'src/config/common.config';
import databaseConfig from 'src/config/database.config';
import openapiConfig from 'src/config/openapi.config';
import { APIV0Module } from './api-v0/api.v0.module';
import { APIV1Module } from './api-v1/api.v1.module';

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
    APIV0Module,
    APIV1Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
