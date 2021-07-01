import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import authConfig from 'src/config/auth.config';
import commonConfig from 'src/config/common.config';
import databaseConfig from 'src/config/database.config';
import openapiConfig from 'src/config/openapi.config';
import vaultConfig from 'src/config/vault.config';
import { APIV1Module } from './api-v1/api.v1.module';
import corsConfig from 'src/config/cors.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: 'smtp://e2388c36aeb821:e90053b80f0b55@smtp.mailtrap.io:2525',
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ConfigModule.forRoot({
      // cache: true,
      isGlobal: true,
      // ignoreEnvFile: true,
      envFilePath: ['.env.local', '.env.dev', '.env'],
      load: [
        authConfig,
        commonConfig,
        corsConfig,
        databaseConfig,
        openapiConfig,
        vaultConfig,
      ],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (dbConfig: ConfigType<typeof databaseConfig>) => ({
        uri: dbConfig.uri,
        useFindAndModify: false,
        useCreateIndex: true,
      }),
      inject: [databaseConfig.KEY],
    }),
    APIV1Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
