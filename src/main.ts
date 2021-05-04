import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import commonConfig from './config/common.config';
import openapiConfig from './config/openapi.config';
import { AppModule } from './module/app.module';
import { Account } from './module/account/schema/account.schema';
import { AccountOperation } from './module/account-operation/schema/account-operation.schema';
import { OperationRequest } from './module/operation-request/schema/operation-request.schema';
import { Organization } from './module/organization/schema/organization.schema';
import { TransactionRequest } from './module/transaction-request/schema/transaction-request.schema';
import { User } from './module/user/schema/user.schema';
import { ValidationPipeCustomException } from './pipe/validation.pipe';
import { useContainer } from 'class-validator';

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

  app.useGlobalPipes(new ValidationPipeCustomException());
  // to inject nestJS services to class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(commonConf.port);
}
bootstrap();
