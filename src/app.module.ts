import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { SocketsModule } from './sockets/sockets.module';
import { UsersModule } from './users/users.module';
import { HelpersModule } from './helpers/helpers.module';
import { SchemasModule } from './schemas/schemas.module';
import { RedisModule } from 'nestjs-redis';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UsersModule,
    HelpersModule,
    ConfigModule,
    SchemasModule,
    SocketsModule,
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({ url: configService.redisUri }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
