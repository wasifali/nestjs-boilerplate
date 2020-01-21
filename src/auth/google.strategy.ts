import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { StrategyNames } from '../common/enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, StrategyNames.GOOGLE_STRATEGY) {
  constructor(private readonly authService: AuthService) {
    super(async (request, done) => {
      try {
        const user = await this.authService.googleLogin(
          request.body.idToken,
          request.body.platform,
        );
        done(undefined, user);
      } catch (e) {
        done(e, undefined);
      }
    });
  }
}
