import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import commonConfig from '../config/common.config';
import openapiConfig from '../config/openapi.config';
import { Account } from './account/schema/account.schema';
import { AppModule } from './app.module';
import { User } from './user/schema/user.schema';
import { TransactionRequest } from './transaction-request/schema/transaction-request.schema';
import { Organization } from './organization/schema/organization.schema';
import { AccountOperation } from './account-operation/schema/account-operation.schema';
import { OperationRequest } from './operation-request/schema/operation-request.schema';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const commonConf = app.get<ConfigType<typeof commonConfig>>(commonConfig.KEY);
  const apiConf = app.get<ConfigType<typeof openapiConfig>>(openapiConfig.KEY);

  const config = new DocumentBuilder()
    .setTitle(apiConf.title)
    .setDescription(apiConf.description)
    .setVersion(apiConf.version)
    // .addTag(apiConf.tag)
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    // TODO: Remove extra classes definition when API ready
    extraModels: [
      Account,
      AccountOperation,
      OperationRequest,
      Organization,
      TransactionRequest,
      User,
    ],
  });
  SwaggerModule.setup(apiConf.path, app, document);

  app.useGlobalPipes(new ValidationPipe());
  // useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(commonConf.port);
}
bootstrap();
