import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import commonConfig from './config/common.config';
import openapiConfig from './config/openapi.config';
import { AppModule } from './module/app.module';
import { ValidationPipeCustomException } from './pipe/validation.pipe';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const commonConf = app.get<ConfigType<typeof commonConfig>>(commonConfig.KEY);
  const apiConfs = app.get<ConfigType<typeof openapiConfig>>(openapiConfig.KEY);

  apiConfs.forEach((apiConf) => {
    const conf = new DocumentBuilder()
      .setTitle(apiConf.title)
      .setDescription(apiConf.description)
      .setVersion(apiConf.version)
      // .addTag(apiConf.tag)
      .build();

    const document = SwaggerModule.createDocument(app, conf, {
      include: apiConf.root,
      deepScanRoutes: true,
    });
    SwaggerModule.setup(apiConf.path, app, document);
  });

  app.useGlobalPipes(new ValidationPipeCustomException());
  // to inject nestJS services to class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(commonConf.port);
}
bootstrap();
