import { BadRequestException, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { GoogleLoginDto } from '../../auth/types/dto/login.dto';
import { validate } from 'class-validator';
import { HttpErrors } from '../errors';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const googleLogin = new GoogleLoginDto(req.body);
    const errors = await validate(googleLogin);
    if (errors.length) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        error: HttpErrors.BAD_REQUEST,
        message: errors,
      });
    }
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }
}
