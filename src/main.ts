import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import commonConfig from './config/common.config';
import corsConfig from './config/cors.config';
import openapiConfig from './config/openapi.config';
import { AppModule } from './module/app.module';
import { ValidationPipeCustomException } from './pipe/validation.pipe';
import { useContainer } from 'class-validator';
import { HttpExceptionFilter } from './exeption/http-exception.filter';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const commonConf = app.get<ConfigType<typeof commonConfig>>(commonConfig.KEY);
  const corsConf = app.get<ConfigType<typeof corsConfig>>(corsConfig.KEY);
  const apiConfs = app.get<ConfigType<typeof openapiConfig>>(openapiConfig.KEY);

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.enableCors({
    origin: corsConf.origin,
    methods: 'GET,PUT,POST,PATCH,DELETE,UPDATE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Authorization, X-Authorization',
  });

  apiConfs.forEach((apiConf) => {
    const builder = new DocumentBuilder()
      .setTitle(apiConf.title)
      .setDescription(apiConf.description)
      // .addTag(apiConf.tag)
      .setVersion(apiConf.version);

    if (apiConf.auth) {
      builder.addBearerAuth();
    }

    const document = SwaggerModule.createDocument(app, builder.build(), {
      include: apiConf.root,
      deepScanRoutes: true,
    });
    SwaggerModule.setup(apiConf.path, app, document);
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipeCustomException());
  // to inject nestJS services to class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(commonConf.port);
}
bootstrap();
