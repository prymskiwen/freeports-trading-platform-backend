import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import commonConfig from '../config/common.config';
import openapiConfig from '../config/openapi.config';
import { AppModule } from './app.module';
import { User } from './users/schemas/user.schema';
import { TransactionRequest } from './transactionRequests/schemas/transactionRequest.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const commonConf = app.get<ConfigType<typeof commonConfig>>(commonConfig.KEY);
  const apiConf = app.get<ConfigType<typeof openapiConfig>>(openapiConfig.KEY);

  const config = new DocumentBuilder()
    .setTitle(apiConf.title)
    .setDescription(apiConf.description)
    .setVersion(apiConf.version)
    .addTag(apiConf.tag)
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [User, TransactionRequest],
  });
  SwaggerModule.setup(apiConf.path, app, document);

  await app.listen(commonConf.port);
}
bootstrap();
