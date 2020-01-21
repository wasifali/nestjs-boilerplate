import { HttpModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { ConfigModule } from '../config/config.module';
import { HelpersModule } from '../helpers/helpers.module';
import { SessionSerializer } from './session.serializer';
import { GoogleStrategy } from './google.strategy';
import { OAuth2Client } from 'google-auth-library';
import { RegisterStrategy } from './register.strategy';

@Module({
  imports: [UsersModule, PassportModule, ConfigModule, HelpersModule, HttpModule, HelpersModule],
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer,
    RegisterStrategy,
    GoogleStrategy,
    {
      provide: OAuth2Client,
      useValue: new OAuth2Client(),
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
