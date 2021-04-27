import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import commonConfig from 'config/common.config';
import databaseConfig from 'config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // cache: true,
      isGlobal: true,
      // ignoreEnvFile: true,
      envFilePath: ['.env.local', '.env.dev', '.env'],
      load: [commonConfig, databaseConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
